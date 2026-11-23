# UPI Gateways Flutter & Dart SDK

Official Flutter & Dart SDK for [UPI Gateways](https://www.upigateways.in) — The Zero Transaction Fee (0% MDR) UPI Payment Infrastructure for Indian Developers and Businesses.

Accept UPI payments across Google Pay, PhonePe, Paytm, BHIM, and bank UPI apps directly into your merchant bank account with instant T+0 settlement.

## Installation

Add this package to your `pubspec.yaml`:

```yaml
dependencies:
  upigateways: ^1.0.0
```

Or run:

```bash
flutter pub add upigateways
```

## Quickstart

```dart
import 'package:upigateways/upigateways.dart';

final client = UpiGatewaysClient(
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
);

final order = await client.createOrder(
  amount: 499.00,
  clientTxnId: 'ORDER_100452',
  customerName: 'Aditi Rao',
  redirectUrl: 'https://yourstore.com/success',
);

print('Payment URL: ${order['data']['payment_url']}');
```

## Documentation

Full documentation is available at [https://www.upigateways.in/developer](https://www.upigateways.in/developer).
