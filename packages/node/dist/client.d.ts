import { UpiGatewaysConfig, CreateUpiOrderInput, CreateUpiOrderResponse, CheckOrderStatusInput, OrderStatusResponse } from "./types";
import { parseWebhookPayload } from "./webhooks";
export declare class UpiGatewaysClient {
    private apiKey;
    private apiSecret;
    private baseUrl;
    private timeout;
    constructor(config: UpiGatewaysConfig);
    /**
     * Helper for authenticated HTTP requests.
     */
    private request;
    /**
     * Orders API
     */
    orders: {
        /**
         * Create a new UPI Payment Session with 0% MDR fee.
         * Generates dynamic QR code and 1-click mobile UPI intent string.
         */
        create: (input: CreateUpiOrderInput) => Promise<CreateUpiOrderResponse>;
        /**
         * Check real-time payment status of an order.
         */
        getStatus: (input: CheckOrderStatusInput) => Promise<OrderStatusResponse>;
    };
    /**
     * Webhook Verification Utility
     */
    webhooks: {
        verifySignature: (rawBody: string, signature: string) => boolean;
        parsePayload: typeof parseWebhookPayload;
    };
}
//# sourceMappingURL=client.d.ts.map