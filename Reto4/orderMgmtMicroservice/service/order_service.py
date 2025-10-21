from dto.order_dto import OrderCreateDTO, OrderUpdateDTO
from repository import order_repository
from uuid import uuid4


class OrderService:
    async def create_order(self, payload: OrderCreateDTO) -> bool:
        order_id = payload.orderID or str(uuid4())
        doc = {
            "customerid": payload.customerid,
            "orderID": order_id,
            "status": payload.status,
        }
        return await order_repository.create_order_doc(doc)

    async def update_order_status(self, payload: OrderUpdateDTO) -> bool:
        return await order_repository.update_order_status_doc(payload.orderID, payload.status)

    async def find_by_customerid(self, customerid: str):
        return await order_repository.find_by_customerid_doc(customerid)
