# Payment Gateway Demo - Setup Guide

## Quick Setup for Devnet

Since you're using **devnet**, here's a step-by-step guide to get everything working.

## Step 1: Get Your API Key

### Option A: If you have access to the payment gateway dashboard

1. **Start the payment gateway application** (the main `okito` folder):
   ```bash
   cd ../okito
   npm install
   npm run dev
   ```

2. **Access the dashboard**:
   - Open http://localhost:3000 (or your deployed URL)
   - Sign in or create an account

3. **Create a Project**:
   - Go to Dashboard
   - Create a new project (or use existing one)
   - Note the project ID

4. **Create an API Token**:
   - Go to Settings → API Tokens
   - Click "Create Token" for **TEST** environment (since you're using devnet)
   - **IMPORTANT**: Copy the token immediately - it's only shown once!
   - Format: `pk_test_...` (for devnet/testing)

5. **Get Recipient Address**:
   - The recipient address is your wallet address from the project settings
   - Or check your user profile for the wallet address

### Option B: If you need to create API key programmatically

You can also create an API key via the API if you have admin access, but the dashboard method is recommended.

## Step 2: Configure Environment Variables

1. **Create `.env.local` file** in the `tets-okito` folder:
   ```bash
   cd tets-okito
   touch .env.local
   ```

2. **Add these variables**:
   ```env
   # Payment Gateway API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_API_KEY=pk_test_YOUR_TOKEN_HERE
   
   # Solana Network - Using devnet
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   ```

3. **Replace values**:
   - `NEXT_PUBLIC_API_URL`: The URL where your payment gateway is running
     - Local: `http://localhost:3000`
     - Deployed: `https://your-domain.com`
   - `NEXT_PUBLIC_API_KEY`: The API token you copied (starts with `pk_test_`)
   - `NEXT_PUBLIC_SOLANA_NETWORK`: Keep as `devnet` for testing

## Step 3: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 4: Run the Demo

```bash
npm run dev
```

The demo will start on http://localhost:3000 (or next available port).

## Step 5: Test the Payment Flow

1. **Connect Wallet**:
   - Click "Select Wallet"
   - Connect Phantom, Solflare, or another Solana wallet
   - Make sure your wallet is on **devnet** network

2. **Get Devnet Tokens** (if needed):
   - USDC Devnet: Use a devnet faucet
   - Make sure you have some devnet USDC/USDT in your wallet

3. **Configure Payment**:
   - Select currency (USDC or USDT)
   - Enter the **recipient wallet address** (the merchant's wallet that receives payments)**
   - Review order summary

4. **Process Payment**:
   - Click "Pay"
   - Confirm transaction in your wallet
   - Wait for confirmation

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of payment gateway API | `http://localhost:3000` |
| `NEXT_PUBLIC_API_KEY` | Your API token (TEST for devnet) | `pk_test_abc123...` |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network to use | `devnet` |

## Troubleshooting

### "API key not configured"
- Make sure `.env.local` exists in the `tets-okito` folder
- Check that `NEXT_PUBLIC_API_KEY` is set
- Restart the dev server after changing `.env.local`

### "Invalid or inactive API key"
- Verify the API key is correct (starts with `pk_test_` for devnet)
- Check that the token is ACTIVE in the dashboard
- Ensure you're using a TEST token (not LIVE) for devnet

### "No token account found"
- Make sure your wallet has devnet USDC/USDT tokens
- Switch your wallet to devnet network
- Get devnet tokens from a faucet

### "Recipient address is required"
- Enter the wallet address that should receive the payment
- This is typically the merchant's wallet address from the project settings

## API Key Format

- **TEST tokens** (for devnet): `pk_test_` followed by 64 hex characters
- **LIVE tokens** (for mainnet): `pk_live_` followed by 64 hex characters

For devnet testing, always use **TEST** tokens.

## Next Steps

Once everything is working:
1. Test with small amounts first
2. Verify payments appear in the payment gateway dashboard
3. Check transaction signatures on Solana Explorer (devnet)
4. Monitor payment status updates



