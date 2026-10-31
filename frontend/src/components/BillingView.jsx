export default function BillingView({ balance, billingHistory }) {
  const totalSpent = billingHistory.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Available Escrow</p>
            <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-slate-900">${balance.toFixed(2)}</h2>
                <span className="text-sm font-medium text-slate-500">USDC</span>
            </div>
            <button className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                + Fund Wallet
            </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Spent</p>
            <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-slate-900">${totalSpent.toFixed(2)}</h2>
                <span className="text-sm font-medium text-slate-500">USDC</span>
            </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Scans Run</p>
            <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-slate-900">{billingHistory.length}</h2>
                <span className="text-sm font-medium text-slate-500">Transactions</span>
            </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
            <p className="text-sm text-slate-500">All payments settled via Celo x402 protocol.</p>
            </div>
            
            {billingHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
                <p>No transactions yet. Run a scan to see your billing history.</p>
            </div>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium">Tx Hash</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {billingHistory.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{tx.date}</td>
                        <td className="p-4 text-sm font-medium text-slate-900">{tx.description}</td>
                        <td className="p-4 text-sm font-mono text-slate-500">{tx.txHash}</td>
                        <td className="p-4 text-sm font-bold text-red-500 text-right whitespace-nowrap">
                        -${tx.amount.toFixed(2)} USDC
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <div>
            <h3 className="text-sm font-bold text-blue-900 mb-1">Treasury Endpoint</h3>
            <p className="text-sm text-blue-700 mb-2">All scan payments are routed directly to the SocialScout treasury contract on Celo Mainnet.</p>
            <code className="bg-white/60 px-2 py-1 rounded text-xs font-mono text-blue-800 border border-blue-200">
                0x9A8f...Tre4asuryCelo
            </code>
            </div>
        </div>

    </div>
  );
}