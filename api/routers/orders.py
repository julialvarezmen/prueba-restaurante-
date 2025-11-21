from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from enum import Enum
from routers.auth import get_current_user
from services.database_service import create_order, get_order_status, get_all_orders
from services.rabbitmq import publish_order

router = APIRouter()

class PaymentMethod(str, Enum):
    CASH = "CASH"
    CARD = "CARD"

class OrderItem(BaseModel):
    productId: str
    quantity: int
    price: float

class CreateOrderRequest(BaseModel):
    addressId: str
    items: List[OrderItem]
    total: float
    paymentMethod: PaymentMethod = PaymentMethod.CASH
    notes: Optional[str] = None

@router.post("/")
async def create_new_order(
    order_data: CreateOrderRequest,
    current_user: dict = Depends(get_current_user)
):
    """Crear nuevo pedido"""
    try:
        # Crear orden en la base de datos
        order = await create_order(
            user_id=current_user["userId"],
            address_id=order_data.addressId,
            items=[item.dict() for item in order_data.items],
            total=order_data.total,
            payment_method=order_data.paymentMethod.value,
            notes=order_data.notes
        )
        
        if not order:
            raise HTTPException(status_code=500, detail="Error creating order")
        
        # Publicar orden a RabbitMQ
        await publish_order(order)
        
        return {"order": order, "message": "Order created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{order_id}")
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Obtener estado de un pedido"""
    order = await get_order_status(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order": order}

@router.get("/")
async def get_orders(
    current_user: dict = Depends(get_current_user)
):
    """Obtener todos los pedidos (requiere autenticación)"""
    orders = await get_all_orders()
    return {"orders": orders}
