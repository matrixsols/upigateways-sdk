import * as crypto from "crypto";
import { WebhookPayload } from "./types";

/**
 * Verifies the incoming webhook HMAC-SHA256 signature from UPI Gateways.
 *
 * @param rawBody - The raw string body of the incoming webhook request
 * @param signatureHeader - The signature string from the 'x-signature' header
 * @param secret - Your UPI Gateways API Secret
 * @returns boolean - Whether the signature is valid
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  if (!rawBody || !signatureHeader || !secret) {
    return false;
  }

  try {
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    const computedBuffer = Buffer.from(computedSignature, "hex");
    const receivedBuffer = Buffer.from(signatureHeader, "hex");

    if (computedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, receivedBuffer);
  } catch {
    return false;
  }
}

/**
 * Safely parses and validates a webhook payload.
 */
export function parseWebhookPayload(body: string | Record<string, any>): WebhookPayload {
  const payload = typeof body === "string" ? JSON.parse(body) : body;

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid webhook payload format.");
  }

  return payload as WebhookPayload;
}
