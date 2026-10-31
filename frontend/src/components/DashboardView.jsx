import { Activity, Play, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DashboardView({ results, isGenerating, setIsModalOpen, setResults }) {
  return (
    <div className="space-y-6">
        {!results && !isGenerating && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm mt-8">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Activity className="text-slate-400" size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">No active competitor scans yet</h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">Set your target handles or start scanning autonomous feeds with Celo x402 settlement.</p>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-celo hover:bg-yellow-400 text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                    <Play size={18} /> Start Scanning
                </button>
            </div>
        )}

        {isGenerating && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm mt-8">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-bold mb-2">Agent is working...</h2>
                <p className="text-slate-500 mb-8">Paying via @celo/buy micro-transactions</p>
                
                <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-4 border border-slate-100 text-left">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 font-medium">Active Pipeline</span>
                        <span className="text-slate-900 font-semibold">In Flight</span>
                    </div>
                    <div className="text-sm text-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        Querying X firehose... verifying signature on Celo
                    </div>
                </div>
            </div>
        )}

        {results && (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4 mt-2">
                    <button 
                    onClick={() => setResults(null)}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Back to Dashboard
                    </button>
                    <span className="text-xs font-medium text-slate-400">Latest Scan</span>
                </div>

                <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg border border-green-200 text-sm font-medium flex justify-between items-center">
                    <span className="flex items-center gap-2"><CheckCircle2 size={18} /> Agent settled {results.length} scans via @celo/buy</span>
                    <span className="font-mono">-${(results.length * 0.02).toFixed(2)} USDC</span>
                </div>

                {results.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <h3 className="font-bold text-lg text-slate-900">{item.competitor} <span className="text-green-500 text-sm ml-1">●</span></h3>
                            <p className="text-sm text-slate-500">{item.handle} • {item.time}</p>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${item.badgeColor}`}>
                            {item.badge}
                            </span>
                        </div>
                        
                        <p className="text-slate-700 mb-4 leading-relaxed">"{item.recentPost}"</p>
                        
                        <div className="bg-[#fefce8] border border-yellow-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-yellow-800 uppercase flex items-center gap-1">
                                <AlertCircle size={14}/> Pricing Detected
                            </span>
                            <span className="text-xs font-medium text-yellow-700 bg-yellow-200/50 px-2 py-0.5 rounded">{item.diff}</span>
                            </div>
                            <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-slate-900">{item.price}</span>
                                <span className="text-sm text-slate-500 ml-1">/mo</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs text-slate-500 mb-1">Conf: {item.confidence}</span>
                                <span className="text-[10px] font-mono text-slate-400 bg-white/50 px-2 py-0.5 rounded border border-yellow-200/50">tx402: 0x8a9f...c24e</span>
                            </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}