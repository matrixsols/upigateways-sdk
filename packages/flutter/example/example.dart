import 'package:upigateways/upigateways.dart';

void main() async {
  final client = UpiGatewaysClient(
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET',
  );

  try {
    final order = await client.createOrder(
      amount: 499.00,
      clientTxnId: 'TXN_${DateTime.now().millisecondsSinceEpoch}',
      customerName: 'Aditi Rao',
      redirectUrl: 'https://yourstore.com/success',
    );

    print('Payment URL: ${order['data']['payment_url']}');
    print('UPI Intent: ${order['data']['upi_intent']}');
  } catch (e) {
    print('Error creating order: $e');
  }
}
