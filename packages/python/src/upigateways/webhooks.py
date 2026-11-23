import hmac
import hashlib
import json
from typing import Dict, Any, Union

def verify_webhook_signature(raw_body: Union[str, bytes], signature_header: str, secret: str) -> bool:
    """
    Verifies the HMAC-SHA256 signature from UPI Gateways webhook notifications.

    :param raw_body: Raw request body (str or bytes)
    :param signature_header: Value of the 'x-signature' HTTP header
    :param secret: Your UPI Gateways API Secret
    :return: True if the signature is valid, False otherwise
    """
    if not raw_body or not signature_header or not secret:
        return False

    try:
        if isinstance(raw_body, str):
            body_bytes = raw_body.encode("utf-8")
        else:
            body_bytes = raw_body

        secret_bytes = secret.encode("utf-8")
        computed = hmac.new(secret_bytes, body_bytes, hashlib.sha256).hexdigest()

        return hmac.compare_digest(computed.lower(), signature_header.lower())
    except Exception:
        return False

def parse_webhook_payload(raw_body: Union[str, bytes, Dict[str, Any]]) -> Dict[str, Any]:
    """
    Parses and returns the JSON payload from a webhook notification.
    """
    if isinstance(raw_body, dict):
        return raw_body
    if isinstance(raw_body, bytes):
        raw_body = raw_body.decode("utf-8")
    return json.loads(raw_body)
