# Payment Gateway Demo

A simple demo application to test the Solana payment gateway integration on **devnet**.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Get your API key** (see [SETUP.md](./SETUP.md) for detailed instructions):
   - Access the payment gateway dashboard
   - Create a project
   - Generate a **TEST** API token (for devnet)
   - Copy the token (format: `pk_test_...`)

3. **Create `.env.local`**:
   ```bash
   touch .env.local
   ```

4. **Add environment variables**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_API_KEY=pk_test_YOUR_TOKEN_HERE
   NEXT_PUBLIC_RECIPIENT_ADDRESS=YOUR_WALLET_ADDRESS_HERE
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   ```

5. **Run the demo**:
   ```bash
   npm run dev
   ```

## 📖 Detailed Setup

For complete setup instructions, including how to:
- Get your API key from the dashboard
- Configure the environment
- Test the payment flow

See **[SETUP.md](./SETUP.md)** for the full guide.

## Running

```bash
npm run dev
```

The app will start on [http://localhost:3000](http://localhost:3000) by default.

## Features

- ✅ Connect Solana wallet (Phantom, Solflare, etc.)
- ✅ Accept payments in SOL (Solana native currency)
- ✅ Create payment sessions via API
- ✅ Process payments on Solana blockchain
- ✅ View payment status and transaction signatures
- ✅ Real-time payment confirmation
- ✅ Beautiful, modern UI with dark mode support

## Usage

1. **Connect Wallet**: Click "Select Wallet" and connect your Solana wallet (Phantom, Solflare, etc.)

2. **Review Order**:
   - Products and prices are displayed in SOL
   - Recipient address is configured from `.env.local`
   - Review order summary and total amount

3. **Process Payment**:
   - Click "Pay" button
   - The app will create a payment session via API
   - Confirm the transaction in your wallet
   - Wait for blockchain confirmation

4. **View Results**:
   - Session ID and transaction signature will be displayed
   - Payment status will update automatically
   - Redirect to success page on completion

## Testing on Devnet

For testing purposes, you can use devnet SOL:
- Get devnet SOL from faucets (e.g., https://faucet.solana.com)
- Use devnet wallet addresses
- Set `NEXT_PUBLIC_SOLANA_NETWORK=devnet` in `.env.local`

## 💳 Using the Payment Widget

### Import the Payment Widget

```typescript
import { PaymentWidget } from "@/components/payment-widget"
import type { Product } from "@/components/payment-widget/types"
```

### Basic Usage

```typescript
import { PaymentWidget } from "@/components/payment-widget"
import type { Product } from "@/components/payment-widget/types"

// Define your products
const products: Product[] = [
  {
    id: "1",
    name: "Pro Plan",
    price: 0.5, // Amount in SOL
    description: "Advanced features and unlimited API access"
  },
  {
    id: "2",
    name: "Premium Support",
    price: 0.2, // Amount in SOL
    description: "Priority support and dedicated account manager"
  }
]

// Use the widget
<PaymentWidget
  apiKey={process.env.NEXT_PUBLIC_API_KEY || ''}
  apiUrl={process.env.NEXT_PUBLIC_API_URL || ''}
  recipientAddress={process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || ''}
  products={products}
  network="devnet" // or "mainnet-beta"
  onSuccess={(data) => {
    console.log('Payment successful!', data)
    // Redirect to success page
    router.push(`/success?tx=${data.txSignature}&session=${data.sessionId}`)
  }}
  onError={(error) => {
    console.error('Payment error:', error)
    alert(`Payment failed: ${error.message}`)
  }}
/>
```

### Payment Widget Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your API key from the dashboard |
| `apiUrl` | `string` | Yes | Base URL of the payment gateway API |
| `recipientAddress` | `string` | Yes | Solana wallet address to receive payments |
| `products` | `Product[]` | Yes | Array of products to sell |
| `network` | `'devnet' \| 'mainnet-beta'` | No | Solana network (default: `'devnet'`) |
| `onSuccess` | `function` | No | Callback when payment succeeds |
| `onError` | `function` | No | Callback when payment fails |

### Product Type

```typescript
interface Product {
  id: string
  name: string
  price: number // Amount in SOL
  description?: string
  metadata?: Record<string, unknown>
}
```

### Example: Checkout Page

```typescript
"use client"

import { PaymentWidget } from "@/components/payment-widget"
import type { Product } from "@/components/payment-widget/types"

export default function CheckoutPage() {
  const products: Product[] = [
    {
      id: "1",
      name: "Pro Plan",
      price: 0.5,
      description: "Advanced features"
    }
  ]

  return (
    <PaymentWidget
      apiKey={process.env.NEXT_PUBLIC_API_KEY || ''}
      apiUrl={process.env.NEXT_PUBLIC_API_URL || ''}
      recipientAddress={process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || ''}
      products={products}
      network="devnet"
      onSuccess={(data) => {
        console.log('Payment successful!', data)
      }}
      onError={(error) => {
        console.error('Payment error:', error)
      }}
    />
  )
}
```

## API Integration

The demo integrates with the payment gateway API:
- **Endpoint**: `POST /api/v1/payments`
- **Headers**: `X-Superlamp-KEY: your-api-key`
- **Response**: Returns `sessionId` for payment tracking

## Project Structure

```
tets-okito/
├── app/
│   ├── layout.tsx          # Root layout with wallet provider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── checkout-page.tsx   # Main checkout component
│   └── wallet-provider.tsx # Solana wallet provider setup
├── lib/
│   └── payment.ts          # Payment processing logic
└── package.json
```

## Troubleshooting

- **Wallet not connecting**: Make sure you have a Solana wallet extension installed (Phantom, Solflare, etc.)
- **Transaction fails**: Check that you have sufficient SOL balance and the recipient address is valid
- **API errors**: Verify your API key and URL are correct in `.env.local`
- **Network issues**: Ensure you're on the correct network (devnet/mainnet) matching your wallet
- **Payment stuck on PENDING**: The payment status updates automatically when the transaction is confirmed on-chain

