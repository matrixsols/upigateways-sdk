# UPI Gateways Node.js & TypeScript SDK

[![npm version](https://img.shields.io/npm/v/upigateways.svg)](https://www.npmjs.com/package/upigateways)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Node.js & TypeScript SDK for [UPI Gateways](https://www.upigateways.in) — The 0% Transaction Fee (0% MDR) UPI Payment Infrastructure for Indian Developers and Businesses.

Unlike traditional payment aggregators (Razorpay, Cashfree, PayU) that charge 2% + 18% GST and hold merchant funds in nodal accounts for T+2 business days, UPI Gateways settles customer payments directly into your verified bank account in real-time (T+0).

---

## Features

- **0% Transaction Fees:** Collect UPI payments without paying 2% MDR deductions.
- **Instant T+0 Bank Settlement:** Funds transfer directly to your bank account via UPI rails.
- **Dynamic QR & Intent Checkout:** Generate custom QR codes and deep-link UPI intent URLs for Google Pay, PhonePe, Paytm, and BHIM.
- **Multi-Account Smart Routing:** Connect multiple merchant UPI VPAs to bypass bank daily quotas.
- **High-Performance Webhooks:** Real-time callback notifications with HMAC-SHA256 signature verification.
- **TypeScript First:** Complete type definitions included out of the box.

---

## Installation

```bash
npm install upigateways
# or
yarn add upigateways
# or
pnpm add upigateways
```

---

## Quickstart

### 1. Initialize the Client

Get your API credentials from your [UPI Gateways Dashboard](https://www.upigateways.in/developer).

```typescript
import { UpiGatewaysClient } from "upigateways";

const client = new UpiGatewaysClient({
  apiKey: process.env.UPI_GATEWAYS_API_KEY!,
  apiSecret: process.env.UPI_GATEWAYS_API_SECRET!,
});
```

### 2. Create a Payment Session

```typescript
async function createCheckout() {
  const order = await client.orders.create({
    amount: 499.00,
    customerName: "Rahul Sharma",
    customerMobile: "9876543210",
    customerEmail: "rahul@example.com",
    orderId: "ORDER_100234",
    redirectUrl: "https://yourstore.com/checkout/success",
    webhookUrl: "https://api.yourstore.com/webhooks/upi",
    description: "Annual Subscription Plan",
  });

  console.log("Hosted Payment Page:", order.paymentUrl);
  console.log("UPI Intent Link (Mobile):", order.upiIntent);
  console.log("Order Reference:", order.orderId);
}
```

### 3. Check Order Status

```typescript
async function verifyPayment(orderId: string) {
  const status = await client.orders.getStatus({ orderId });

  if (status.status === "Success") {
    console.log("Payment Confirmed! Bank UTR:", status.utrNumber);
  } else {
    console.log("Current Status:", status.status); // "Pending", "Failed", etc.
  }
}
```

### 4. Verify Webhooks Securely

```typescript
import express from "express";
import { verifyWebhookSignature, parseWebhookPayload } from "upigateways";

const app = express();

app.post(
  "/webhooks/upi",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const rawBody = req.body.toString("utf8");
    const signature = req.headers["x-signature"] as string;

    const isValid = verifyWebhookSignature(
      rawBody,
      signature,
      process.env.UPI_GATEWAYS_API_SECRET!
    );

    if (!isValid) {
      return res.status(401).send("Invalid webhook signature");
    }

    const payload = parseWebhookPayload(rawBody);
    console.log(`Order ${payload.order_id} updated to status: ${payload.status}`);
    console.log(`Bank UTR: ${payload.utr}`);

    res.status(200).send("Webhook received");
  }
);
```

---

## Helpful Links

- [Official Documentation](https://www.upigateways.in/docs)
- [0% Fee Payment Gateway Calculator](https://www.upigateways.in/free-upi-payment-gateway)
- [Bank UPI Daily Limits Directory](https://www.upigateways.in/bank-upi-limits)
- [WooCommerce UPI Plugin](https://www.upigateways.in/woocommerce-upi-plugin)

---

## License

MIT © [UPI Gateways](https://www.upigateways.in)
