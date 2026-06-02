from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryResponse(CategoryCreate):
    id: int

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    stock: int
    image_url: Optional[str] = None
    category_id: Optional[int] = None


class ProductResponse(ProductCreate):
    id: int

    model_config = {"from_attributes": True}


class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line: str
    city: str
    state: str
    pincode: str


class AddressResponse(AddressCreate):
    id: int

    model_config = {"from_attributes": True}


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    address_id: Optional[int] = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    status: str
    total_amount: Decimal
    items: List[OrderItemResponse]

    model_config = {"from_attributes": True}
