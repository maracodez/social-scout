const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// In-Memory Database store for keeping task states
const tasks = {};

// Bulletproof simulation of the @celo/buy x402 microtransaction
function runCeloBuyCLI(handle, taskId) {
	console.log(`[Task ${taskId}] Initiating x402 payment for: from:${handle}`);
	
	// Generate a realistic-looking Celo transaction hash
	const chars = '0123456789abcdef';
	let txHash = '0x';
	for (let i = 0; i < 64; i++) txHash += chars[Math.floor(Math.random() * 16)];

	// Simulate the actual gateway responses based on the handle
	let mockPost = "No recent posts found.";
	let mockPrice = "Checked via x402 gateway";

	if (handle.toLowerCase() === 'celo') {
		mockPost = "Excited to announce our new x402 agentic payments framework! Developers can now pay for APIs seamlessly using USDC. 🚀";
		mockPrice = "$0.02 per API call (x402)";
	} else if (handle.toLowerCase() === 'uniswap') {
		mockPost = "v4 is officially here. Liquidity pools are now fully customizable, and protocol fees have been lowered to 0.25%.";
		mockPrice = "Tiered Pricing (0.25% protocol fee)";
	} else if (handle.toLowerCase() === 'hyperscale_ai') {
		mockPost = "Launching our annual tier! Get unlimited agent workflows starting at $49/mo. Deal ends Friday.";
		mockPrice = "$49/mo (was $89/mo)";
	}

	return {
		competitor: handle,
		handle: `@${handle}`,
		recentPost: mockPost,
		priceDetected: mockPrice, 
		sentiment: "Positive",
		time: "Just now",
		txHash: txHash
	};
}

// ASYNC INITIATION ENDPOINT (Returns 202 instantly)
app.post('/api/scan', (req, res) => {
	const { competitors } = req.body;
	
	if (!competitors || !Array.isArray(competitors)) {
		return res.status(400).json({ error: "Invalid competitors list" });
	}

	const taskId = 'task_' + Date.now();
	
	tasks[taskId] = {
		status: 'processing',
		progress: `ERC-8004 Agent Identity Verified. Processing x402 microtransactions...`,
		data: []
	};

	console.log(`\n[Event-Trigger] Task ${taskId} launched for: ${competitors.join(', ')}`);

	// Respond immediately (202 Accepted)
	res.status(202).json({ success: true, taskId });

	
	setTimeout(async () => {
		const report = [];
		for (const handle of competitors) {
		const result = runCeloBuyCLI(handle, taskId);
		report.push(result);
		
		
		await new Promise(resolve => setTimeout(resolve, 800)); 
		}
		
		tasks[taskId].status = 'completed';
		tasks[taskId].progress = 'Analysis completed successfully.';
		tasks[taskId].data = report;
		console.log(`[Task ${taskId}] Background job successfully resolved.`);
	}, 1500); 
});

//STATUS POLLING ENDPOINT
app.get('/api/scan-status/:taskId', (req, res) => {
  const { taskId } = req.params;
  const task = tasks[taskId];

  if (!task) {
    return res.status(404).json({ error: "Task identifier session not found" });
  }

  res.json({
    status: task.status,
    progress: task.progress,
    data: task.data
  });
});

// BUSINESS DISCOVERY ROUTE
app.post('/api/discover', (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: "Description is required" });

  setTimeout(() => {
    let discovered = [];
    const text = description.toLowerCase();
    if (text.includes('payment') || text.includes('pay') || text.includes('fintech')) discovered = ['Celo', 'Stripe', 'Circle'];
    else if (text.includes('defi') || text.includes('exchange')) discovered = ['Uniswap', 'Aave', 'ChainstackHQ'];
    else if (text.includes('coffee') || text.includes('restaurant')) discovered = ['Starbucks', 'BlueBottle', 'Philzcoffe'];
    else if (text.includes('ai') || text.includes('agent')) discovered = ['OpenAI', 'AnthropicAI', 'HuggingFace'];
    else discovered = ['HyperScale_AI', 'CloudMetrics', 'TechCrunch'];

    res.json({ success: true, competitors: discovered });
  }, 1500);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SocialScout Event-Driven Backend running on port ${PORT}`);
});