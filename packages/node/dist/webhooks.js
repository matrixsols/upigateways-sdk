"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhookSignature = verifyWebhookSignature;
exports.parseWebhookPayload = parseWebhookPayload;
const crypto = __importStar(require("crypto"));
/**
 * Verifies the incoming webhook HMAC-SHA256 signature from UPI Gateways.
 *
 * @param rawBody - The raw string body of the incoming webhook request
 * @param signatureHeader - The signature string from the 'x-signature' header
 * @param secret - Your UPI Gateways API Secret
 * @returns boolean - Whether the signature is valid
 */
function verifyWebhookSignature(rawBody, signatureHeader, secret) {
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
    }
    catch {
        return false;
    }
}
/**
 * Safely parses and validates a webhook payload.
 */
function parseWebhookPayload(body) {
    const payload = typeof body === "string" ? JSON.parse(body) : body;
    if (!payload || typeof payload !== "object") {
        throw new Error("Invalid webhook payload format.");
    }
    return payload;
}
//# sourceMappingURL=webhooks.js.map