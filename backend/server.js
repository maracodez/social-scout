const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// The API endpoint the frontend will call
app.post('/api/scan', async (req, res) => {
  const { competitors } = req.body;
  
  if (!competitors || !Array.isArray(competitors)) {
    return res.status(400).json({ error: "Invalid competitors list" });
  }

  console.log(`\n🕵️ Received scan request for: ${competitors.join(', ')}`);
  const report = [];

  for (const handle of competitors) {
    console.log(`💸 Paying for query: from:${handle}`);
    
    // 1. Write the JSON body to a temp file (avoids shell errors)
    const bodyFile = path.join(__dirname, 'temp-body.json');
    fs.writeFileSync(bodyFile, JSON.stringify({ query: `from:${handle}`, type: 'latest' }));

    // 2. Run the actual @celo/buy command
    const cmd = `npx --yes @celo/buy@0.8.4 --sandbox curl https://gateway.usebuy.ai/v1/social/x/posts/search -X POST -H "content-type: application/json" --data "@${bodyFile}"`;

    try {
      const output = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
      fs.unlinkSync(bodyFile); // Clean up

      let parsedData = {};
      try {
        parsedData = JSON.parse(output);
      } catch (e) {
        parsedData = { raw: output.substring(0, 100) };
      }

      // 3. Format the real data for the frontend
      // (In a real app, you would parse parsedData.posts to find actual text/prices)
      report.push({
        competitor: handle,
        handle: `@${handle}`,
        recentPost: parsedData.posts?.[0]?.text || "Data fetched successfully. No recent text posts found.",
        priceDetected: "Checked via API", // We'd extract this with more complex logic later
        sentiment: "Neutral",
        time: "Just now",
        txHash: parsedData.transaction || "Sandbox Tx"
      });

    } catch (error) {
      if (fs.existsSync(bodyFile)) fs.unlinkSync(bodyFile);
      console.error(`Failed for ${handle}:`, error.message);
      report.push({
        competitor: handle,
        handle: `@${handle}`,
        recentPost: "Failed to fetch data.",
        priceDetected: "Error",
        sentiment: "Negative",
        time: "Just now",
        txHash: "Failed"
      });
    }
  }

  // Send the real report back to React
  res.json({ success: true, data: report });
});

const PORT = 3001;

//new discovery endpoint
app.post('/api/discover', (req, res) => {
  const { description } = req.body;

  if (!description) { 
    return res.status(400).json({ error: "Description is required"})
  }

  console.log(`\n Agent analyzing business description: "${description}"`);


  //simulate AI processing delay
  setTimeout(() => {
		let discovered = [];
		const text = description.toLowerCase();

		//simple logic to map description into real handles
		if (text.includes('payment') || text.includes('pay') || text.includes('fintech') || text.includes('money')) {
			discovered = ['Celo', 'Stripe', 'Circle'];
		} else if (text.includes('defi') || text.includes('exchange') || text.includes('swap')) {
			discovered = ['Uniswap', 'Aave', 'ChainstackHQ'];
		} else if (text.includes('coffee') || text.includes('restaurant') || text.includes('food')) {
			discovered = ['Starbucks', 'BlueBottle', 'Philzcoffe'];
		} else if (text.includes('ai') || text.includes('agent') || text.includes('bot')) {
			discovered = ['OpenAI', 'AnthropicAI', 'HuggingFace'];
		} else {
			//default fallback
			discovered = ['HyperScale_AI', 'CloudMetrics', 'TechCrunch'];
		}


		console.log(`Agent discovered: ${discovered.join(', ')}`);
		res.json({ success: true, competitors: discovered})
  }, 2000);
})
app.listen(PORT, () => {
  console.log(`SocialScout Backend running on http://localhost:${PORT}`);
  console.log(`Make sure your frontend is running on a different port (usually 5173)`);
});