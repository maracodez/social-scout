import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CompetitorsView({ 
  competitors, setCompetitors, 
  newCompetitor, setNewCompetitor,
  businessDescription, setBusinessDescription, 
  isDiscovering, handleDiscover 
}) {

    const [showSuccess, setShowSuccess] = useState(false);

    // Wrapper function to handle discovery and trigger the success state
    const onDiscoverClick = async () => {
        // We call the original handleDiscover function passed from App.jsx
        await handleDiscover();
        
        // Once it finishes, show the success message
        setShowSuccess(true);
        
        // Hide the success message after 3 seconds
        setTimeout(() => {
        setShowSuccess(false);
        }, 3000);
    };


  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Tracked Competitors</h2>
            <p className="text-slate-500 text-sm">Add X (Twitter) handles for the agent to monitor and extract pricing from.</p>
        </div>

        {/* AI Auto-Discovery Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                Don't know their exact name?
            </h3>
            <p className="text-sm text-slate-500 mb-4">Describe what you are building, and the agent will find your competitors.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
            <input 
                type="text" 
                placeholder="e.g. I am building a Web3 payment gateway..." 
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                disabled={isDiscovering || showSuccess}
                className="flex-1 px-4 py-2.5 bg-white border hover:border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
            />
            <button 
                onClick={onDiscoverClick}
                disabled={isDiscovering || !businessDescription}
                className="bg-[#FCFF52] hover:bg-yellow-400 disabled:opacity-50 text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 min-w-[150px] cursor-pointer"
            >
                {isDiscovering ? (
                    <>
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> 
                        Finding...
                    </>
                    ) : showSuccess ? (
                    <>
                        <CheckCircle2 size={18} /> Success!
                    </>
                    ) : (
                    "Auto-Discover"
                    )}
            </button>
            </div>
        </div>

        <div className="relative flex items-center py-4 mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Or add manually</span>
            <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">@</span>
                <input 
                    type="text" 
                    placeholder="e.g. Uniswap" 
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value.replace('@', ''))}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCompetitor && !competitors.includes(newCompetitor)) {
                        setCompetitors([...competitors, newCompetitor]);
                        setNewCompetitor('');
                    }
                    }}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:text-[.8rem] rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
            </div>
            <button 
                onClick={() => {
                    if (newCompetitor && !competitors.includes(newCompetitor)) {
                    setCompetitors([...competitors, newCompetitor]);
                    setNewCompetitor('');
                    }
                }}
                className="bg-slate-900 hover:bg-yellow-400 hover:text-black text-white px-6 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
                Add Competitor
            </button>
        </div>

        <div className="space-y-3">
            {competitors.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No competitors added yet.</p>
            ) : (
            competitors.map((comp, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">
                    {comp.charAt(0).toUpperCase()}
                    </div>
                    <div>
                    <p className="font-bold text-slate-900">@{comp}</p>
                    <p className="text-xs text-slate-500">X (Twitter) Network</p>
                    </div>
                </div>
                <button 
                    onClick={() => setCompetitors(competitors.filter(c => c !== comp))}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                    Remove
                </button>
                </div>
            ))
            )}
        </div>
    </div>
  );
}