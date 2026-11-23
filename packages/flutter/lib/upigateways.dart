/// Official Flutter and Dart SDK for UPI Gateways.
/// Zero Transaction Fee (0% MDR) UPI Payment Gateway for Indian merchants and developers.
/// Learn more at https://www.upigateways.in
library upigateways;

import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:http/http.dart' as http;

/// Client to interact with the UPI Gateways API.
class UpiGatewaysClient {
  final String apiKey;
  final String apiSecret;
  final String baseUrl;
  final http.Client _httpClient;

  static const String defaultBaseUrl = 'https://www.upigateways.in/api/v2';

  UpiGatewaysClient({
    required this.apiKey,
    required this.apiSecret,
    this.baseUrl = defaultBaseUrl,
    http.Client? httpClient,
  }) : _httpClient = httpClient ?? http.Client();

  /// Create a dynamic UPI QR and intent payment session.
  Future<Map<String, dynamic>> createOrder({
    required double amount,
    required String clientTxnId,
    String? customerName,
    String? customerEmail,
    String? customerMobile,
    String? pInfo,
    String? redirectUrl,
    String? webhookUrl,
    String? udf1,
    String? udf2,
    String? udf3,
  }) async {
    final uri = Uri.parse('$baseUrl/create_order');
    final payload = {
      'key': apiKey,
      'client_txn_id': clientTxnId,
      'amount': amount.toStringAsFixed(2),
      'p_info': pInfo ?? 'Product Payment',
      'customer_name': customerName ?? '',
      'customer_email': customerEmail ?? '',
      'customer_mobile': customerMobile ?? '',
      'redirect_url': redirectUrl ?? '',
      'webhook_url': webhookUrl ?? '',
      'udf1': udf1 ?? '',
      'udf2': udf2 ?? '',
      'udf3': udf3 ?? '',
    };

    final response = await _httpClient.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'upigateways-flutter/1.0.0',
      },
      body: jsonEncode(payload),
    );

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400 || data['status'] == false) {
      throw Exception(data['msg'] ?? 'UPI Gateways order creation failed');
    }
    return data;
  }

  /// Check the real-time status of an existing order.
  Future<Map<String, dynamic>> getOrderStatus({
    required String clientTxnId,
    required String txnDate,
  }) async {
    final uri = Uri.parse('$baseUrl/check_order_status');
    final payload = {
      'key': apiKey,
      'client_txn_id': clientTxnId,
      'txn_date': txnDate,
    };

    final response = await _httpClient.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'upigateways-flutter/1.0.0',
      },
      body: jsonEncode(payload),
    );

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  /// Verify HMAC-SHA256 signature for incoming webhooks.
  static bool verifyWebhookSignature({
    required String rawBody,
    required String signature,
    required String secret,
  }) {
    final hmacSha256 = Hmac(sha256, utf8.encode(secret));
    final digest = hmacSha256.convert(utf8.encode(rawBody));
    return digest.toString().toLowerCase() == signature.toLowerCase();
  }
}
