# Backend Line-by-Line Explanation

This file explains the FastAPI backend for a fresher. Read it slowly with the code open beside it.

## Why Your API Was Failing

Your frontend was running on:

```text
http://localhost:5174
```

Your backend was running on:

```text
http://127.0.0.1:8000
```

Different port means different browser origin, so CORS can block requests. The backend now accepts any frontend origin during development:

```python
allow_origins=["*"]
allow_credentials=False
allow_methods=["*"]
allow_headers=["*"]
```

Important: If the backend server is not running, Chrome may also show `Provisional headers are shown`. Start backend with:

```bash
cd backend
env/bin/uvicorn app.main:app --reload
```

## Project Flow

1. Frontend calls API endpoint.
2. FastAPI route receives the request.
3. Pydantic schema validates the request body.
4. Service function runs business logic.
5. SQLAlchemy talks to PostgreSQL.
6. Response schema returns clean JSON to frontend.

## Auth Flow

1. Register user.
2. Backend hashes password.
3. Backend saves user.
4. Backend creates OTP.
5. User verifies OTP.
6. User logs in.
7. Backend returns JWT token.
8. Frontend sends token in `Authorization: Bearer <token>`.
9. Protected APIs check token.
10. Logout stores token id in `token_blocklist`, so the same token stops working.

## `backend/app/main.py`

Purpose: This is the starting point of the FastAPI backend.

Line 1: Imports `FastAPI`, the main class used to create the API app.
Line 2: Imports CORS middleware so the frontend can call the backend from another port.
Line 4: Imports database `engine` and SQLAlchemy `Base`.
Line 5: Imports models so SQLAlchemy knows which tables exist.
Line 7: Imports auth routes.
Line 8: Imports dashboard routes with a different local name.
Line 9: Imports shop routes with a different local name.
Line 11: Creates database tables if they do not already exist.
Line 13: Creates the FastAPI app object.
Line 14: Sets the API title shown in Swagger docs.
Line 15: Closes the FastAPI app creation.
Line 17: Starts adding middleware to the app.
Line 18: Chooses CORS middleware.
Line 19: Allows requests from any frontend origin in development.
Line 20: Disables cookie credentials; JWT is sent in headers, so this is fine.
Line 21: Allows all HTTP methods like GET, POST, DELETE.
Line 22: Allows all request headers, including `Authorization`.
Line 23: Ends CORS setup.
Line 25: Adds `/auth` routes to the app.
Line 26: Adds `/dashboard` routes to the app.
Line 27: Adds `/shop` routes to the app.
Line 30: Creates a GET API for `/`.
Line 31: Defines the function for the home route.
Line 32: Starts the JSON response.
Line 33: Returns a simple health message.
Line 34: Ends the JSON response.

## `backend/app/config/settings.py`

Purpose: Reads configuration values from `.env`, with safe defaults.

Line 1: Imports `BaseSettings`, used for environment variable settings.
Line 4: Defines the `Settings` class.
Line 5: Database host, default `localhost`.
Line 6: Database port, default PostgreSQL port `5432`.
Line 7: Database name.
Line 8: Database username.
Line 9: Database password.
Line 11: Secret key used to sign JWT tokens.
Line 12: JWT algorithm, usually `HS256`.
Line 14: SMTP host for email sending.
Line 15: SMTP port for email sending.
Line 16: SMTP username.
Line 17: SMTP password.
Line 18: Email address used as sender.
Line 19: OTP validity time in minutes.
Line 21: Starts Pydantic config.
Line 22: Tells Pydantic to load values from `.env`.
Line 23: Ignores old or extra `.env` variables instead of crashing.
Line 26: Creates one settings object used by the backend.

## `backend/app/database/connections.py`

Purpose: Connects FastAPI to PostgreSQL.

Line 1: Imports SQLAlchemy function to create a database engine.
Line 2: Imports `sessionmaker`, used to create database sessions.
Line 3: Imports `DeclarativeBase`, base class for all models.
Line 5: Imports settings like DB username and password.
Line 8: Starts building the PostgreSQL connection URL.
Line 9: Adds database user.
Line 10: Adds database password.
Line 11: Adds database host.
Line 12: Adds database port.
Line 13: Adds database name.
Line 14: Ends the connection string.
Line 17: Creates the SQLAlchemy engine.
Line 19: Creates a session factory.
Line 20: Disables autocommit, so we manually call `commit()`.
Line 21: Disables autoflush for simpler beginner behavior.
Line 22: Connects the session factory to the engine.
Line 23: Ends session factory setup.
Line 26: Creates the parent class for SQLAlchemy models.
Line 27: Empty class body; models inherit from this.
Line 30: Defines dependency used by routes to get DB access.
Line 31: Opens a database session.
Line 33: Starts safe `try/finally`.
Line 34: Gives the DB session to the route.
Line 35: Runs after the request finishes.
Line 36: Closes the DB session.

## `backend/app/models/user_model.py`

Purpose: Defines all database tables using SQLAlchemy models.

Line 1: Imports SQLAlchemy column/data types.
Line 2: Imports relationship helper for table connections.
Line 3: Imports database `now()` helper.
Line 5: Imports `Base`, the parent class for models.
Line 8: Starts the `User` table model.
Line 9: Sets actual database table name to `users`.
Lines 11-15: Defines `id` as integer primary key.
Lines 17-21: Defines unique required username.
Lines 23-27: Defines unique required email.
Lines 29-32: Defines required password field, storing the hashed password.
Line 34: Optional phone number.
Line 35: Says whether email OTP is verified.
Line 36: Says whether user is admin.
Line 37: Saves creation timestamp.
Line 39: Connects user to addresses.
Line 40: Connects user to cart items.
Line 41: Connects user to orders.
Line 44: Starts OTP table model.
Line 45: Sets table name to `otp_codes`.
Line 47: OTP row id.
Line 48: Email that receives OTP.
Line 49: OTP code.
Line 50: OTP purpose, like `verify_email` or `reset_password`.
Line 51: Prevents reusing OTP.
Line 52: Stores OTP expiry time.
Line 53: Stores OTP creation time.
Line 56: Starts token logout table.
Line 57: Sets table name to `token_blocklist`.
Line 59: Row id.
Line 60: JWT unique id. Logged out tokens are saved here.
Line 61: Stores logout/block time.
Line 64: Starts category model.
Line 65: Sets table name to `categories`.
Line 67: Category id.
Line 68: Unique required category name.
Line 69: Optional category description.
Line 71: Connects category to products.
Line 74: Starts product model.
Line 75: Sets table name to `products`.
Line 77: Product id.
Line 78: Required product name.
Line 79: Optional product description.
Line 80: Product price with 10 digits and 2 decimal places.
Line 81: Product stock count.
Line 82: Optional product image URL.
Line 83: Optional foreign key to category.
Line 84: Product creation time.
Line 86: Connects product to category.
Line 87: Connects product to cart items.
Line 88: Connects product to order items.
Line 91: Starts address model.
Line 92: Sets table name to `addresses`.
Line 94: Address id.
Line 95: User id foreign key.
Lines 96-101: Address fields.
Line 103: Connects address back to user.
Line 106: Starts cart item model.
Line 107: Sets table name to `cart_items`.
Line 109: Cart item id.
Line 110: User id foreign key.
Line 111: Product id foreign key.
Line 112: Quantity in cart.
Line 114: Connects cart item to user.
Line 115: Connects cart item to product.
Line 118: Starts order model.
Line 119: Sets table name to `orders`.
Line 121: Order id.
Line 122: User id foreign key.
Line 123: Optional address id foreign key.
Line 124: Order status, default `placed`.
Line 125: Order total amount.
Line 126: Order creation time.
Line 128: Connects order to user.
Line 129: Connects order to order items.
Line 132: Starts order item model.
Line 133: Sets table name to `order_items`.
Line 135: Order item id.
Line 136: Order id foreign key.
Line 137: Product id foreign key.
Line 138: Quantity ordered.
Line 139: Product price at order time.
Line 141: Connects order item to order.
Line 142: Connects order item to product.

## `backend/app/auth/hashing.py`

Purpose: Hashes passwords and checks passwords safely.

Line 1: Imports Passlib password hashing context.
Lines 4-7: Creates bcrypt hashing configuration.
Line 10: Defines function to hash plain password.
Line 11: Returns hashed password.
Lines 14-17: Defines function to verify plain password against hashed password.
Lines 18-21: Returns true or false from Passlib verification.

## `backend/app/auth/jwt_handler.py`

Purpose: Creates JWT tokens and protects private APIs.

Line 1: Imports UUID generator for token id.
Line 3: Imports FastAPI dependency and error helpers.
Line 4: Imports bearer-token helper.
Line 5: Imports JWT functions and JWT error type.
Line 6: Imports database session type.
Line 8: Imports JWT settings.
Line 9: Imports database dependency.
Line 10: Imports User and TokenBlocklist models.
Line 13: Configures FastAPI auth to read bearer tokens.
Line 16: Defines function to create JWT.
Line 18: Copies data so original dictionary is not changed.
Line 19: Adds a unique token id called `jti`.
Lines 21-25: Encodes the token using secret key and algorithm.
Line 27: Returns the JWT string.
Line 30: Defines function to decode JWT.
Line 31: Starts error handling.
Lines 32-36: Decodes token and validates signature.
Line 37: Catches invalid token errors.
Line 38: Returns HTTP 401 if token is invalid.
Lines 41-44: Defines dependency to get logged-in user.
Line 45: Decodes the token.
Line 46: Reads token id from token.
Line 47: Reads user id from token.
Line 49: Checks if token was logged out.
Lines 50-51: Rejects logged-out token.
Line 53: Finds user in database.
Lines 54-55: Rejects request if user no longer exists.
Line 57: Returns current user to route.

## `backend/app/auth/auth_service.py`

Purpose: Contains main authentication business logic.

Line 1: Imports random number generator for OTP.
Line 2: Imports date/time tools for OTP expiry.
Line 4: Imports HTTP error helper.
Line 5: Imports database session type.
Line 7: Imports app settings.
Line 8: Imports OTP, logout-token, and user models.
Line 9: Imports email sending function.
Lines 11-14: Imports password hashing/checking functions.
Lines 16-19: Imports JWT create/decode functions.
Line 22: Defines function to create and send OTP.
Line 23: Creates a random 6-digit OTP.
Lines 24-26: Calculates expiry time.
Lines 28-33: Creates OTP database object.
Line 34: Adds OTP row to database.
Line 35: Saves OTP row.
Lines 37-41: Sends OTP email or prints OTP in terminal.
Line 43: Returns success message.
Line 46: Defines OTP verification function.
Lines 47-57: Finds latest unused OTP matching email, code, and purpose.
Lines 59-60: Rejects invalid OTP.
Lines 62-64: Makes expiry timezone-safe.
Lines 66-67: Rejects expired OTP.
Line 69: Marks OTP as used.
Line 70: Saves OTP update.
Line 71: Returns OTP row.
Lines 74-80: Defines register function inputs.
Lines 82-86: Checks if email already exists.
Lines 88-92: Rejects duplicate email.
Line 94: Checks if this is the first user.
Lines 96-102: Creates user object and makes first user admin.
Line 104: Adds user to database.
Line 105: Saves user.
Line 106: Reloads user with id.
Line 108: Sends verify-email OTP.
Line 110: Returns created user.
Lines 113-117: Defines login function inputs.
Lines 119-123: Finds user by email.
Lines 125-129: Rejects missing user.
Lines 131-138: Checks password and rejects wrong password.
Lines 140-144: Rejects login before email verification.
Lines 146-151: Creates JWT token with user id and email.
Lines 153-156: Returns token response.
Line 159: Defines email verification function.
Line 160: Verifies OTP for `verify_email`.
Line 162: Finds user by email.
Lines 163-164: Rejects missing user.
Line 166: Marks user verified.
Line 167: Saves user update.
Line 169: Returns success message.
Line 172: Defines forgot-password function.
Line 173: Finds user by email.
Lines 174-175: Rejects missing user.
Line 177: Sends reset-password OTP.
Line 180: Defines reset-password function.
Line 181: Verifies reset-password OTP.
Line 183: Finds user.
Lines 184-185: Rejects missing user.
Line 187: Hashes and saves new password.
Line 188: Saves password update.
Line 190: Returns success message.
Line 193: Defines logout function.
Line 194: Decodes token.
Line 195: Reads token id.
Line 197: Creates token blocklist row.
Line 198: Adds row to database.
Line 199: Saves logout.
Line 201: Returns logout success.

## `backend/app/services/email_service.py`

Purpose: Sends email through SMTP, or prints email locally if SMTP is not configured.

Line 1: Imports Python SMTP library.
Line 2: Imports email message builder.
Line 4: Imports email settings.
Line 7: Defines email sending function.
Line 8: Checks if SMTP is not configured.
Lines 9-12: Prints email details and OTP to terminal for local testing.
Line 13: Stops function after printing.
Line 15: Creates an email message object.
Line 16: Sets sender email.
Line 17: Sets receiver email.
Line 18: Sets subject.
Line 19: Sets plain text body.
Line 21: Opens SMTP connection.
Line 22: Starts TLS security.
Lines 23-24: Logs in if username is configured.
Line 25: Sends the email.

## `backend/app/validations/user_validation.py`

Purpose: Keeps validation rules outside routes.

Line 1: Imports HTTP error helper.
Line 4: Defines password validation function.
Line 6: Checks password length.
Lines 7-10: Raises error if password is too short.
Line 12: Returns true when password is valid.

## `backend/app/schemas/user_schema.py`

Purpose: Defines request and response shapes for auth APIs.

Line 1: Imports Pydantic base model.
Line 2: Imports email validator type.
Line 3: Imports optional type.
Line 6: Starts register request schema.
Line 7: Username field.
Line 8: Email field with validation.
Line 9: Password field.
Line 10: Optional phone field.
Line 13: Starts login request schema.
Line 14: Login email.
Line 15: Login password.
Line 18: Starts user response schema.
Line 19: User id in response.
Line 20: Username in response.
Line 21: Email in response.
Line 22: Phone in response.
Line 23: Verification status in response.
Line 24: Admin status in response.
Lines 26-28: Allows Pydantic to read SQLAlchemy model objects.
Line 31: Starts token response schema.
Line 32: JWT token string.
Line 33: Token type, normally `bearer`.
Line 36: Starts email-only request schema.
Line 37: Email field.
Line 40: Starts OTP verification schema.
Line 41: Email field.
Line 42: OTP field.
Line 45: Starts password reset schema.
Line 46: Email field.
Line 47: OTP field.
Line 48: New password field.

## `backend/app/schemas/shop_schema.py`

Purpose: Defines request and response shapes for shop APIs.

Line 1: Imports Decimal for money values.
Line 2: Imports typing helpers.
Line 4: Imports Pydantic base model.
Line 7: Starts category create schema.
Line 8: Category name.
Line 9: Optional description.
Line 12: Category response inherits create fields.
Line 13: Adds category id.
Line 15: Allows reading SQLAlchemy model objects.
Line 18: Starts product create schema.
Line 19: Product name.
Line 20: Optional product description.
Line 21: Product price.
Line 22: Product stock.
Line 23: Optional image URL.
Line 24: Optional category id.
Line 27: Product response inherits create fields.
Line 28: Adds product id.
Line 30: Allows reading SQLAlchemy model objects.
Line 33: Starts address create schema.
Lines 34-39: Address fields.
Line 42: Address response inherits create fields.
Line 43: Adds address id.
Line 45: Allows reading SQLAlchemy model objects.
Line 48: Starts cart item create schema.
Line 49: Product id to add.
Line 50: Quantity, default 1.
Line 53: Starts cart item response schema.
Line 54: Cart item id.
Line 55: Product id.
Line 56: Quantity.
Line 57: Nested product details.
Line 59: Allows reading SQLAlchemy model objects.
Line 62: Starts order create schema.
Line 63: Optional address id.
Line 66: Starts order item response schema.
Lines 67-70: Order item fields.
Line 72: Allows reading SQLAlchemy model objects.
Line 75: Starts order response schema.
Lines 76-79: Order response fields and nested items.
Line 81: Allows reading SQLAlchemy model objects.

## `backend/app/routes/auth_routes.py`

Purpose: Defines all `/auth` API endpoints.

Lines 1-3: Import FastAPI route, dependency, and bearer-token helpers.
Line 5: Imports database session type.
Line 7: Imports database dependency.
Lines 9-17: Imports auth request/response schemas.
Lines 19-27: Imports auth service functions.
Line 28: Imports current-user dependency.
Line 29: Imports User model for type hint.
Lines 31-33: Imports password validator.
Lines 36-39: Creates router with `/auth` prefix and Swagger tag.
Line 40: Configures bearer token reader for logout.
Lines 43-46: Declares `POST /auth/register` and response schema.
Lines 47-50: Defines register route inputs.
Line 52: Validates password.
Lines 54-60: Calls service to register user.
Lines 63-66: Declares `POST /auth/login`.
Lines 67-70: Defines login route inputs.
Lines 72-76: Calls login service.
Line 79: Declares `POST /auth/send-otp`.
Lines 80-83: Defines send OTP route inputs.
Line 84: Sends verify-email OTP.
Line 87: Declares `POST /auth/verify-otp`.
Lines 88-91: Defines verify route inputs.
Line 92: Verifies email OTP.
Line 95: Declares `POST /auth/forgot-password`.
Lines 96-99: Defines forgot-password inputs.
Line 100: Sends reset OTP.
Line 103: Declares `POST /auth/reset-password`.
Lines 104-107: Defines reset-password inputs.
Line 108: Validates new password.
Line 109: Resets password.
Line 112: Declares `POST /auth/logout`.
Lines 113-116: Reads token and DB session.
Line 117: Logs out token.
Line 120: Declares `GET /auth/me`.
Lines 121-123: Gets current user from JWT.
Line 124: Returns current user.

## `backend/app/routes/dashboard_routes.py`

Purpose: Provides dashboard summary data for frontend cards.

Line 1: Imports router and dependency helpers.
Line 2: Imports database session type.
Line 4: Imports current-user dependency.
Line 5: Imports database dependency.
Line 6: Imports models used for counts.
Line 9: Creates router with `/dashboard` prefix.
Line 12: Declares `GET /dashboard/summary`.
Lines 13-16: Defines route inputs: DB and logged-in user.
Line 17: Starts response dictionary.
Lines 18-24: Returns current user info.
Line 25: Starts counts object.
Line 26: Counts all products.
Line 27: Counts all categories.
Lines 28-32: Counts logged-in user's cart items.
Lines 33-37: Counts logged-in user's orders.
Line 39: Ends response dictionary.

## `backend/app/routes/shop_routes.py`

Purpose: Defines product, category, address, cart, and order APIs.

Line 1: Imports Decimal for order total.
Line 3: Imports FastAPI router, dependency, and errors.
Line 4: Imports database session type.
Line 6: Imports current-user dependency.
Line 7: Imports database dependency.
Lines 8-16: Imports database models.
Lines 17-28: Imports shop schemas.
Line 31: Creates router with `/shop` prefix.
Line 34: Defines helper to allow only admins.
Lines 35-36: Rejects non-admin users.
Line 39: Declares `POST /shop/categories`.
Lines 40-44: Defines create category inputs.
Line 45: Checks admin access.
Line 47: Converts request body to Category model.
Line 48: Adds category.
Line 49: Saves category.
Line 50: Reloads category with id.
Line 51: Returns category.
Line 54: Declares `GET /shop/categories`.
Line 55: Defines list categories input.
Line 56: Returns categories newest first.
Line 59: Declares `POST /shop/products`.
Lines 60-64: Defines create product inputs.
Line 65: Checks admin access.
Line 67: Converts request body to Product model.
Line 68: Adds product.
Line 69: Saves product.
Line 70: Reloads product with id.
Line 71: Returns product.
Line 74: Declares `GET /shop/products`.
Line 75: Defines list products input.
Line 76: Returns products newest first.
Line 79: Declares `GET /shop/products/{product_id}`.
Line 80: Defines get product input.
Line 81: Finds product by id.
Lines 82-83: Rejects missing product.
Line 84: Returns product.
Line 87: Declares `POST /shop/addresses`.
Lines 88-92: Defines create address inputs.
Line 93: Creates address for logged-in user.
Line 94: Adds address.
Line 95: Saves address.
Line 96: Reloads address with id.
Line 97: Returns address.
Line 100: Declares `GET /shop/addresses`.
Lines 101-104: Defines list addresses inputs.
Line 105: Returns only current user's addresses.
Line 108: Declares `POST /shop/cart`.
Lines 109-113: Defines add-to-cart inputs.
Line 114: Finds product.
Lines 115-116: Rejects missing product.
Lines 117-118: Rejects invalid quantity.
Lines 120-127: Checks if product already exists in user's cart.
Lines 128-129: If found, increases quantity.
Lines 130-136: If not found, creates a cart item.
Line 138: Saves cart change.
Line 139: Reloads cart item.
Line 140: Returns cart item.
Line 143: Declares `GET /shop/cart`.
Lines 144-147: Defines cart inputs.
Line 148: Returns current user's cart.
Line 151: Declares `DELETE /shop/cart/{cart_item_id}`.
Lines 152-156: Defines delete cart inputs.
Lines 157-161: Finds user's cart item.
Lines 162-163: Rejects missing cart item.
Line 165: Deletes item.
Line 166: Saves delete.
Line 167: Returns success message.
Line 170: Declares `POST /shop/orders`.
Lines 171-175: Defines place order inputs.
Line 176: Loads current user's cart.
Lines 177-178: Rejects empty cart.
Line 180: Starts total amount at zero.
Line 181: Loops through cart items.
Lines 182-186: Rejects order if stock is not enough.
Line 187: Adds line price to total.
Lines 189-193: Creates order object.
Line 194: Adds order.
Line 195: Flushes so order id is available before commit.
Line 197: Loops through cart items again.
Lines 198-203: Creates order item records.
Line 204: Reduces product stock.
Line 205: Adds order item.
Line 206: Deletes cart item after ordering.
Line 208: Saves order, stock, and cart changes.
Line 209: Reloads order.
Line 210: Returns order.
Line 213: Declares `GET /shop/orders`.
Lines 214-217: Defines my orders inputs.
Line 218: Returns current user's orders.

## `backend/database_setup.sql`

Purpose: Updates/creates PostgreSQL tables manually, useful because you already had a `users` table.

Lines 1-4: Add missing columns to existing `users` table.
Lines 6-14: Create OTP table.
Line 16: Add index for faster OTP lookup by email.
Lines 18-22: Create token blocklist table for logout.
Line 24: Add index for faster logged-out token lookup.
Lines 26-30: Create categories table.
Lines 32-41: Create products table.
Lines 43-52: Create addresses table.
Lines 54-59: Create cart items table.
Lines 61-68: Create orders table.
Lines 70-76: Create order items table.

## `backend/requirements.txt`

Purpose: Lists Python packages needed by this backend.

Line 1: `fastapi` creates the API server.
Line 2: `uvicorn` runs the FastAPI app.
Line 3: `sqlalchemy` handles database ORM.
Line 4: `psycopg2-binary` connects Python to PostgreSQL.
Line 5: `python-jose[cryptography]` creates and validates JWT tokens.
Line 6: `passlib[bcrypt]` hashes passwords.
Line 7: `python-dotenv` helps load `.env`.
Line 8: `pydantic-settings` reads settings from environment.
Line 9: `email-validator` validates email fields.
Line 10: `alembic` is for database migrations, useful later.

## Common API Errors

### CORS Error

Cause: frontend and backend are on different ports and backend did not allow that origin.

Fix: already updated in `app/main.py`.

### Backend Not Running

Cause: frontend calls `http://127.0.0.1:8000`, but FastAPI server is stopped.

Fix:

```bash
cd backend
env/bin/uvicorn app.main:app --reload
```

### Database Not Running

Cause: FastAPI starts but cannot connect to PostgreSQL.

Fix: start PostgreSQL and check `.env` values.

### Existing Users Table Missing Columns

Cause: You created `users` before new fields were added.

Fix:

```bash
cd backend
psql -U postgres -d jwt -f database_setup.sql
```

### Login Fails After Register

Cause: user must verify OTP first.

Fix: check backend terminal for OTP if SMTP is not configured, then call `/auth/verify-otp`.
