class UpiGatewaysError(Exception):
    """Base exception for all UPI Gateways SDK errors."""
    pass

class AuthenticationError(UpiGatewaysError):
    """Raised when API Key or Secret is invalid or unauthorized."""
    pass

class ApiError(UpiGatewaysError):
    """Raised when the API returns an error response."""
    def __init__(self, message: str, status_code: int = None, error_code: str = None):
        super().__init__(message)
        self.status_code = status_code
        self.error_code = error_code
