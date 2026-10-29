# SocialScout 🕵️

An autonomous AI agent that tracks competitors' social media posts and pricing for small business owners — paying per-use via Celo's `buy` marketplace (x402), with no API keys or subscriptions required.

## 🎯 The Problem
Small business owners don't have time (or budget) to manually monitor competitors' Instagram posts, TikTok trends, or Shopify prices. Existing tools are expensive subscriptions with locked-in API keys.

## 💡 The Solution
SocialScout is an agent that:
1. **Discovers** a competitor's website and social handles
2. **Pays autonomously** (via `@celo/buy`) for browser sessions and social media APIs
3. **Extracts** pricing data and recent posts
4. **Delivers** a clean daily intelligence brief to the shop owner

## 🛠️ Built With
- **Celo `buy` marketplace** (x402 payments in USDC/USDT)
- Node.js 20+
- ERC-8004 Agent Identity

## 🚀 Quickstart
```bash
npx --yes @celo/buy@0.3.0 setup --name socialscout
npx --yes @celo/buy@0.3.0 verify serve --mock-passport
