# UPI Gateways Rust SDK

Official Rust SDK for [UPI Gateways](https://www.upigateways.in) — The Zero Fee (0% MDR) UPI Payment Infrastructure for Indian Developers and Businesses.

## Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
upigateways = "1.0.0"
```

## Quickstart

```rust
use upigateways::Client;

fn main() {
    let client = Client::new("YOUR_API_KEY", "YOUR_API_SECRET");
    println!("UPI Gateways Client initialized: {}", client.api_key);
}
```
