import random
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.models.user_model import OTPCode, TokenBlocklist, User
from app.services.email_service import send_email

from app.auth.hashing import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token,
    decode_token
)


def create_and_send_otp(db: Session, email: str, purpose: str):
    code = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.OTP_EXPIRE_MINUTES
    )

    otp = OTPCode(
        email=email,
        code=code,
        purpose=purpose,
        expires_at=expires_at
    )
    db.add(otp)
    db.commit()

    send_email(
        email,
        "Your OTP code",
        f"Your OTP is {code}. It is valid for {settings.OTP_EXPIRE_MINUTES} minutes."
    )

    return {"message": "OTP sent to email"}


def verify_otp(db: Session, email: str, code: str, purpose: str):
    otp = (
        db.query(OTPCode)
        .filter(
            OTPCode.email == email,
            OTPCode.code == code,
            OTPCode.purpose == purpose,
            OTPCode.is_used == False
        )
        .order_by(OTPCode.id.desc())
        .first()
    )

    if not otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    expires_at = otp.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP expired")

    otp.is_used = True
    db.commit()
    return otp


def register_user(
    db: Session,
    username: str,
    email: str,
    password: str,
    phone: str | None = None
):

    existing_user = (
        db.query(User)
        .filter((User.email == email) | (User.username == username))
        .first()
    )

    if existing_user:
        detail = "Email already exists"
        if existing_user.username == username:
            detail = "Username already exists"
        raise HTTPException(
            status_code=400,
            detail=detail
        )

    is_first_user = db.query(User).count() == 0

    user = User(
        username=username,
        email=email,
        password=hash_password(password),
        phone=phone,
        is_admin=is_first_user
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Email or username already exists"
        )

    create_and_send_otp(db, email, "verify_email")

    return user


def login_user(
    db: Session,
    email: str,
    password: str
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before login"
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


def verify_user_email(db: Session, email: str, code: str):
    verify_otp(db, email, code, "verify_email")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_verified = True
    db.commit()

    return {"message": "Email verified successfully"}


def forgot_password(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return create_and_send_otp(db, email, "reset_password")


def reset_password(db: Session, email: str, code: str, new_password: str):
    verify_otp(db, email, code, "reset_password")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(new_password)
    db.commit()

    return {"message": "Password reset successfully"}


def logout_user(db: Session, token: str):
    payload = decode_token(token)
    jti = payload.get("jti")

    blocked = TokenBlocklist(jti=jti)
    db.add(blocked)
    db.commit()

    return {"message": "Logged out successfully"}
