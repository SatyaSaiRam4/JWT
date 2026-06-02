from fastapi import APIRouter
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.database.connections import get_db

from app.schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    EmailRequest,
    VerifyOTPRequest,
    ResetPasswordRequest
)

from app.auth.auth_service import (
    create_and_send_otp,
    forgot_password,
    register_user,
    login_user,
    logout_user,
    reset_password,
    verify_user_email
)
from app.auth.jwt_handler import get_current_user
from app.models.user_model import User

from app.validations.user_validation import (
    validate_password
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db)
):

    validate_password(payload.password)

    return register_user(
        db,
        payload.username,
        payload.email,
        payload.password,
        payload.phone
    )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    payload: UserLogin,
    db: Session = Depends(get_db)
):

    return login_user(
        db,
        payload.email,
        payload.password
    )


@router.post("/send-otp")
def send_otp(
    payload: EmailRequest,
    db: Session = Depends(get_db)
):
    return create_and_send_otp(db, payload.email, "verify_email")


@router.post("/verify-otp")
def verify_otp_route(
    payload: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    return verify_user_email(db, payload.email, payload.otp)


@router.post("/forgot-password")
def forgot_password_route(
    payload: EmailRequest,
    db: Session = Depends(get_db)
):
    return forgot_password(db, payload.email)


@router.post("/reset-password")
def reset_password_route(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    validate_password(payload.new_password)
    return reset_password(db, payload.email, payload.otp, payload.new_password)


@router.post("/logout")
def logout(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    return logout_user(db, token)


@router.get("/me", response_model=UserResponse)
def my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user
