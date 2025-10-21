from fastapi import FastAPI, HTTPException

from controller.order_controller import router as order_router
from eureka import start_eureka_registration, stop_eureka_registration

app = FastAPI(title="OrderMgmtMicroservice")


app.include_router(order_router, prefix="/order")


@app.get("/health")
async def health():
    return {"status": "UP"}


@app.on_event("startup")
async def startup_event():
    await start_eureka_registration()


@app.on_event("shutdown")
async def shutdown_event():
    await stop_eureka_registration()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8082)
