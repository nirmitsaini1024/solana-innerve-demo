"use client"

import { PaymentWidget } from "@/components/payment-widget"

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const recipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || ''
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta'

  const products = [
    {
      id: '1',
      name: 'Pro Plan',
      description: 'Advanced features and unlimited API access',
      price: 0.5,
    },
    {
      id: '2',
      name: 'Premium Support',
      description: 'Priority support and dedicated account manager',
      price: 0.2,
    },
  ]

  return (
    <PaymentWidget
      apiKey={apiKey}
      apiUrl={apiUrl}
      recipientAddress={recipientAddress}
      products={products}
      network={network}
      onSuccess={(data) => {
        console.log('Payment successful!', data)
      }}
      onError={(error) => {
        console.error('Payment error:', error)
      }}
    />
  )
}


