from pydantic import BaseModel, Field
from typing import Optional


class OrderCreateDTO(BaseModel):
    customerid: str = Field(..., example="cust-123")
    orderID: Optional[str] = Field(None, example="order-uuid")
    status: str = Field(..., example="PENDING")


class OrderUpdateDTO(BaseModel):
    orderID: str = Field(..., example="order-uuid")
    status: str = Field(..., example="SHIPPED")


class OrderResponseDTO(BaseModel):
    customerid: str
    orderID: str
    status: str
