from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from routers.auth import get_current_user
from services.database_service import create_address, get_user_addresses, get_address_by_id

router = APIRouter()

class AddressCreate(BaseModel):
    street: str
    city: str
    state: str
    zipCode: str
    country: str = "Colombia"
    isDefault: bool = False
    instructions: Optional[str] = None

@router.post("/addresses", status_code=status.HTTP_201_CREATED)
async def create_user_address(
    address: AddressCreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear nueva dirección para el usuario"""
    try:
        new_address = await create_address(
            user_id=current_user["userId"],
            street=address.street,
            city=address.city,
            state=address.state,
            zip_code=address.zipCode,
            country=address.country,
            is_default=address.isDefault,
            instructions=address.instructions
        )
        
        if not new_address:
            raise HTTPException(status_code=500, detail="Error creating address")
        
        return {
            "message": "Address created successfully",
            "address": new_address
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/addresses")
async def get_addresses(
    current_user: dict = Depends(get_current_user)
):
    """Obtener todas las direcciones del usuario"""
    addresses = await get_user_addresses(current_user["userId"])
    return {"addresses": addresses}

@router.get("/addresses/{address_id}")
async def get_address(
    address_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Obtener dirección por ID"""
    address = await get_address_by_id(address_id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    # Verificar que la dirección pertenece al usuario
    if address["userId"] != current_user["userId"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {"address": address}
