import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, Union
from .exceptions import UpiGatewaysError, AuthenticationError, ApiError
from .webhooks import verify_webhook_signature, parse_webhook_payload

class UpiGatewaysClient:
    """
    Official Python Client for UPI Gateways (https://www.upigateways.in)
    0% Transaction Fee (0% MDR) Payment Infrastructure with Direct Bank Settlements.
    """

    def __init__(
        self,
        api_key: str,
        api_secret: str,
        base_url: str = "https://www.upigateways.in",
        timeout: int = 30,
    ):
        if not api_key:
            raise AuthenticationError("UPI Gateways SDK: `api_key` is required.")
        if not api_secret:
            raise AuthenticationError("UPI Gateways SDK: `api_secret` is required.")

        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _request(self, endpoint: str, method: str = "POST", data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "Authorization": f"Bearer {self.api_secret}",
            "User-Agent": "upigateways-python-sdk/1.0.0",
        }

        body_bytes = json.dumps(data).encode("utf-8") if data is not None else None
        req = urllib.request.Request(url, data=body_bytes, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                resp_text = response.read().decode("utf-8")
                return json.loads(resp_text)
        except urllib.error.HTTPError as e:
            try:
                err_text = e.read().decode("utf-8")
                err_json = json.loads(err_text)
                msg = err_json.get("message")
                if not msg and "error" in err_json and isinstance(err_json["error"], list):
                    msg = err_json["error"][0].get("message")
            except Exception:
                msg = f"HTTP Error {e.code}: {e.reason}"

            if e.code in (401, 403):
                raise AuthenticationError(f"Authentication failed: {msg}")
            raise ApiError(msg or "Unknown API Error", status_code=e.code)
        except urllib.error.URLError as e:
            raise UpiGatewaysError(f"Connection failed: {e.reason}")

    def create_order(
        self,
        amount: Union[int, float],
        customer_name: Optional[str] = None,
        customer_mobile: Optional[str] = None,
        customer_email: Optional[str] = None,
        order_id: Optional[str] = None,
        redirect_url: Optional[str] = None,
        webhook_url: Optional[str] = None,
        description: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Creates a new UPI Payment Session with 0% MDR fee.
        Returns the hosted checkout URL and deep-link UPI intent string.
        """
        payload = {
            "amount": str(amount),
            "customer_name": customer_name,
            "customer_mobile": customer_mobile,
            "customer_email": customer_email,
            "order_id": order_id,
            "redirect_url": redirect_url,
            "webhook_url": webhook_url,
            "note": description,
            "metadata": metadata,
        }

        res = self._request("/api/v2/payment_gateway/create_upi_order", method="POST", data=payload)
        data = res.get("data") or res

        return {
            "success": bool(res.get("success") or res.get("status") == "Success"),
            "order_id": data.get("order_id") or res.get("order_id"),
            "merchant_order_id": res.get("merchant_order_id") or order_id,
            "amount": str(data.get("amount") or res.get("amount") or amount),
            "currency": data.get("currency") or res.get("currency") or "INR",
            "payment_url": data.get("payment_url") or res.get("pay_url") or res.get("payment_url"),
            "upi_intent": res.get("upi_intent") or res.get("upi_qr") or "",
            "expires_in": res.get("expires_in", 900),
            "created_at": res.get("created_at"),
            "raw": res,
        }

    def get_order_status(self, order_id: str) -> Dict[str, Any]:
        """
        Checks real-time transaction status and bank UTR confirmation.
        """
        payload = {"order_id": order_id}
        res = self._request("/api/v2/payment_gateway/check_upi_order_status", method="POST", data=payload)
        data = res.get("data") or res

        return {
            "success": bool(res.get("success") or res.get("status") == "Success"),
            "order_id": data.get("order_id") or res.get("order_id") or order_id,
            "status": data.get("status") or res.get("status") or "Pending",
            "amount": str(data.get("amount") or res.get("amount") or "0"),
            "currency": data.get("currency") or res.get("currency") or "INR",
            "message": data.get("message") or res.get("message") or "",
            "utr_number": data.get("utr_number") or res.get("utr_number"),
            "date_time": data.get("date_time") or res.get("date_time"),
            "created_at": data.get("created_at") or res.get("created_at"),
            "raw": res,
        }

    def verify_webhook(self, raw_body: Union[str, bytes], signature: str) -> bool:
        """
        Verifies the HMAC-SHA256 signature for an incoming webhook.
        """
        return verify_webhook_signature(raw_body, signature, self.api_secret)
