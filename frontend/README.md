# 🕵️ SocialScout

An autonomous AI agent that tracks competitors' social media posts and pricing for small business owners — paying per-use via Celo's `buy` marketplace (x402).

## 📂 Project Structure
- **`/frontend`**: React + Vite + Tailwind CSS dashboard for business owners to manage competitors and view billing.
- **`/backend`**: Node.js + Express API that executes the `@celo/buy` x402 sandbox payments.
- **`/contracts`**: ERC-8004 Agent Identity minting scripts (proving on-chain agent ownership).

## 🚀 How to Run Locally

### 1. Start the Backend (Agent Engine)
```bash
cd backend
npm install
node server.js