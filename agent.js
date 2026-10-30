const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


const COMPETITORS = [
  { name: 'Celo Official', handle: 'Celo' },
  { name: 'Chainstack', handle: 'ChainstackHQ' }
];


function paidSearchX(query) {
  console.log(`\n💸 SocialScout is paying for query "${query}"...`);

  // 1. Write the JSON body to a temp file
  const bodyFile = path.join(__dirname, 'temp-body.json');
  const bodyData = { query: query, type: 'latest' };
  fs.writeFileSync(bodyFile, JSON.stringify(bodyData));

  // 2. Build the curl command using --data @file
  // This avoids all shell quoting problems
  const cmd = `npx --yes @celo/buy@0.8.4 --sandbox curl https://gateway.usebuy.ai/v1/social/x/posts/search -X POST -H "content-type: application/json" --data "@${bodyFile}"`;

  try {
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
    // Clean up temp file
    fs.unlinkSync(bodyFile);

    try {
      const data = JSON.parse(output);
      return data.posts || data.data || data;
    } catch (e) {
      return output.substring(0, 500);
    }
  } catch (error) {
    // Clean up even on failure
    if (fs.existsSync(bodyFile)) fs.unlinkSync(bodyFile);
    console.error(` Payment or request failed: ${error.message}`);
    return [];
  }
}

// 3. Main flow: loop through competitors, fetch and summarize
async function main() {
  console.log('🕵️ SocialScout starting: tracking competitors...\n');
  
  const report = [];

  for (const competitor of COMPETITORS) {
    // Search for recent posts from this competitor
    const query = `from:${competitor.handle}`;
    const result = paidSearchX(query);
    
    // Store the result
    report.push({
      competitor: competitor.name,
      handle: competitor.handle,
      rawData: result,
      // Simulate extracting "price" or "key info" logic
      // In a real scenario, you'd parse text and extract numbers here
      summary: typeof result === 'string' ? result.substring(0, 100) : JSON.stringify(result).substring(0, 100)
    });
  }

  // 4. Output the final "intelligence brief"
  console.log('\n\n📊 ===== SocialScout Daily Intelligence Brief =====');
  console.log(`Generated at: ${new Date().toISOString()}\n`);
  
  report.forEach((item, index) => {
    console.log(`--- ${index + 1}. ${item.competitor} (@${item.handle}) ---`);
    console.log(`Data summary: ${item.summary}...`);
    console.log('');
  });

  console.log('✅ Brief generated. All data was paid per-use via the buy marketplace.');
}

// Run it
main();