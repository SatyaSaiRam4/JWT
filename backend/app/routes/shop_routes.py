from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.jwt_handler import get_current_user
from app.database.connections import get_db
from app.models.user_model import (
    Address,
    CartItem,
    Category,
    Order,
    OrderItem,
    Product,
    User,
)
from app.schemas.shop_schema import (
    AddressCreate,
    AddressResponse,
    CartItemCreate,
    CartItemResponse,
    CategoryCreate,
    CategoryResponse,
    OrderCreate,
    OrderResponse,
    ProductCreate,
    ProductResponse,
)


router = APIRouter(prefix="/shop", tags=["Shop"])


def require_admin(user: User):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")


@router.post("/categories", response_model=CategoryResponse)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/categories", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.id.desc()).all()


@router.post("/products", response_model=ProductResponse)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/products", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).order_by(Product.id.desc()).all()


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/addresses", response_model=AddressResponse)
def create_address(
    payload: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    address = Address(user_id=current_user.id, **payload.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.get("/addresses", response_model=list[AddressResponse])
def list_my_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Address).filter(Address.user_id == current_user.id).all()


@router.post("/cart", response_model=CartItemResponse)
def add_to_cart(
    payload: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    item = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id == payload.product_id,
        )
        .first()
    )
    if item:
        item.quantity += payload.quantity
    else:
        item = CartItem(
            user_id=current_user.id,
            product_id=payload.product_id,
            quantity=payload.quantity,
        )
        db.add(item)

    db.commit()
    db.refresh(item)
    return item


@router.get("/cart", response_model=list[CartItemResponse])
def my_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(CartItem).filter(CartItem.user_id == current_user.id).all()


@router.delete("/cart/{cart_item_id}")
def remove_cart_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == cart_item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(item)
    db.commit()
    return {"message": "Cart item removed"}


@router.post("/orders", response_model=OrderResponse)
def place_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = Decimal("0.00")
    for item in cart_items:
        if item.product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {item.product.name}",
            )
        total += item.product.price * item.quantity

    order = Order(
        user_id=current_user.id,
        address_id=payload.address_id,
        total_amount=total,
    )
    db.add(order)
    db.flush()

    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price,
        )
        item.product.stock -= item.quantity
        db.add(order_item)
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order


@router.get("/orders", response_model=list[OrderResponse])
def my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Order).filter(Order.user_id == current_user.id).all()
