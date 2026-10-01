# Aleem Duakhana — Backend Documentation

Internal reference docs for the `backend/` service: a REST API for an online
pharmacy/store (admin-managed catalog, cash-on-delivery ordering).

## Contents

| Doc | What's in it |
|---|---|
| [01-system-design.md](./01-system-design.md) | Tech stack, architecture layers, request lifecycle, security posture |
| [02-schema-design.md](./02-schema-design.md) | Database tables, columns, relationships, ER diagram |
| [03-backend-flow.md](./03-backend-flow.md) | Step-by-step flow for auth, catalog browsing, checkout, order management, image upload |
| [04-api-reference.md](./04-api-reference.md) | Every endpoint: method, auth, request/response shape, errors |
| [05-known-issues.md](./05-known-issues.md) | Gaps and inconsistencies found during review, with suggested fixes |

## 60-second overview

- **Stack:** Node.js (ESM) + Express 5 + Sequelize 6 + MySQL, JWT auth, Multer for image uploads.
- **Shape:** `routes → controllers → services → models`, single MySQL database, local disk storage for product images under `/uploads`.
- **Actors:** one role only — **Admin** (manages categories/products/orders) and **anonymous customers** (browse catalog, place orders). There is no customer account system — orders are guest checkout by design.
- **Money rule:** prices are never trusted from the client. `price_after_discount` is always computed server-side from `retail_price` and `discount`, and order totals are built from the current DB price at order time.
- **Entry point:** `server.js` → connects to MySQL via Sequelize → starts `app/app.js` (the Express app) on `PORT`.

Run locally:
```
npm run dev      # nodemon server.js
npm run seed      # create/update an admin user (scripts/seedAdmin.js)
```
