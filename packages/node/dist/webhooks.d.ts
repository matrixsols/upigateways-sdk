import { WebhookPayload } from "./types";
/**
 * Verifies the incoming webhook HMAC-SHA256 signature from UPI Gateways.
 *
 * @param rawBody - The raw string body of the incoming webhook request
 * @param signatureHeader - The signature string from the 'x-signature' header
 * @param secret - Your UPI Gateways API Secret
 * @returns boolean - Whether the signature is valid
 */
export declare function verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): boolean;
/**
 * Safely parses and validates a webhook payload.
 */
export declare function parseWebhookPayload(body: string | Record<string, any>): WebhookPayload;
//# sourceMappingURL=webhooks.d.ts.map