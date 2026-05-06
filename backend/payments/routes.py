# backend/payments/routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from payments.paystack import initialize_payment, verify_payment

router = APIRouter()


# ─── Request Models ───────────────────────────────────────────────────────────

class InitPaymentPayload(BaseModel):
    email: str
    amount: int
    plan: str
    org_id: str


# ─── Initialize Payment ───────────────────────────────────────────────────────

@router.post("/initialize")
def init_payment(payload: InitPaymentPayload):
    """
    Initialize a Paystack payment for a subscription plan.
    Returns a Paystack authorization URL to redirect the user to.
    """
    response = initialize_payment(
        email=payload.email,
        amount=payload.amount,
        plan=payload.plan,
        org_id=payload.org_id
    )

    if not response.get("status"):
        raise HTTPException(status_code=400, detail="Payment initialization failed")

    return {
        "authorization_url": response["data"]["authorization_url"],
        "access_code": response["data"]["access_code"],
        "reference": response["data"]["reference"],
    }


# ─── Verify Payment ───────────────────────────────────────────────────────────

@router.get("/verify/{reference}")
def verify(reference: str):
    """
    Verify a Paystack payment using the transaction reference.
    Activates the org's plan if payment was successful.
    """
    response = verify_payment(reference)
    data = response.get("data", {})

    if data.get("status") != "success":
        raise HTTPException(status_code=400, detail="Payment was not successful")

    metadata = data.get("metadata", {})
    plan = metadata.get("plan")
    org_id = metadata.get("org_id")
    amount = data.get("amount", 0) / 100  # convert back from kobo

    # ── TODO: Activate the org's plan in your database ──────────────────────
    # Example (replace with your actual DB logic):
    # await activate_org_plan(org_id=org_id, plan=plan, amount=amount)
    # ────────────────────────────────────────────────────────────────────────

    return {
        "success": True,
        "plan": plan,
        "org_id": org_id,
        "amount": amount,
        "reference": reference,
    }