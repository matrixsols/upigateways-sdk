export interface UpiGatewaysConfig {
    /**
     * Your UPI Gateways API Key (Live or Test key)
     */
    apiKey: string;
    /**
     * Your UPI Gateways API Secret or Bearer Token
     */
    apiSecret: string;
    /**
     * Custom base API URL (default: https://www.upigateways.in)
     */
    baseUrl?: string;
    /**
     * Request timeout in milliseconds (default: 30000)
     */
    timeout?: number;
}
export interface CreateUpiOrderInput {
    /**
     * Amount in INR (min 1.00)
     */
    amount: number;
    /**
     * Unique order ID from your merchant system
     */
    orderId?: string;
    /**
     * Customer's full name (min 3 chars)
     */
    customerName?: string;
    /**
     * Customer's 10-digit Indian mobile number
     */
    customerMobile?: string;
    /**
     * Customer's email address
     */
    customerEmail?: string;
    /**
     * URL to redirect the customer upon payment completion
     */
    redirectUrl?: string;
    /**
     * Webhook URL to receive payment notification callback
     */
    webhookUrl?: string;
    /**
     * Optional order description or note
     */
    description?: string;
    /**
     * Optional custom metadata object
     */
    metadata?: Record<string, string | number>;
}
export interface CreateUpiOrderResponse {
    success: boolean;
    orderId: string;
    merchantOrderId?: string;
    amount: string;
    currency: string;
    paymentUrl: string;
    upiIntent: string;
    expiresInSeconds: number;
    createdAt: string;
    raw?: any;
}
export interface CheckOrderStatusInput {
    /**
     * UPI Gateways order reference or your system order ID
     */
    orderId: string;
}
export interface OrderStatusResponse {
    success: boolean;
    orderId: string;
    status: "Success" | "Pending" | "Failed" | "Refunded" | "Cancelled" | "Expired" | "Queue";
    amount: string;
    currency: string;
    message: string;
    utrNumber?: string | null;
    dateTime?: string | null;
    createdAt?: string;
    raw?: any;
}
export interface WebhookPayload {
    order_id: string;
    status: "SUCCESS" | "COMPLETED" | "FAILED" | "PENDING";
    amount: number | string;
    currency?: string;
    utr?: string;
    bank_ref_no?: string;
    customer_phone?: string;
    customer_email?: string;
    timestamp?: string;
    [key: string]: any;
}
//# sourceMappingURL=types.d.ts.map