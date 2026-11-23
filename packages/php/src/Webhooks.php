<?php

namespace UpiGateways;

class Webhooks {
    /**
     * Verifies the incoming webhook HMAC-SHA256 signature from UPI Gateways.
     *
     * @param string $rawBody The raw body received from php://input
     * @param string $signatureHeader The value of HTTP header X-Signature
     * @param string $secret Your UPI Gateways API Secret
     * @return bool
     */
    public static function verifySignature(string $rawBody, string $signatureHeader, string $secret): bool {
        if (empty($rawBody) || empty($signatureHeader) || empty($secret)) {
            return false;
        }

        $computedSignature = hash_hmac('sha256', $rawBody, $secret);

        return hash_equals(strtolower($computedSignature), strtolower($signatureHeader));
    }

    /**
     * Parse raw webhook body into PHP array.
     *
     * @param string $rawBody
     * @return array
     */
    public static function parsePayload(string $rawBody): array {
        $data = json_decode($rawBody, true);
        if (!is_array($data)) {
            throw new \InvalidArgumentException('Invalid JSON payload received in webhook.');
        }
        return $data;
    }
}
