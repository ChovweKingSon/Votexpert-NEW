from fastapi import APIRouter, HTTPException
from payments.paystack import initialize_payment, verify_payment

router = APIRouter()


@router.post("/initialize-payment")
def init_payment(payload: dict):
    email = payload.get("email")
    amount = payload.get("amount")

    response = initialize_payment(email, amount)

    if not response.get("status"):
        raise HTTPException(status_code=400, detail="Payment init failed")

    return response["data"]


@router.get("/verify-payment/{reference}")
def verify(reference: str):
    response = verify_payment(reference)

    if response["data"]["status"] == "success":
        # 👉 CREATE ELECTION HERE
        return {"message": "Payment successful, election created"}

    return {"message": "Payment not successful"}