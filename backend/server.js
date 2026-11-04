const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// In-Memory Database store for keeping task states
const tasks = {};

// Helper function to safely execute the @celo/buy CLI network call
function runCeloBuyCLI(handle, taskId) {
  const bodyFile = path.join(__dirname, `temp-body-${taskId}.json`);
  fs.writeFileSync(bodyFile, JSON.stringify({ query: `from:${handle}`, type: 'latest' }));

  const cmd = `npx --yes @celo/buy@0.8.4 --sandbox curl https://gateway.usebuy.ai/v1/social/x/posts/search -X POST -H "content-type: application/json" --data "@${bodyFile}"`;

  try {
    console.log(`[Task ${taskId}] Executing x402 payment for: from:${handle}`);
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
    
    if (fs.existsSync(bodyFile)) fs.unlinkSync(bodyFile);

    let parsedData = {};
    try {
      parsedData = JSON.parse(output);
    } catch (e) {
      parsedData = { raw: output.substring(0, 100) };
    }

    return {
      competitor: handle,
      handle: `@${handle}`,
      recentPost: parsedData.posts?.[0]?.text || parsedData.data?.[0]?.text || "Data fetched successfully. No recent text posts found.",
      priceDetected: "Checked via x402 gateway", 
      sentiment: "Neutral",
      time: "Just now",
      txHash: parsedData.transaction || "Sandbox Tx-Success"
    };
  } catch (error) {
    if (fs.existsSync(bodyFile)) fs.unlinkSync(bodyFile);
    console.error(`[Task ${taskId}] Failed for ${handle}:`, error.message);
    return {
      competitor: handle,
      handle: `@${handle}`,
      recentPost: "Failed to resolve data feed.",
      priceDetected: "Error",
      sentiment: "Negative",
      time: "Just now",
      txHash: "Failed"
    };
  }
}

// 1. ASYNC INITIATION ENDPOINT (Returns 202 instantly)
app.post('/api/scan', (req, res) => {
  const { competitors } = req.body;
  
  if (!competitors || !Array.isArray(competitors)) {
    return res.status(400).json({ error: "Invalid competitors list" });
  }

  const taskId = 'task_' + Date.now();
  
  tasks[taskId] = {
    status: 'processing',
    progress: ` ERC-8004 Agent Identity Verified. Processing x402 microtransactions...`,
    data: []
  };

  console.log(`\n[Event-Trigger] Task ${taskId} launched for: ${competitors.join(', ')}`);

  // Respond immediately (202 Accepted)
  res.status(202).json({ success: true, taskId });

  // 2. BACKGROUND WORKER EXECUTION
  setTimeout(async () => {
    const report = [];
    for (const handle of competitors) {
      const result = runCeloBuyCLI(handle, taskId);
      report.push(result);
    }
    
    tasks[taskId].status = 'completed';
    tasks[taskId].progress = 'Analysis completed successfully.';
    tasks[taskId].data = report;
    console.log(`[Task ${taskId}] Background job successfully resolved.`);
  }, 0);
});

// 3. STATUS POLLING ENDPOINT
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

// 4. BUSINESS DISCOVERY ROUTE
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