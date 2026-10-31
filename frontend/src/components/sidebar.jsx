import { Wallet, Activity, ShieldCheck, LogOut  } from 'lucide-react';
import logo from '../../public/logo.png'


export default function Sidebar({ activeTab, setActiveTab, balance, user, handleLogout }) {
  return (
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0">
            <div className="h-15 flex items-center px-2 border-b border-slate-200 ">
                <img src={logo} alt="SocialScout Logo" className="h-8 object-contain" />
                <span className="font-bold text-xl tracking-tight text-green-800">SocialScout</span>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                <Activity size={18} /> Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('competitors')}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'competitors' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                <ShieldCheck size={18} /> Competitors
                </button>
                <button 
                    onClick={() => setActiveTab('billing')}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'billing' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                <Wallet size={18} /> Billing
                </button>
            </nav>
            
            {/* WALLET WIDGET */}
            <div className="p-4 border-t border-slate-200 hidden md:block">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wallet</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Sandbox
                    </span>
                </div>
                <p className="text-sm font-mono text-slate-800 mb-3">0x6B40...6172</p>
                <div>
                    <span className="text-xs text-slate-500 block mb-1">Available Escrow</span>
                    <span className="text-lg font-semibold">{balance.toFixed(2)} <span className="text-xs text-slate-500">USDC on Celo</span></span>
                </div>
                </div>
            </div>

            {/* USER PROFILE */}
            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-celo text-slate-900 flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Log out">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
  );
}