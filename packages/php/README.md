# UPI Gateways PHP SDK

[![Packagist Version](https://img.shields.io/packagist/v/upigateways/sdk.svg)](https://packagist.org/packages/upigateways/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP: >=7.4](https://img.shields.io/badge/php-%3E%3D7.4-blue.svg)](https://www.php.net/)

Official PHP & Laravel SDK for [UPI Gateways](https://www.upigateways.in) — The 0% Transaction Fee (0% MDR) UPI Payment Infrastructure for Indian Developers and Businesses.

Connect multiple merchant UPI accounts (Paytm Business, PhonePe, BharatPe, HDFC SmartHub Vyapar) into Laravel, CodeIgniter, Symfony, or custom PHP applications with zero commission deductions and instant T+0 direct bank settlement.

---

## Installation

Install via [Composer](https://getcomposer.org/):

```bash
composer require upigateways/sdk
```

---

## Quickstart

### 1. Initialize the Client

Retrieve your API credentials from your [UPI Gateways Dashboard](https://www.upigateways.in/developer).

```php
use UpiGateways\Client;

$client = new Client(
    apiKey: getenv('UPI_GATEWAYS_API_KEY'),
    apiSecret: getenv('UPI_GATEWAYS_API_SECRET')
);
```

### 2. Create a Payment Session

```php
$order = $client->createOrder(499.00, [
    'customer_name' => 'Aditi Rao',
    'customer_mobile' => '9876543210',
    'customer_email' => 'aditi@example.com',
    'order_id' => 'ORDER_100452',
    'redirect_url' => 'https://yourstore.com/checkout/success',
    'webhook_url' => 'https://api.yourstore.com/webhooks/upi',
    'note' => 'Subscription Plan Renewal',
]);

echo "Checkout URL: " . $order['payment_url'];
echo "UPI Intent: " . $order['upi_intent'];
```

### 3. Check Order Status

```php
$status = $client->getOrderStatus('ORDER_100452');

if ($status['status'] === 'Success') {
    echo "Payment verified! UTR: " . $status['utr_number'];
} else {
    echo "Current Status: " . $status['status'];
}
```

### 4. Verify Webhooks (Laravel / Native PHP)

```php
use UpiGateways\Webhooks;

$rawBody = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_SIGNATURE'] ?? '';
$secret = getenv('UPI_GATEWAYS_API_SECRET');

if (!Webhooks::verifySignature($rawBody, $signature, $secret)) {
    http_response_code(401);
    exit('Invalid webhook signature');
}

$payload = Webhooks::parsePayload($rawBody);
if ($payload['status'] === 'SUCCESS') {
    // Fulfill order in database
    $utr = $payload['utr'] ?? 'N/A';
}
```

---

## Useful Links

- [Official Documentation](https://www.upigateways.in/docs)
- [0% Fee Payment Gateway Calculator](https://www.upigateways.in/free-upi-payment-gateway)
- [Bank UPI Daily Limits Directory](https://www.upigateways.in/bank-upi-limits)
- [WooCommerce UPI Plugin](https://www.upigateways.in/woocommerce-upi-plugin)
- [Node.js & TypeScript SDK](https://www.npmjs.com/package/upigateways)

---

## License

MIT © [UPI Gateways](https://www.upigateways.in)
