# API Reference

Base URL: `http://localhost:<PORT>/api` (plus `GET /api/health`, which lives outside the versioned-looking prefix but is not actually versioned — see [known issues](./05-known-issues.md)).

**Auth header** (for every endpoint marked 🔒 Admin):
```
Authorization: Bearer <jwt token>
```

**Error shape** (all errors, every endpoint):
```json
{ "message": "Human-readable explanation" }
```
Status codes used throughout: `400` validation, `401` auth, `404` not found, `409` conflict, `429` rate limited, `500` unexpected.

---

## Health

### `GET /api/health`
Public. No rate limit.

**200**
```json
{ "status": "ok", "database": "up", "uptime": 1234, "timestamp": "2026-10-01T12:00:00.000Z" }
```
**503** if the DB ping fails: `{ "status": "error", "database": "down", "timestamp": "..." }`

---

## Auth — `/api/auth`

### `POST /api/auth/login`
Public. Rate limited: **10 requests / 15 min / IP**.

Request:
```json
{ "username": "admin", "password": "secret123" }
```

**200**
```json
{ "token": "eyJhbGciOi...", "username": "admin" }
```

Errors: `400` missing username/password · `401` wrong credentials (same message whether the username doesn't exist or the password is wrong) · `429` too many attempts.

### `GET /api/auth/me` 🔒 Admin
Returns the identity encoded in the current token. Useful for "is my session still valid" checks on app load.

**200**
```json
{ "username": "admin" }
```

---

## Categories — `/api/categories`

### `GET /api/categories`
Public. Returns all categories, alphabetical by `cat_name`.

**200**
```json
[{ "id": 1, "cat_name": "Pain Relief" }, { "id": 2, "cat_name": "Vitamins" }]
```

### `POST /api/categories` 🔒 Admin
```json
{ "cat_name": "Vitamins" }
```
**201** → created category. **400** empty/>100 chars. **409** name already exists.

### `PUT /api/categories/:id` 🔒 Admin
Same body as create. **200** updated category. **400** invalid id or name. **404** not found. **409** name already exists.

### `DELETE /api/categories/:id` 🔒 Admin
**200** `{ "message": "Category deleted" }`. **404** not found. **409** `"Cannot delete: this category has products"`.

---

## Products — `/api/products`

### `GET /api/products`
Public. Only `is_active: true` products.

Query: `?category=<id>` (optional).

**200**
```json
[
  {
    "id": 10,
    "name": "Panadol Extra 20s",
    "description": "...",
    "rating": "5",
    "retail_price": 300,
    "discount": 10,
    "price_after_discount": 270,
    "category_id": 1,
    "image": "/uploads/products/1790831920646-647995d5ddf33a97.jpg",
    "is_active": true,
    "created_at": "2026-09-30T10:00:00.000Z",
    "category": { "id": 1, "cat_name": "Pain Relief" }
  }
]
```

### `GET /api/products/admin/all` 🔒 Admin
Same shape as above, but includes inactive products. Same `?category=` filter.

> Note: this route is declared **before** `GET /api/products/:id` in `routes/product.routes.js`, which is why `admin/all` isn't accidentally captured as an `:id` value of `"admin"`. Route order matters here — keep any new static sub-paths above the `:id` route.

### `GET /api/products/:id`
Public. **200** single product (same shape as above, with `category`). **404** if missing **or** if `is_active: false` (inactive products are indistinguishable from nonexistent ones to the public).

### `POST /api/products` 🔒 Admin
`multipart/form-data`. Fields:

| Field | Required | Rules |
|---|---|---|
| `name` | yes | string, 1-200 chars |
| `description` | no | string |
| `rating` | no | one of `"1"`..`"5"`, default `"5"` |
| `retail_price` | yes | integer ≥ 1 |
| `discount` | no | integer 0-100, default 0 |
| `category_id` | yes | integer, must reference an existing category |
| `is_active` | no | boolean (accepts `true`/`false`/`1`/`0`), default `true` |
| `image` | no | file, jpeg/png/webp, ≤ 2 MB, form field name must be `image` |

`price_after_discount` is **never** accepted from the client — it's always computed server-side.

**201** created product. **400** validation error (image, if uploaded, is deleted on failure). **400** `category_id` doesn't exist.

### `PUT /api/products/:id` 🔒 Admin
Same fields as create, all optional (partial update) except that if you omit `name`/`retail_price`/`category_id` the existing values are kept — only fields actually present in the body are validated/changed. Uploading a new `image` deletes the previous image file from disk. **200** updated product. **404** not found.

### `DELETE /api/products/:id` 🔒 Admin
Deletes the product row and its image file from disk. **200** `{ "message": "Product deleted" }`. **404** not found.

---

## Orders — `/api/orders`

### `POST /api/orders`
Public. Rate limited: **20 requests / hour / IP**.

Request:
```json
{
  "customer_name": "Ali Raza",
  "customer_phone": "03001234567",
  "city": "Lahore",
  "address": "House 12, Street 4, DHA Phase 5",
  "items": [
    { "product_id": 10, "quantity": 2 },
    { "product_id": 14, "quantity": 1 }
  ]
}
```

Validation rules:
- `customer_name`: 2-120 chars
- `customer_phone`: accepts `03XXXXXXXXX`, `+923XXXXXXXXX`, or `923XXXXXXXXX` — normalized to `03XXXXXXXXX` before saving; anything else is rejected
- `city`: 2-80 chars
- `address`: 5-500 chars
- `items`: array of 1-20 entries; each `quantity` 1-20; duplicate `product_id`s in the array are merged (quantities summed) rather than rejected
- Country defaults to `"Pakistan"`, `payment_method` is always `"COD"` — neither is accepted as input

**201**
```json
{
  "id": 55,
  "order_number": "AD-261001-7K4PX2",
  "customer_name": "Ali Raza",
  "customer_phone": "03001234567",
  "city": "Lahore",
  "address": "House 12, Street 4, DHA Phase 5",
  "country": "Pakistan",
  "payment_method": "COD",
  "subtotal": 540,
  "shipping": 0,
  "total": 540,
  "status": "pending",
  "courier": null,
  "tracking_number": null,
  "notes": null,
  "created_at": "2026-10-01T12:00:00.000Z",
  "items": [
    { "id": 101, "order_id": 55, "product_id": 10, "product_name": "Panadol Extra 20s", "quantity": 2, "unit_price": 270 },
    { "id": 102, "order_id": 55, "product_id": 14, "product_name": "Vitamin C 500mg", "quantity": 1, "unit_price": 0 }
  ]
}
```

Errors: `400` validation · `400` `"One or more products are not available"` (unknown, deleted, or inactive product id) · `429` too many orders from this IP.

### `GET /api/orders` 🔒 Admin
Query: `?status=<pending|confirmed|shipped|delivered|cancelled>` (optional), `?page=<n>` (optional, default 1, page size fixed at 20).

**200**
```json
{
  "orders": [ /* order rows, no items included — use GET /:id for items */ ],
  "total": 143,
  "page": 1,
  "pages": 8
}
```

### `GET /api/orders/:id` 🔒 Admin
**200** full order including `items`. **404** not found.

### `PATCH /api/orders/:id` 🔒 Admin
Body: any subset of —

| Field | Rules |
|---|---|
| `status` | must be a legal transition from the current status (see [state machine](./03-backend-flow.md#5-admin-order-management)) |
| `shipping` | integer 0-100000; changing it recomputes `total = subtotal + shipping` |
| `courier` | string, ≤ 50 chars |
| `tracking_number` | string, ≤ 60 chars |
| `notes` | string, ≤ 1000 chars |

**200** updated order (with items). **400** empty body, invalid status, or illegal transition. **404** not found. **409** order is `delivered`/`cancelled` (closed, no further edits allowed).

---

## Static files

### `GET /uploads/products/<filename>`
Public, served directly by Express (`express.static`), not through `/api`. This is what the `image` field on a product points to (prefixed with `/uploads/...`).
