import requests
import os

PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")


def initialize_payment(email, amount):
    url = "https://api.paystack.co/transaction/initialize"

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "email": email,
        "amount": amount * 100,  # convert to kobo
        "callback_url": "http://localhost:3000/payment-success"
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()


def verify_payment(reference):
    url = f"https://api.paystack.co/transaction/verify/{reference}"

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
    }

    response = requests.get(url, headers=headers)
    return response.json()