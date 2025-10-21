from fastapi import APIRouter, HTTPException
from dto.order_dto import OrderCreateDTO, OrderUpdateDTO, OrderResponseDTO
from service.order_service import OrderService

router = APIRouter()
service = OrderService()


@router.post("/createorder")
async def create_order(payload: OrderCreateDTO):
    ok = await service.create_order(payload)
    if not ok:
        raise HTTPException(status_code=500, detail="Could not create order")
    return {"orderCreated": True}


@router.put("/updateorderstatus")
async def update_order_status(payload: OrderUpdateDTO):
    ok = await service.update_order_status(payload)
    if not ok:
        raise HTTPException(status_code=404, detail="orderID not found")
    return {"orderStatusUpdated": True}


@router.get("/findorderbycustomerid")
async def find_by_customerid(customerid: str):
    items = await service.find_by_customerid(customerid)
    return items
