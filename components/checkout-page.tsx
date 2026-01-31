'use client'

import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner'
import { processPayment } from '@/lib/payment'

interface Product {
  id: string
  name: string
  price: number
  description: string
}

const defaultProducts: Product[] = [
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

export default function CheckoutPage() {
  const { publicKey, connected, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const selectedToken = 'SOL'
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  // Get recipient address from env, allow override via input
  const envRecipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || ''
  const [recipientAddress, setRecipientAddress] = useState<string>(envRecipientAddress)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const subtotal = products.reduce((sum, item) => sum + item.price, 0)
  const networkFee = 0.001
  const totalAmount = subtotal + networkFee

  const handlePayment = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    setPaymentStatus('processing')

    try {
      // Create payment session
      // Get API URL from environment variable (must be set in .env.local)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const apiKey = process.env.NEXT_PUBLIC_API_KEY

      if (!apiUrl) {
        throw new Error('API URL not configured. Please set NEXT_PUBLIC_API_URL in .env.local (e.g., https://sol-innerve.10xdevs.in)')
      }

      if (!apiKey) {
        throw new Error('API key not configured. Please set NEXT_PUBLIC_API_KEY in .env.local')
      }

      console.log('Environment check:', {
        apiUrl,
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey?.length,
      })

      // Ensure URL doesn't have trailing slash and uses correct protocol
      const cleanApiUrl = apiUrl.replace(/\/$/, '')
      const paymentUrl = `${cleanApiUrl}/api/v1/payments`

      const requestBody = {
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
        })),
      }

      console.log('Calling payment API:', {
        url: paymentUrl,
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
        body: requestBody,
      })

      let response: Response
      try {
        response = await fetch(paymentUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-Superlamp-KEY': apiKey,
          },
          body: JSON.stringify(requestBody),
        })
      } catch (fetchError) {
        console.error('Fetch error details:', fetchError)
        if (fetchError instanceof TypeError) {
          if (fetchError.message.includes('Failed to fetch')) {
            throw new Error(`Network error: Cannot reach ${paymentUrl}. Check if the API server is running and CORS is configured.`)
          }
          if (fetchError.message.includes('CORS')) {
            throw new Error('CORS error: The API server is not allowing requests from this origin.')
          }
        }
        throw fetchError
      }

      console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`)
        } catch {
          throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('API response:', data)

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to create payment session')
      }

      if (!data.error && !data.sessionId) {
        throw new Error('No session ID returned')
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setSessionId(data.sessionId)

      // Use recipient address from env only (input is disabled)
      const finalRecipientAddress = envRecipientAddress
      if (!finalRecipientAddress) {
        throw new Error('Recipient address is required. Please set NEXT_PUBLIC_RECIPIENT_ADDRESS in .env.local')
      }

      if (!signTransaction) {
        throw new Error('Wallet sign function not available')
      }

      // Process payment transaction
      const result = await processPayment({
        sessionId: data.sessionId,
        amount: totalAmount,
        recipientAddress: finalRecipientAddress,
        senderPublicKey: publicKey,
        signTransaction,
        connection,
      })

      setTxSignature(result.signature)
      setPaymentStatus('success')
      toast.success('Payment successful!')
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('error')
      toast.error(error instanceof Error ? error.message : 'Payment failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Payment Gateway Demo
          </h1>

          {/* Wallet Connection */}
          <div className="mb-8 flex justify-center" suppressHydrationWarning>
            <WalletMultiButton />
          </div>

          {connected && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                Connected: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </p>
            </div>
          )}

          {/* Currency Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Payment Currency</label>
            <div className="flex gap-2">
              <div className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white shadow-lg">
                SOLANA
              </div>
            </div>
          </div>

          {/* Recipient Address Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Recipient Wallet Address
            </label>
            <input
              type="text"
              value={recipientAddress || envRecipientAddress}
              disabled
              placeholder="Recipient address from environment"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {envRecipientAddress 
                ? `Using address from environment: ${envRecipientAddress.slice(0, 8)}...${envRecipientAddress.slice(-8)} (configured in .env.local)`
                : 'Recipient address must be set in NEXT_PUBLIC_RECIPIENT_ADDRESS environment variable.'}
            </p>
          </div>

          {/* Products */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  {editingProductId === product.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingProduct?.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct!, name: e.target.value })}
                        placeholder="Product name"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={editingProduct?.description || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct!, description: e.target.value })}
                        placeholder="Product description"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={editingProduct?.price || 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct!, price: parseFloat(e.target.value) || 0 })}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{selectedToken}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (editingProduct) {
                              setProducts(products.map(p => p.id === product.id ? editingProduct : p))
                            }
                            setEditingProductId(null)
                            setEditingProduct(null)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingProductId(null)
                            setEditingProduct(null)
                          }}
                          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold">{product.price.toFixed(3)} {selectedToken}</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingProductId(product.id)
                            setEditingProduct({ ...product })
                          }}
                          className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mb-8 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{subtotal.toFixed(3)} {selectedToken}</span>
            </div>
            <div className="flex justify-between">
              <span>Network Fee</span>
              <span className="font-semibold">{networkFee.toFixed(3)} {selectedToken}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-blue-600 dark:text-blue-400">{totalAmount.toFixed(3)} {selectedToken}</span>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={!connected || paymentStatus === 'processing' || !envRecipientAddress}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
              connected && paymentStatus !== 'processing' && envRecipientAddress
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {paymentStatus === 'processing' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : paymentStatus === 'success' ? (
              'Payment Successful! ✓'
            ) : (
              `Pay ${totalAmount.toFixed(3)} ${selectedToken}`
            )}
          </button>

          {sessionId && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                Session ID: <code className="font-mono text-xs">{sessionId}</code>
              </p>
              {txSignature && (
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Transaction: <code className="font-mono text-xs break-all">{txSignature}</code>
                </p>
              )}
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                Payment failed. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

