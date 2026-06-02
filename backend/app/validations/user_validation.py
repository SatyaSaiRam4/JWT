from fastapi import HTTPException


def validate_password(password: str):

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    return True