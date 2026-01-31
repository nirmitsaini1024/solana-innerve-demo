"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PaymentWidget } from "@/components/payment-widget"
import { Product } from "@/components/payment-widget/types"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const productsParam = searchParams.get('products')
    if (productsParam) {
      try {
        const parsed = JSON.parse(productsParam)
        setProducts(parsed)
      } catch (error) {
        console.error('Failed to parse products:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [searchParams, router])

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading checkout...</p>
        </div>
      </div>
    )
  }

  const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const recipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || ''
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta'

  return (
    <PaymentWidget
      apiKey={apiKey}
      apiUrl={apiUrl}
      recipientAddress={recipientAddress}
      products={products}
      network={network}
      onSuccess={(data) => {
        console.log('Payment successful!', data)
        // Redirect to success page or home
        router.push(`/success?tx=${data.txSignature}&session=${data.sessionId}`)
      }}
      onError={(error) => {
        console.error('Payment error:', error)
        alert(`Payment failed: ${error.message}`)
      }}
    />
  )
}

