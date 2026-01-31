# Quick Start Guide

## For Devnet Testing

### 1. Required Environment Variables

Create `.env.local` in the `tets-okito` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_KEY=pk_test_YOUR_TOKEN_HERE
NEXT_PUBLIC_RECIPIENT_ADDRESS=YOUR_WALLET_ADDRESS_HERE
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### 2. How to Get API Key

1. **Start the payment gateway** (main `okito` app):
   ```bash
   cd ../okito
   npm run dev
   ```

2. **Access dashboard**: http://localhost:3000

3. **Create API Token**:
   - Sign in → Dashboard → Settings → API Tokens
   - Click "Create Token" → Select **TEST** environment
   - **Copy the token immediately!** (shown only once)
   - Format: `pk_test_` followed by 64 characters

4. **Get Recipient Address**:
   - This is the merchant wallet address (your wallet address in the project)
   - Found in: Dashboard → Project Settings → User Profile
   - Or check your user account wallet address
   - Add it to `.env.local` as `NEXT_PUBLIC_RECIPIENT_ADDRESS`

### 3. Install & Run

```bash
# Install dependencies
npm install

# Run the demo
npm run dev
```

### 4. Test Payment

1. Connect wallet (Phantom/Solflare on **devnet**)
2. Get devnet USDC/USDT tokens (from faucet)
3. Enter recipient wallet address
4. Click "Pay" and confirm transaction

## Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Payment gateway base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_KEY` | ✅ Yes | API token (TEST for devnet) | `pk_test_abc123...` |
| `NEXT_PUBLIC_RECIPIENT_ADDRESS` | ✅ Yes | Merchant wallet (receives payments) | `YourWalletAddress...` |
| `NEXT_PUBLIC_SOLANA_NETWORK` | ✅ Yes | Network (use `devnet`) | `devnet` |

## Notes

- **Always use TEST tokens** for devnet (`pk_test_...`)
- **Recipient address** = merchant wallet (where payments go) - set in `.env.local`
- **Wallet must be on devnet** network
- **Need devnet tokens** to test (get from faucet)
- **Recipient address auto-fills** from env - no need to copy/paste each time!

For detailed setup, see [SETUP.md](./SETUP.md)

