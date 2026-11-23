"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpiGatewaysClient = void 0;
const webhooks_1 = require("./webhooks");
class UpiGatewaysClient {
    apiKey;
    apiSecret;
    baseUrl;
    timeout;
    constructor(config) {
        if (!config.apiKey) {
            throw new Error("UPI Gateways SDK: `apiKey` is required.");
        }
        if (!config.apiSecret) {
            throw new Error("UPI Gateways SDK: `apiSecret` is required.");
        }
        this.apiKey = config.apiKey;
        this.apiSecret = config.apiSecret;
        this.baseUrl = (config.baseUrl || "https://www.upigateways.in").replace(/\/+$/, "");
        this.timeout = config.timeout || 30000;
    }
    /**
     * Helper for authenticated HTTP requests.
     */
    async request(endpoint, method, body) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "Authorization": `Bearer ${this.apiSecret}`,
            "User-Agent": "upigateways-node-sdk/1.0.0",
        };
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });
            const json = await response.json().catch(() => ({}));
            if (!response.ok) {
                const errorMsg = json?.message ||
                    (Array.isArray(json?.error) ? json.error[0]?.message : null) ||
                    `Request failed with status ${response.status}`;
                throw new Error(`UPI Gateways API Error: ${errorMsg}`);
            }
            return json;
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    /**
     * Orders API
     */
    orders = {
        /**
         * Create a new UPI Payment Session with 0% MDR fee.
         * Generates dynamic QR code and 1-click mobile UPI intent string.
         */
        create: async (input) => {
            const payload = {
                amount: String(input.amount),
                customer_name: input.customerName,
                customer_mobile: input.customerMobile,
                customer_email: input.customerEmail,
                order_id: input.orderId || `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                redirect_url: input.redirectUrl,
                webhook_url: input.webhookUrl,
                note: input.description,
                metadata: input.metadata,
            };
            const res = await this.request("/api/v2/payment_gateway/create_upi_order", "POST", payload);
            const orderData = res.data || res;
            return {
                success: Boolean(res.success || res.status === "Success"),
                orderId: orderData.order_id || res.order_id,
                merchantOrderId: res.merchant_order_id || input.orderId,
                amount: String(orderData.amount || res.amount || input.amount),
                currency: orderData.currency || res.currency || "INR",
                paymentUrl: orderData.payment_url || res.pay_url || res.payment_url,
                upiIntent: res.upi_intent || res.upi_qr || "",
                expiresInSeconds: res.expires_in || 900,
                createdAt: res.created_at || new Date().toISOString(),
                raw: res,
            };
        },
        /**
         * Check real-time payment status of an order.
         */
        getStatus: async (input) => {
            const payload = {
                order_id: input.orderId,
            };
            const res = await this.request("/api/v2/payment_gateway/check_upi_order_status", "POST", payload);
            const orderData = res.data || res;
            return {
                success: Boolean(res.success || res.status === "Success"),
                orderId: orderData.order_id || res.order_id || input.orderId,
                status: (orderData.status || res.status || "Pending"),
                amount: String(orderData.amount || res.amount || "0"),
                currency: orderData.currency || res.currency || "INR",
                message: orderData.message || res.message || "",
                utrNumber: orderData.utr_number || res.utr_number || null,
                dateTime: orderData.date_time || res.date_time || null,
                createdAt: orderData.created_at || res.created_at,
                raw: res,
            };
        },
    };
    /**
     * Webhook Verification Utility
     */
    webhooks = {
        verifySignature: (rawBody, signature) => {
            return (0, webhooks_1.verifyWebhookSignature)(rawBody, signature, this.apiSecret);
        },
        parsePayload: webhooks_1.parseWebhookPayload,
    };
}
exports.UpiGatewaysClient = UpiGatewaysClient;
//# sourceMappingURL=client.js.map