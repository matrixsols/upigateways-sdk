// Package upigateways provides the official Go client for the UPI Gateways payment infrastructure.
// Zero Transaction Fee (0% MDR) UPI Payment Gateway for Indian merchants and developers.
// Learn more at https://www.upigateways.in
package upigateways

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	DefaultBaseURL = "https://www.upigateways.in/api/v2"
	DefaultTimeout = 15 * time.Second
)

// Client is the UPI Gateways API client.
type Client struct {
	APIKey     string
	APISecret  string
	BaseURL    string
	HTTPClient *http.Client
}

// Option allows customizing the Client configuration.
type Option func(*Client)

// WithBaseURL overrides the default API base URL.
func WithBaseURL(url string) Option {
	return func(c *Client) {
		c.BaseURL = url
	}
}

// WithHTTPClient overrides the default HTTP client.
func WithHTTPClient(httpClient *http.Client) Option {
	return func(c *Client) {
		c.HTTPClient = httpClient
	}
}

// NewClient initializes a new UPI Gateways client.
func NewClient(apiKey, apiSecret string, opts ...Option) *Client {
	c := &Client{
		APIKey:    apiKey,
		APISecret: apiSecret,
		BaseURL:   DefaultBaseURL,
		HTTPClient: &http.Client{
			Timeout: DefaultTimeout,
		},
	}
	for _, opt := range opts {
		opt(c)
	}
	return c
}

// CreateOrderRequest represents payload to generate a dynamic UPI QR / intent session.
type CreateOrderRequest struct {
	Amount         float64 `json:"amount"`
	ClientTxnID    string  `json:"client_txn_id"`
	CustomerName   string  `json:"customer_name,omitempty"`
	CustomerMobile string  `json:"customer_mobile,omitempty"`
	CustomerEmail  string  `json:"customer_email,omitempty"`
	PInfo          string  `json:"p_info,omitempty"`
	RedirectURL    string  `json:"redirect_url,omitempty"`
	WebhookURL     string  `json:"webhook_url,omitempty"`
	UD1            string  `json:"udf1,omitempty"`
	UD2            string  `json:"udf2,omitempty"`
	UD3            string  `json:"udf3,omitempty"`
}

// OrderResponse represents response from order creation.
type OrderResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"msg"`
	Data    struct {
		OrderID    string `json:"order_id"`
		PaymentURL string `json:"payment_url"`
		UPIIntent  string `json:"upi_intent"`
	} `json:"data"`
}

// OrderStatusResponse represents response from status check.
type OrderStatusResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"msg"`
	Data    struct {
		ClientTxnID string  `json:"client_txn_id"`
		Amount      float64 `json:"amount"`
		Status      string  `json:"status"`
		UTR         string  `json:"upi_txn_id"`
		CreatedAt   string  `json:"created_at"`
	} `json:"data"`
}

// CreateOrder initiates a payment transaction and generates QR / UPI intent links.
func (c *Client) CreateOrder(ctx context.Context, req CreateOrderRequest) (*OrderResponse, error) {
	if req.Amount <= 0 {
		return nil, errors.New("upigateways: amount must be greater than zero")
	}
	if req.ClientTxnID == "" {
		return nil, errors.New("upigateways: client_txn_id is required")
	}

	payload := map[string]interface{}{
		"key":             c.APIKey,
		"client_txn_id":   req.ClientTxnID,
		"amount":          fmt.Sprintf("%.2f", req.Amount),
		"p_info":          req.PInfo,
		"customer_name":   req.CustomerName,
		"customer_email":  req.CustomerEmail,
		"customer_mobile": req.CustomerMobile,
		"redirect_url":    req.RedirectURL,
		"webhook_url":     req.WebhookURL,
		"udf1":            req.UD1,
		"udf2":            req.UD2,
		"udf3":            req.UD3,
	}

	var res OrderResponse
	if err := c.doRequest(ctx, http.MethodPost, "/create_order", payload, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// GetOrderStatus queries the payment status of an existing order.
func (c *Client) GetOrderStatus(ctx context.Context, clientTxnID, txnDate string) (*OrderStatusResponse, error) {
	if clientTxnID == "" {
		return nil, errors.New("upigateways: client_txn_id is required")
	}

	payload := map[string]interface{}{
		"key":           c.APIKey,
		"client_txn_id": clientTxnID,
		"txn_date":      txnDate,
	}

	var res OrderStatusResponse
	if err := c.doRequest(ctx, http.MethodPost, "/check_order_status", payload, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// VerifyWebhookSignature verifies constant-time HMAC-SHA256 signature for incoming webhooks.
func VerifyWebhookSignature(payload []byte, receivedSignature, secret string) bool {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(payload)
	expectedSignature := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expectedSignature), []byte(receivedSignature))
}

func (c *Client) doRequest(ctx context.Context, method, path string, body interface{}, out interface{}) error {
	var bodyReader io.Reader
	if body != nil {
		jsonBytes, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("upigateways: marshal error: %w", err)
		}
		bodyReader = bytes.NewReader(jsonBytes)
	}

	req, err := http.NewRequestWithContext(ctx, method, c.BaseURL+path, bodyReader)
	if err != nil {
		return fmt.Errorf("upigateways: new request error: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "upigateways-go/1.0.0")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("upigateways: request failed: %w", err)
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("upigateways: reading response error: %w", err)
	}

	if resp.StatusCode >= 400 {
		return fmt.Errorf("upigateways: server returned status %d: %s", resp.StatusCode, string(respBytes))
	}

	if out != nil {
		if err := json.Unmarshal(respBytes, out); err != nil {
			return fmt.Errorf("upigateways: decode response error: %w", err)
		}
	}
	return nil
}
