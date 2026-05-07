from fastapi import FastAPI
from payments.routes import router as payment_router

app = FastAPI()

app.include_router(payment_router, prefix="/api/payment")