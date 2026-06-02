from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.jwt_handler import get_current_user
from app.database.connections import get_db
from app.models.user_model import CartItem, Category, Order, Product, User


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "is_verified": current_user.is_verified,
            "is_admin": current_user.is_admin,
        },
        "counts": {
            "products": db.query(Product).count(),
            "categories": db.query(Category).count(),
            "my_cart_items": (
                db.query(CartItem)
                .filter(CartItem.user_id == current_user.id)
                .count()
            ),
            "my_orders": (
                db.query(Order)
                .filter(Order.user_id == current_user.id)
                .count()
            ),
        },
    }
