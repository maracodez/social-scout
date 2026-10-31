import { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import { Zap } from 'lucide-react';
import Sidebar from './components/sidebar';
import DashboardView from './components/DashboardView';
import CompetitorsView from './components/CompetitorsView';
import BillingView from './components/BillingView';

export default function App() {
	const [user, setUser] = useState(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	
	const [activeTab, setActiveTab] = useState('dashboard');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [results, setResults] = useState(null);
	
	const [competitors, setCompetitors] = useState(['Celo', 'HyperScale_AI', 'CloudMetrics']);
	const [newCompetitor, setNewCompetitor] = useState('');
	const [businessDescription, setBusinessDescription] = useState('');
	const [isDiscovering, setIsDiscovering] = useState(false);
	
	const [balance, setBalance] = useState(14.80);
	const [billingHistory, setBillingHistory] = useState([]);
	const [scanCount, setScanCount] = useState(0);

	// Check if user is already logged in when page loads
	useEffect(() => {
		const loggedInUser = localStorage.getItem('socialscout_current_user');
		if (loggedInUser) {
		setUser(JSON.parse(loggedInUser));
		}
		setIsAuthLoading(false);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('socialscout_current_user');
		setUser(null);
	};

  const handleDiscover = async () => {
    if (!businessDescription) return;
    setIsDiscovering(true);
    try {
      const response = await fetch('http://localhost:3001/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: businessDescription })
      });
      const data = await response.json();
      if (data.success) {
        const newCompetitors = data.competitors.filter(c => !competitors.includes(c));
        setCompetitors([...competitors, ...newCompetitors]);
        setBusinessDescription('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handlePaymentAndRun = async () => {
    setIsModalOpen(false);
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitors: competitors })
      });

      const result = await response.json();
      
      if (result.success) {
        const formattedResults = result.data.map(item => ({
          ...item,
          badge: item.competitor === 'Celo' ? 'PRICING DETECTED' : 'DISCOUNT ALERT',
          badgeColor: item.competitor === 'Celo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800',
          price: item.competitor === 'Celo' ? '$49/mo' : '$29/mo',
          diff: item.competitor === 'Celo' ? 'was $89/mo' : 'up from $20',
          confidence: '99.4%',
        }));
        setResults(formattedResults);
        setScanCount(prev => prev + formattedResults.length);
        
        const cost = formattedResults.length * 0.02;
        setBalance(prev => Math.max(0, prev - cost));
        setBillingHistory(prev => [{
          id: Date.now(),
          date: new Date().toLocaleString(),
          description: `Agent Scan (${formattedResults.length} competitors)`,
          amount: cost,
          txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
        }, ...prev]);
      }
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      alert("Make sure your backend server.js is running!");
    } finally {
      setIsGenerating(false);
    }
  };

	if (isAuthLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
	
	if (!user) {
		return <AuthScreen onLogin={setUser} />;
	}
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-900">
      
      <Sidebar 
			activeTab={activeTab} 
			setActiveTab={setActiveTab} 
			balance={balance}
			user={user} 
        	handleLogout={handleLogout}  
	  />

      <main className="flex-1 flex flex-col min-w-0">
			<header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
				<h1 className="text-lg font-bold hidden md:block">Competitor Intelligence</h1>
				<div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
					<div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
					<span className={`w-2 h-2 rounded-full ${competitors.length > 0 ? 'bg-green-500' : 'bg-slate-400'}`}></span>
					<span className="font-medium text-slate-700">Active Feed</span> 
					<span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-slate-900 shadow-sm">
						{competitors.length} Tracked
					</span>
					{scanCount > 0 && (
						<span className="text-xs text-green-600 font-medium ml-2 border-l border-slate-300 pl-2">
						{scanCount} Scans Run
						</span>
					)}
					</div>
					<button 
						onClick={() => setIsModalOpen(true)}
						className="bg-slate-900 hover:bg-slate-700 hover:text-[.7rem] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
					>
						<Zap size={16} className="text-celo" /> Run Scan
					</button>
				</div>
			</header>

			<div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex-1">
			{activeTab === 'dashboard' && (
				<DashboardView 
					results={results} 
					isGenerating={isGenerating} 
					setIsModalOpen={setIsModalOpen} 
					setResults={setResults} 
				/>
			)}
			
			{activeTab === 'competitors' && (
				<CompetitorsView 
					competitors={competitors} setCompetitors={setCompetitors}
					newCompetitor={newCompetitor} setNewCompetitor={setNewCompetitor}
					businessDescription={businessDescription} setBusinessDescription={setBusinessDescription}
					isDiscovering={isDiscovering} handleDiscover={handleDiscover}
				/>
			)}

			{activeTab === 'billing' && (
				<BillingView balance={balance} billingHistory={billingHistory} />
			)}
			</div>
      </main>

      {isModalOpen && (
			<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
					<div className="p-6 border-b border-slate-100">
						<h3 className="text-xl font-bold text-slate-900 mb-1">Confirm Scan</h3>
						<p className="text-sm text-slate-500">Autonomous Agent Execution</p>
					</div>
					
					<div className="p-6">
						<div className="space-y-3 mb-6 text-sm">
							<div className="flex justify-between">
								<span className="text-slate-500">Est. API Calls</span>
								<span className="font-medium text-slate-900">{competitors.length} Queries</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-500">Price per call</span>
								<span className="font-medium text-slate-900">$0.02 USDC</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-500">Network</span>
								<span className="font-medium text-slate-900 flex items-center gap-1">
									<span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Celo Mainnet (Sandbox)
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-500">Protocol</span>
								<span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">@celo/buy (x402)</span>
							</div>
						</div>

						<div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center mb-6 border border-slate-100">
							<span className="font-bold text-slate-900">Total</span>
							<span className="text-xl font-bold text-slate-900">${(competitors.length * 0.02).toFixed(2)} <span className="text-sm text-slate-500">USDC</span></span>
						</div>

						<div className="flex gap-3">
							<button 
								onClick={() => setIsModalOpen(false)}
								className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
							>
								Cancel
							</button>
							<button 
								onClick={handlePaymentAndRun}
								className="flex-1 bg-celo hover:bg-yellow-400 text-slate-900 px-4 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
							>
								<Zap size={16} /> Pay & Run
							</button>
						</div>
					</div>
				</div>
			</div>
      )}
    </div>
  );
}