# Backend Flow

How the main user journeys move through the system, end to end.

## 1. Admin login

```mermaid
sequenceDiagram
    participant C as Admin client
    participant R as POST /api/auth/login
    participant M as loginLimiter
    participant S as auth.service.js
    participant DB as MySQL (admins)

    C->>R: { username, password }
    R->>M: rate-limit check (10 / 15min / IP)
    M-->>R: ok (else 429)
    R->>S: login(username, password)
    S->>DB: findOne({ where: { username } })
    DB-->>S: admin row or null
    S->>S: bcrypt.compare(password, password_hash)
    alt no match
        S-->>C: 401 "Invalid username or password"
    else match
        S->>S: jwt.sign({ id, username }, JWT_SECRET, { expiresIn })
        S-->>C: 200 { token, username }
    end
```

The client stores `token` and sends it as `Authorization: Bearer <token>` on every subsequent admin request. `GET /api/auth/me` is the cheapest way to check "am I still logged in" — it just echoes `req.admin.username` set by the `auth` middleware after verifying the JWT.

There is no logout endpoint: logging out is purely a client-side action (discard the token). The token stays valid server-side until it expires (`JWT_EXPIRES_IN`, default `1d`) — see [known issues](./05-known-issues.md).

## 2. Public catalog browsing

- `GET /api/categories` — all categories, no auth, used to populate filters/menus.
- `GET /api/products?category=ID` — only `is_active = true` products, optionally filtered by category, newest first.
- `GET /api/products/:id` — single product; if it exists but `is_active = false`, the API returns a **404** (not 403) — an inactive product should look identical to "doesn't exist" to a public client.

## 3. Admin catalog management (categories & products)

All writes require `Authorization: Bearer <token>` (checked by `middleware/auth.js`).

- **Categories:** plain CRUD. Create/update reject duplicate names with `409`; delete is blocked with `409` if any product still references the category (DB foreign key constraint, translated by the service layer).
- **Products:** create/update accept `multipart/form-data` (because of the optional image file). Flow for an image-bearing write:

```mermaid
sequenceDiagram
    participant C as Admin client
    participant U as uploadImage middleware (multer)
    participant Ctl as product.controller.js
    participant S as product.service.js
    participant DB as MySQL (products)
    participant FS as disk (uploads/products)

    C->>U: multipart form (fields + image file)
    U->>FS: write file as <timestamp>-<randomHex>.<ext from MIME type>
    U-->>Ctl: req.file + req.body
    Ctl->>Ctl: buildData() — validate every field by hand
    alt validation fails
        Ctl->>FS: delete the just-uploaded file (cleanup)
        Ctl-->>C: 400 with specific message
    else valid
        Ctl->>S: create/update(data)
        S->>DB: verify category_id exists
        S->>S: price_after_discount = round(retail_price * (1 - discount/100))
        S->>DB: INSERT/UPDATE product
        alt update replaced an existing image
            S->>FS: delete the old image file
        end
        S-->>Ctl: product row
        Ctl-->>C: 201/200 product JSON
    end
```

Deleting a product also deletes its image file from disk (`productService.remove`).

## 4. Checkout — placing an order (public, no login)

This is the most business-critical flow: it must be impossible for a client to manipulate prices.

```mermaid
sequenceDiagram
    participant C as Customer (storefront)
    participant R as POST /api/orders
    participant L as orderLimiter
    participant Ctl as order.controller.js
    participant S as order.service.js
    participant DB as MySQL

    C->>R: { customer_name, customer_phone, city, address, items: [{product_id, quantity}] }
    R->>L: rate-limit check (20 / hour / IP)
    Ctl->>Ctl: buildOrder() — validate text fields, normalize phone to 03XXXXXXXXX, validate 1-20 items, qty 1-20 each
    Ctl->>S: create({ customer, items })
    S->>S: merge duplicate product_ids, sum quantities
    S->>DB: SELECT products WHERE id IN (...) AND is_active = true
    alt any requested product missing or inactive
        S-->>C: 400 "One or more products are not available"
    else all valid
        S->>S: subtotal = Σ (current price_after_discount × quantity)
        S->>S: total = subtotal + 0 (shipping set later by admin)
        S->>DB: BEGIN TRANSACTION
        S->>DB: INSERT order (order_number = AD-YYMMDD-XXXXXX)
        S->>DB: INSERT order_items (snapshot product_name + unit_price)
        S->>DB: COMMIT
        S-->>C: 201 order + items
    end
```

Key guarantees:
- **No client-supplied prices anywhere.** Every price in the order comes from a fresh DB read of `Product.price_after_discount` at the moment of checkout.
- **Snapshotting.** `order_items.product_name` and `.unit_price` are copied at order time so the order record stays accurate even if the product is later renamed, repriced, or deleted.
- **Atomicity.** Order + its line items are written in one Sequelize transaction — a crash mid-write can't leave an order with no items.
- **Order number** (`utils/orderNumber.js`): `AD-<YYMMDD>-<6 random chars>`, drawn from an alphabet that excludes visually-ambiguous characters (`0/O`, `1/I`) so it can be read aloud over a phone call — this is a COD business, so customer service calls are expected.

## 5. Admin order management

```mermaid
stateDiagram-v2
    [*] --> pending
    pending --> confirmed
    pending --> cancelled
    confirmed --> shipped
    confirmed --> cancelled
    shipped --> delivered
    delivered --> [*]
    cancelled --> [*]
```

Enforced in `order.service.js` via a `NEXT_STATUS` transition table:
- `pending → confirmed | cancelled`
- `confirmed → shipped | cancelled`
- `shipped → delivered`
- `delivered` and `cancelled` are terminal — **any** further `PATCH` on a closed order (even just updating `notes`) is rejected with `409 "This order is closed and cannot be changed"`.
- Requesting a status not in the current state's allowed list returns `400`.

Besides `status`, an admin can PATCH `shipping`, `courier`, `tracking_number`, `notes`. Changing `shipping` recomputes `total = subtotal + shipping` automatically — subtotal itself is immutable after creation.

`GET /api/orders` supports `?status=` filtering and `?page=` pagination (fixed page size of 20, newest first).

## 6. Error handling (applies to every flow above)

```mermaid
flowchart LR
    A[Controller/service throws] --> B{AppError?<br/>isOperational=true}
    B -->|yes| C["Respond with err.statusCode + err.message<br/>(e.g. 400, 401, 404, 409)"]
    B -->|no, e.g. raw DB error or bug| D["console.error(err) server-side"]
    D --> E["Respond 500 'Something went wrong'<br/>(message hidden from client)"]
```

Every async controller is wrapped in `asyncHandler`, so a thrown/rejected error always reaches this pipeline instead of crashing the process or hanging the request.
