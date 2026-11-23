# UPI Gateways SDKs & Developer Tools

<div align="center">

[![npm version](https://img.shields.io/npm/v/upigateways.svg)](https://www.npmjs.com/package/upigateways)
[![PyPI version](https://img.shields.io/pypi/v/upigateways.svg)](https://pypi.org/project/upigateways/)
[![Pub Version](https://img.shields.io/pub/v/upigateways.svg)](https://pub.dev/packages/upigateways)
[![Packagist version](https://img.shields.io/packagist/v/upigateways/sdk.svg)](https://packagist.org/packages/upigateways/sdk)
[![crates.io version](https://img.shields.io/crates/v/upigateways.svg)](https://crates.io/crates/upigateways)
[![Go Reference](https://pkg.go.dev/badge/github.com/matrixsols/upigateways-sdk/packages/go.svg)](https://pkg.go.dev/github.com/matrixsols/upigateways-sdk/packages/go)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Official multi-language client SDKs for [UPI Gateways](https://www.upigateways.in) — The Zero Fee (0% MDR) UPI Payment Infrastructure for Indian Merchants & Developers.**

Instant T+0 settlements directly into your bank account. No 2% aggregator cuts. Connect Paytm Business, PhonePe, BharatPe, and HDFC SmartHub with automated routing.

</div>

---

## Supported SDKs & Registries

| Language | Package / Registry | Installation | Documentation |
| :--- | :--- | :--- | :--- |
| **Node.js / TypeScript** | [npm: `upigateways`](https://www.npmjs.com/package/upigateways) | `npm install upigateways` | [packages/node](packages/node) |
| **Flutter / Dart** | [pub.dev: `upigateways`](https://pub.dev/packages/upigateways) | `flutter pub add upigateways` | [packages/flutter](packages/flutter) |
| **Python (FastAPI, Django)** | [PyPI: `upigateways`](https://pypi.org/project/upigateways/) | `pip install upigateways` | [packages/python](packages/python) |
| **PHP (Laravel, Symfony)** | [Packagist: `upigateways/sdk`](https://packagist.org/packages/upigateways/sdk) | `composer require upigateways/sdk` | [packages/php](packages/php) |
| **Rust** | [crates.io: `upigateways`](https://crates.io/crates/upigateways) | `cargo add upigateways` | [packages/rust](packages/rust) |
| **Golang** | [pkg.go.dev](https://pkg.go.dev/github.com/matrixsols/upigateways-sdk/packages/go) | `go get github.com/matrixsols/upigateways-sdk/packages/go` | [packages/go](packages/go) |

---

## Quickstart

### 1. Node.js / TypeScript

```typescript
import { UpiGatewaysClient } from 'upigateways';

const client = new UpiGatewaysClient({
  apiKey: process.env.UPI_GATEWAYS_API_KEY!,
  apiSecret: process.env.UPI_GATEWAYS_API_SECRET!,
});

const order = await client.orders.create({
  amount: 499.00,
  clientTxnId: 'TXN_' + Date.now(),
  customerName: 'Aditi Rao',
  redirectUrl: 'https://yourstore.com/success',
});

console.log('Payment URL:', order.paymentUrl);
```

### 2. Python

```python
from upigateways import UpiGatewaysClient

client = UpiGatewaysClient(
    api_key="YOUR_API_KEY",
    api_secret="YOUR_API_SECRET",
)

order = client.create_order(
    amount=499.00,
    client_txn_id="TXN_100234",
    customer_name="Aditi Rao",
    redirect_url="https://yourstore.com/success",
)

print("Payment URL:", order.payment_url)
```

### 3. PHP / Laravel

```php
use UpiGateways\Client;

$client = new Client('YOUR_API_KEY', 'YOUR_API_SECRET');

$order = $client->createOrder(499.00, [
    'client_txn_id' => 'ORDER_100452',
    'customer_name' => 'Aditi Rao',
    'redirect_url' => 'https://yourstore.com/checkout/success',
]);

echo "Payment URL: " . $order['payment_url'];
```

### 4. Golang

```go
package main

import (
    "context"
    "fmt"
    upigateways "github.com/matrixsols/upigateways-sdk/packages/go"
)

func main() {
    client := upigateways.NewClient("YOUR_API_KEY", "YOUR_API_SECRET")

    res, _ := client.CreateOrder(context.Background(), upigateways.CreateOrderRequest{
        Amount:       499.00,
        ClientTxnID:  "TXN_987654",
        CustomerName: "Aditi Rao",
        RedirectURL:  "https://yourstore.com/success",
    })

    fmt.Println("Payment URL:", res.Data.PaymentURL)
}
```

---

## Features

- **0% Transaction Fees (0% MDR):** Stop losing 2% to 3% on every customer payment.
- **Instant Bank Settlement (T+0):** Payments land straight into your linked bank account.
- **Smart Gateway Routing:** Intelligently rotate between multiple UPI QR accounts (Paytm, PhonePe, BharatPe, HDFC).
- **HMAC-SHA256 Signatures:** Secure, tamper-proof webhook notifications.
- **High Availability:** Resilient fallbacks and automated failover.

---

## Documentation & Support

- **Website & Portal:** [https://www.upigateways.in](https://www.upigateways.in)
- **Developer Documentation:** [https://www.upigateways.in/developer](https://www.upigateways.in/developer)
- **Support Email:** `support@upigateways.in`

## License

This project is licensed under the [MIT License](LICENSE).
