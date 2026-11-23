# UPI Gateways Go SDK

Official Go SDK for [UPI Gateways](https://www.upigateways.in) — The Zero Transaction Fee (0% MDR) UPI Payment Infrastructure for Indian Developers and Businesses.

## Installation

```bash
go get github.com/matrixsols/upigateways-sdk/packages/go
```

## Usage

```go
package main

import (
    "context"
    "fmt"
    "log"

    upigateways "github.com/matrixsols/upigateways-sdk/packages/go"
)

func main() {
    client := upigateways.NewClient("YOUR_API_KEY", "YOUR_API_SECRET")

    res, err := client.CreateOrder(context.Background(), upigateways.CreateOrderRequest{
        Amount:       299.00,
        ClientTxnID:  "TXN_987654",
        CustomerName: "Rahul Sharma",
        RedirectURL:  "https://yourstore.com/success",
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Payment URL:", res.Data.PaymentURL)
}
```
