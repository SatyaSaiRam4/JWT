import smtplib
from email.message import EmailMessage

from fastapi import HTTPException

from app.config.settings import settings


def send_email(to_email: str, subject: str, body: str):
    if not settings.SMTP_HOST:
        print("Email sending is not configured.")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(body)
        return

    message = EmailMessage()
    message["From"] = settings.MAIL_FROM or settings.SMTP_USER
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
            server.starttls()
            if settings.SMTP_USER:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=500,
            detail="Email login failed. Check SMTP_USER and SMTP_PASSWORD."
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Email sending failed: {error}"
        )
