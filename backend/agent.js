const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMPETITORS = [
  { name: 'Celo Official', handle: 'Celo' },
  { name: 'Chainstack', handle: 'ChainstackHQ' }
];

function paidSearchX(query) {
  console.log(`\n SocialScout paying for query "${query}" via x402 sandbox marketplace...`);

  const bodyFile = path.join(__dirname, 'temp-agent-body.json');
  fs.writeFileSync(bodyFile, JSON.stringify({ query: query, type: 'latest' }));

  const cmd = `npx --yes @celo/buy@0.8.4 --sandbox curl https://gateway.usebuy.ai/v1/social/x/posts/search -X POST -H "content-type: application/json" --data "@${bodyFile}"`;

  try {
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
    if (fs.existsSync(bodyFile)) fs.unlinkSync(bodyFile);

    try {
      const data = JSON.parse(output);
      return data.posts || data.data || data;
    } catch (e) {
      return output.substring(0, 500);
    }
  } catch (error) {
    if (fs.existsSync(bodyFile)) fs.unlinkSync(bodyFile);
    console.error(` Payment failed: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log(' Starting Local Agent Script Test Loop...\n');
  const report = [];

  for (const competitor of COMPETITORS) {
    const query = `from:${competitor.handle}`;
    const result = paidSearchX(query);
    
    // Extracted payload text parsing fallback
    let samplePostText = "No posts found.";
    if (Array.isArray(result) && result[0]) {
      samplePostText = result[0].text || JSON.stringify(result[0]);
    } else if (typeof result === 'object' && result !== null) {
      samplePostText = JSON.stringify(result).substring(0, 150);
    }

    report.push({
      competitor: competitor.name,
      handle: competitor.handle,
      summary: samplePostText
    });
  }

  console.log('\n ===== Local Agent Intelligence Brief Target Results =====');
  report.forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.competitor} (@${item.handle}): ${item.summary}`);
  });
}

// Only execute script directly if called from command line terminal
if (require.main === module) {
  main();
}