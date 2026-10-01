# Known Issues & Recommendations

Observations from reviewing the current code — not blockers, mostly things worth
a conscious decision before the project grows. Roughly ordered by impact.

## 1. No refresh/revocation mechanism for admin tokens
`auth.service.js` issues a JWT with no server-side session record. There's no
`GET /logout`, no blacklist, no refresh token. A leaked token stays valid for
its full `JWT_EXPIRES_IN` (default `1d`) with no way to kill it early.
**Suggestion:** short-lived access token + refresh token stored httpOnly, or at
minimum a server-side revocation list if you need "log this admin out now."

## 2. No pagination on categories or products
`GET /api/products` and `GET /api/categories` return every row, unfiltered by
size. Fine at current catalog size; will degrade as the catalog grows.
**Suggestion:** add `?page`/`?limit` the same way `GET /api/orders` already
does — the pattern already exists in `order.service.js`, just needs reuse.

## 3. No automated tests
No test framework, no `tests/`/`__tests__` directory, no test script in
`package.json`. Validation logic (phone normalization, price calculation,
status transitions) is exactly the kind of pure-ish logic that's cheap to unit
test and easy to regress silently without one.

## 4. `models/category,model.js` — typo'd filename
Comma instead of a period (`category,model.js`, not `category.model.js`). It
works because the import path matches exactly, but it's one accidental
autocomplete away from a broken import, and shows up oddly in any file
listing/search. **Suggestion:** rename to `category.model.js` and update the
one import in `models/index.js`.

## 5. Duplicate `helmet()` call in `app/app.js`
```js
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // second call
```
Two separate `helmet()` middlewares are mounted. The second only exists to set
`crossOriginResourcePolicy` (needed so `/uploads` images can be loaded
cross-origin by the frontend) — harmless, but it reads as accidental.
**Suggestion:** a single call: `helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })`.

## 6. No `.env.example`
`.env` is correctly gitignored, but there's no committed template listing the
required variables (`PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
`JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`). Onboarding a second machine or
a second developer means reverse-engineering the list from `config/database.js`
and `app/app.js`. **Suggestion:** commit a `.env.example` with placeholder values.

## 7. No startup validation of environment variables
If `JWT_SECRET` is undefined, nothing fails at boot — `jwt.sign`/`jwt.verify`
just behave unpredictably the first time a login or protected request happens.
**Suggestion:** a small check in `server.js` (or a `config/env.js`) that throws
immediately if required vars are missing, so a misconfigured deploy fails loud
at startup instead of on the first real request.

## 8. Single admin role, no granular permissions
Every authenticated admin can do everything (manage products, categories, and
orders). Fine for a single-operator store; worth flagging now if you plan to
add staff accounts with restricted access (e.g., a packer who can only update
order status, not touch pricing).

## 9. No soft-delete on products or orders
Deleting a product is a hard `DELETE` (categories are protected by a FK
constraint if they still have products, but products themselves aren't
protected). Order history survives via the `order_items` snapshot fields
(`product_name`, `unit_price`), so past orders stay intact, but the product
itself — and any image file — is gone permanently with no recovery path.
**Suggestion:** if "temporarily hide a product" is a common operation, make
sure the UI nudges toward `is_active: false` rather than delete; consider
reserving hard delete for true cleanup.

## 10. CORS allows exactly one origin
`cors({ origin: process.env.CLIENT_URL })` supports a single configured
origin. If the storefront and the admin panel end up on different domains (a
common split), this will need to become an allowlist/array.

## 11. No migrations — schema lives only in model files
No migrations folder and no `sequelize.sync()` call were found anywhere in the
codebase, meaning the actual MySQL tables are created/maintained outside of
what's in this repo (manually, or via a script not included here). Model files
and the live database schema can silently drift apart with no record of when
or why. **Suggestion:** adopt `sequelize-cli` migrations (or at least check in
the DDL/SQL that created the current tables) so schema changes are tracked
alongside code changes.
