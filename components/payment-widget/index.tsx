"use client"

import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"
import { PaymentWidget } from "./payment-widget"
import { PaymentWidgetConfig } from "./types"

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

export function PaymentWidgetWithProvider({ 
  apiKey, 
  apiUrl, 
  recipientAddress, 
  products, 
  network = 'devnet',
  onSuccess,
  onError,
}: PaymentWidgetConfig) {
  const networkType = (network || 'devnet') as WalletAdapterNetwork
  
  // Use custom RPC endpoint if provided, otherwise fall back to public endpoint
  const endpoint = useMemo(() => {
    const customRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    if (customRpc) {
      return customRpc
    }
    return clusterApiUrl(networkType)
  }, [networkType])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <PaymentWidget 
            apiKey={apiKey}
            apiUrl={apiUrl}
            recipientAddress={recipientAddress}
            products={products}
            network={network as 'devnet' | 'mainnet-beta' | undefined}
            onSuccess={onSuccess}
            onError={onError}
          />
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

// Main export - users just import this
export { PaymentWidgetWithProvider as PaymentWidget }
export type { PaymentWidgetConfig, Product } from "./types"

