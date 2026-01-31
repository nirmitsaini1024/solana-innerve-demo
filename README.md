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
- ✅ Select payment currency (USDC/USDT)
- ✅ Create payment sessions via API
- ✅ Process payments on Solana blockchain
- ✅ View payment status and transaction signatures
- ✅ Real-time payment confirmation

## Usage

1. **Connect Wallet**: Click "Select Wallet" and connect your Solana wallet (Phantom, Solflare, etc.)

2. **Configure Payment**:
   - Select currency (USDC or USDT)
   - Recipient address auto-fills from `.env.local` (can override if needed)
   - Review order summary

3. **Process Payment**:
   - Click "Pay" button
   - The app will create a payment session via API
   - Confirm the transaction in your wallet
   - Wait for blockchain confirmation

4. **View Results**:
   - Session ID and transaction signature will be displayed
   - Payment status will update automatically

## Testing on Devnet

For testing purposes, you can use devnet tokens:
- Get devnet USDC/USDT from faucets
- Use devnet wallet addresses
- Set `NEXT_PUBLIC_SOLANA_NETWORK=devnet` in `.env.local`

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
- **Transaction fails**: Check that you have sufficient token balance and the recipient address is valid
- **API errors**: Verify your API key and URL are correct in `.env.local`
- **Network issues**: Ensure you're on the correct network (devnet/mainnet) matching your tokens

