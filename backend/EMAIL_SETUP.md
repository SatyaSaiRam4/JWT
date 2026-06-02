# Real OTP Email Setup

Your OTP email will only send if SMTP is configured in `backend/.env`.

## Gmail Setup

1. Open your Google Account.
2. Go to Security.
3. Enable 2-Step Verification.
4. Open App passwords.
5. Create an app password for this backend.
6. Put that app password in `.env`.

Example:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com
SMTP_PASSWORD=your_16_character_app_password
MAIL_FROM=yourgmail@gmail.com
OTP_EXPIRE_MINUTES=10
```

Restart backend after changing `.env`:

```bash
cd backend
env/bin/uvicorn app.main:app --reload
```

## Important

Do not use your normal Gmail password. Gmail SMTP usually rejects normal passwords. You need an App Password.

If SMTP fields are empty, OTP prints in the backend terminal instead of sending email.

## Test Flow

1. Start backend.
2. Start frontend.
3. Register a new user.
4. Check your email inbox/spam folder.
5. Use OTP on verify screen.

If email fails, backend now returns the exact reason, such as:

```text
Email login failed. Check SMTP_USER and SMTP_PASSWORD.
```
