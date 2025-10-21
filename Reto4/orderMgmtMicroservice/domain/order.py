from dataclasses import dataclass


@dataclass
class Order:
    customerid: str
    orderID: str
    status: str
