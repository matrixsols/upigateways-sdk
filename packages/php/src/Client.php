<?php

namespace UpiGateways;

use UpiGateways\Exceptions\UpiGatewaysException;

class Client {
    protected string $apiKey;
    protected string $apiSecret;
    protected string $baseUrl;
    protected int $timeout;

    /**
     * @param string $apiKey Your UPI Gateways API Key
     * @param string $apiSecret Your UPI Gateways API Secret
     * @param string $baseUrl Base URL (default: https://www.upigateways.in)
     * @param int $timeout Timeout in seconds (default: 30)
     */
    public function __construct(string $apiKey, string $apiSecret, string $baseUrl = 'https://www.upigateways.in', int $timeout = 30) {
        if (empty($apiKey)) {
            throw new UpiGatewaysException('API Key is required.');
        }
        if (empty($apiSecret)) {
            throw new UpiGatewaysException('API Secret is required.');
        }

        $this->apiKey = $apiKey;
        $this->apiSecret = $apiSecret;
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->timeout = $timeout;
    }

    /**
     * Internal cURL request dispatcher.
     */
    protected function request(string $endpoint, array $data = []): array {
        $url = $this->baseUrl . $endpoint;
        $jsonPayload = json_encode($data);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'x-api-key: ' . $this->apiKey,
            'Authorization: Bearer ' . $this->apiSecret,
            'User-Agent: upigateways-php-sdk/1.0.0',
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            throw new UpiGatewaysException('cURL request failed: ' . $error, 0);
        }

        $decoded = json_decode($response, true);
        if (!is_array($decoded)) {
            throw new UpiGatewaysException('Invalid JSON received from payment server.', $httpCode);
        }

        if ($httpCode >= 400 || (isset($decoded['success']) && !$decoded['success'])) {
            $msg = $decoded['message'] ?? (isset($decoded['error'][0]['message']) ? $decoded['error'][0]['message'] : 'Payment request error');
            $code = $decoded['error'][0]['code'] ?? null;
            throw new UpiGatewaysException($msg, $httpCode, $code);
        }

        return $decoded;
    }

    /**
     * Creates a new UPI Payment Session with 0% MDR fee.
     *
     * @param float $amount Amount in INR (min 1.00)
     * @param array $options Additional options (customer_name, customer_mobile, customer_email, order_id, redirect_url, webhook_url, note)
     * @return array
     */
    public function createOrder(float $amount, array $options = []): array {
        $payload = array_merge([
            'amount' => number_format($amount, 2, '.', ''),
            'order_id' => $options['order_id'] ?? ('ORD_' . time() . '_' . substr(md5(uniqid()), 0, 5)),
            'customer_name' => $options['customer_name'] ?? null,
            'customer_mobile' => $options['customer_mobile'] ?? null,
            'customer_email' => $options['customer_email'] ?? null,
            'redirect_url' => $options['redirect_url'] ?? null,
            'webhook_url' => $options['webhook_url'] ?? null,
            'note' => $options['note'] ?? null,
            'metadata' => $options['metadata'] ?? null,
        ], $options);

        $res = $this->request('/api/v2/payment_gateway/create_upi_order', $payload);
        $data = $res['data'] ?? $res;

        return [
            'success' => (bool)($res['success'] ?? ($res['status'] === 'Success')),
            'order_id' => $data['order_id'] ?? ($res['order_id'] ?? null),
            'merchant_order_id' => $res['merchant_order_id'] ?? $payload['order_id'],
            'amount' => (string)($data['amount'] ?? ($res['amount'] ?? $amount)),
            'currency' => $data['currency'] ?? 'INR',
            'payment_url' => $data['payment_url'] ?? ($res['pay_url'] ?? $res['payment_url'] ?? null),
            'upi_intent' => $res['upi_intent'] ?? ($res['upi_qr'] ?? ''),
            'expires_in' => $res['expires_in'] ?? 900,
            'created_at' => $res['created_at'] ?? date('c'),
            'raw' => $res,
        ];
    }

    /**
     * Checks real-time order payment status and UTR reference.
     *
     * @param string $orderId
     * @return array
     */
    public function getOrderStatus(string $orderId): array {
        $res = $this->request('/api/v2/payment_gateway/check_upi_order_status', ['order_id' => $orderId]);
        $data = $res['data'] ?? $res;

        return [
            'success' => (bool)($res['success'] ?? ($res['status'] === 'Success')),
            'order_id' => $data['order_id'] ?? ($res['order_id'] ?? $orderId),
            'status' => $data['status'] ?? ($res['status'] ?? 'Pending'),
            'amount' => (string)($data['amount'] ?? ($res['amount'] ?? '0.00')),
            'currency' => $data['currency'] ?? 'INR',
            'message' => $data['message'] ?? ($res['message'] ?? ''),
            'utr_number' => $data['utr_number'] ?? ($res['utr_number'] ?? null),
            'date_time' => $data['date_time'] ?? ($res['date_time'] ?? null),
            'created_at' => $data['created_at'] ?? ($res['created_at'] ?? null),
            'raw' => $res,
        ];
    }

    /**
     * Verifies webhook HMAC-SHA256 signature.
     */
    public function verifyWebhook(string $rawBody, string $signature): bool {
        return Webhooks::verifySignature($rawBody, $signature, $this->apiSecret);
    }
}
