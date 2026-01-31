# Payment Widget

A beautiful, self-contained Solana payment widget that can be easily integrated into any application - just like Razorpay!

## Features

- ✅ **Self-contained** - Includes wallet provider, UI, and payment logic
- ✅ **Beautiful UI** - Same polished animations as the preview
- ✅ **Easy Integration** - Just import and use with props
- ✅ **No code changes needed** - Works out of the box
- ✅ **TypeScript support** - Full type safety

## Installation

The widget is part of the payment gateway codebase. To use it:

1. Import the widget component
2. Pass your configuration
3. That's it!

## Usage

### Basic Example

```tsx
import { PaymentWidget } from '@/components/payment-widget'

function MyCheckoutPage() {
  return (
    <PaymentWidget
      apiKey="pk_test_YOUR_API_KEY"
      apiUrl="https://sol-innerve.10xdevs.in"
      recipientAddress="YOUR_WALLET_ADDRESS"
      products={[
        {
          id: '1',
          name: 'Pro Plan',
          description: 'Advanced features',
          price: 0.5,
        },
        {
          id: '2',
          name: 'Premium Support',
          description: 'Priority support',
          price: 0.2,
        },
      ]}
      network="devnet"
      onSuccess={(data) => {
        console.log('Payment successful!', data)
        // data.sessionId - Payment session ID
        // data.txSignature - Transaction signature
      }}
      onError={(error) => {
        console.error('Payment failed:', error)
      }}
    />
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | ✅ Yes | Your payment gateway API key (starts with `pk_test_` or `pk_live_`) |
| `apiUrl` | `string` | ✅ Yes | Payment gateway API URL (e.g., `https://sol-innerve.10xdevs.in`) |
| `recipientAddress` | `string` | ✅ Yes | Merchant wallet address that receives payments |
| `products` | `Product[]` | ✅ Yes | Array of products to purchase |
| `network` | `'devnet' \| 'mainnet-beta'` | No | Solana network (default: `'devnet'`) |
| `onSuccess` | `function` | No | Callback when payment succeeds |
| `onError` | `function` | No | Callback when payment fails |

## Product Interface

```typescript
interface Product {
  id: string
  name: string
  price: number
  description?: string
  metadata?: Record<string, unknown>
}
```

## Callbacks

### onSuccess

Called when payment is successfully completed:

```typescript
onSuccess: (data: {
  sessionId: string
  txSignature: string
}) => void
```

### onError

Called when payment fails:

```typescript
onError: (error: Error) => void
```

## What Users See

1. **Order Summary** - Products, subtotal, network fee, total
2. **Payment Method** - Currency selection (USDC/USDT) and wallet connection
3. **Processing Animation** - Beautiful animated UI while transaction processes
4. **Success Screen** - Animated checkmark with transaction details

## Requirements

- React 18+
- Next.js 13+ (App Router)
- Solana wallet adapter dependencies
- CSS styles from `okito/app/globals.css` (crypto-glass, crypto-base classes)

## Styling

The widget uses custom CSS classes (`crypto-glass`, `crypto-base`, etc.) defined in the main app's `globals.css`. Make sure these styles are available in your application.

## Example Integration

```tsx
// app/checkout/page.tsx
'use client'

import { PaymentWidget } from '@/components/payment-widget'

export default function CheckoutPage() {
  return (
    <PaymentWidget
      apiKey={process.env.NEXT_PUBLIC_API_KEY!}
      apiUrl={process.env.NEXT_PUBLIC_API_URL!}
      recipientAddress={process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS!}
      products={[
        { id: '1', name: 'Product 1', price: 1.0, description: 'Description' }
      ]}
      onSuccess={(data) => {
        // Redirect to success page
        window.location.href = `/success?tx=${data.txSignature}`
      }}
    />
  )
}
```

That's it! No complex setup, just import and use. 🚀

