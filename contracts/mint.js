import { createAgentIdentity } from '8004sdk';
import 'dotenv/config';

async function main() {
  const identity = await createAgentIdentity({
    rpcUrl: 'https://forno.celo.org', // Celo mainnet RPC
    chainId: 42220,                    // Celo mainnet Chain ID
    privateKey: process.env.AGENT_PRIVATE_KEY,
    autoRegister: true,                // Automatically execute on-chain registration
  });

  console.log(' Agent ID:', identity.agentId);
  console.log(' Wallet Address:', identity.walletAddress);
}

main().catch(console.error);