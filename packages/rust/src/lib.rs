//! Official Rust SDK for UPI Gateways (https://www.upigateways.in)
//! Zero Transaction Fee (0% MDR) UPI Payment Infrastructure.

pub const DEFAULT_BASE_URL: &str = "https://www.upigateways.in/api/v2";

/// UPI Gateways API Client
#[derive(Debug, Clone)]
pub struct Client {
    pub api_key: String,
    pub api_secret: String,
    pub base_url: String,
}

impl Client {
    /// Initialize a new UPI Gateways Client with API credentials.
    pub fn new(api_key: impl Into<String>, api_secret: impl Into<String>) -> Self {
        Self {
            api_key: api_key.into(),
            api_secret: api_secret.into(),
            base_url: DEFAULT_BASE_URL.to_string(),
        }
    }
}
