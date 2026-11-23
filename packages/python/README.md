# UPI Gateways Python SDK

[![PyPI version](https://img.shields.io/pypi/v/upigateways.svg)](https://pypi.org/project/upigateways/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)

Official Python SDK for [UPI Gateways](https://www.upigateways.in) — The 0% Transaction Fee (0% MDR) UPI Payment Infrastructure with Instant T+0 Direct Bank Settlement.

Eliminate 2% MDR deductions and nodal escrow delays. Integrate UPI QR codes, mobile deep links, and automated webhook order fulfillment into Django, FastAPI, Flask, or any Python backend.

---

## Installation

```bash
pip install upigateways
```

*Zero external dependencies: runs on pure Python standard library (`urllib`, `hmac`, `hashlib`).*

---

## Quickstart

### 1. Initialize the Client

Retrieve your API credentials from your [UPI Gateways Dashboard](https://www.upigateways.in/developer).

```python
import os
from upigateways import UpiGatewaysClient

client = UpiGatewaysClient(
    api_key=os.environ["UPI_GATEWAYS_API_KEY"],
    api_secret=os.environ["UPI_GATEWAYS_API_SECRET"],
)
```

### 2. Create a Payment Session

```python
order = client.create_order(
    amount=499.00,
    customer_name="Aarav Patel",
    customer_mobile="9876543210",
    customer_email="aarav@example.com",
    order_id="ORD_10029",
    redirect_url="https://yourstore.com/checkout/success",
    webhook_url="https://api.yourstore.com/webhooks/upi",
    description="Pro Membership Plan",
)

print("Checkout URL:", order["payment_url"])
print("Mobile UPI Intent:", order["upi_intent"])
print("Order ID:", order["order_id"])
```

### 3. Check Order Status

```python
status = client.get_order_status("ORD_10029")

if status["status"] == "Success":
    print("Payment Verified! Bank UTR:", status["utr_number"])
else:
    print("Payment Status:", status["status"])
```

### 4. Verify Webhooks (FastAPI / Flask / Django)

```python
from fastapi import FastAPI, Request, HTTPException
from upigateways import verify_webhook_signature, parse_webhook_payload
import os

app = FastAPI()

@app.post("/webhooks/upi")
async def upi_webhook(request: Request):
    raw_body = await request.body()
    signature = request.headers.get("x-signature", "")
    secret = os.environ["UPI_GATEWAYS_API_SECRET"]

    if not verify_webhook_signature(raw_body, signature, secret):
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = parse_webhook_payload(raw_body)
    print(f"Order {payload['order_id']} is {payload['status']}")
    print(f"Bank UTR: {payload.get('utr')}")

    return {"status": "ok"}
```

---

## Useful Links

- [Official Documentation](https://www.upigateways.in/docs)
- [0% Fee Payment Gateway Calculator](https://www.upigateways.in/free-upi-payment-gateway)
- [Bank UPI Daily Limits Directory](https://www.upigateways.in/bank-upi-limits)
- [Node.js & TypeScript SDK](https://www.npmjs.com/package/upigateways)

---

## License

MIT © [UPI Gateways](https://www.upigateways.in)
