# Small E-commerce Backend API

## Run database setup

Run this once after creating your PostgreSQL database:

```bash
psql -U postgres -d jwt -f database_setup.sql
```

If your database/user/name is different, update `backend/.env`.

## Run server

```bash
cd backend
env/bin/uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

## Authentication flow

1. `POST /auth/register`
2. Check backend terminal or email for OTP.
3. `POST /auth/verify-otp`
4. `POST /auth/login`
5. Use the returned token as `Bearer <token>`.
6. `POST /auth/logout` blocks the token.

JWT tokens do not expire automatically. They stop working after logout because the token id is saved in `token_blocklist`.

## Auth APIs

- `POST /auth/register`
- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Dashboard APIs

- `GET /dashboard/summary`

## Shop APIs

- `POST /shop/categories` admin only
- `GET /shop/categories`
- `POST /shop/products` admin only
- `GET /shop/products`
- `GET /shop/products/{product_id}`
- `POST /shop/addresses`
- `GET /shop/addresses`
- `POST /shop/cart`
- `GET /shop/cart`
- `DELETE /shop/cart/{cart_item_id}`
- `POST /shop/orders`
- `GET /shop/orders`

The first registered user becomes admin automatically.
