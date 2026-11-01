import { useState } from 'react';
import logo from '../../public/logo.jpeg'

export default function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('socialscout_users') || '[]');

    if (isLogin) {
      // LOGIN LOGIC
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('socialscout_current_user', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // SIGNUP LOGIC
      if (users.find(u => u.email === email)) {
        setError('Email already exists. Please log in.');
        return;
      }
      const newUser = { email, password, name: email.split('@')[0] };
      users.push(newUser);
      localStorage.setItem('socialscout_users', JSON.stringify(users));
      localStorage.setItem('socialscout_current_user', JSON.stringify(newUser));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white z-10 shadow-2xl">
            <div className="mx-auto w-full max-w-sm lg:w-96">
                <div className="flex items-center  mb-8">
                    <img src={logo} alt="SocialScout Logo" className="h-22 object-contain" />
                    <span className="font-bold text-4xl tracking-tight text-green-800">SocialScout</span>
                </div>
            
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-slate-500 mb-8">
                    {isLogin ? 'Enter your details to access your dashboard.' : 'Start tracking your competitors today.'}
                </p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        placeholder="you@company.com"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        placeholder="••••••••"
                    />
                    </div>

                    <button
                    type="submit"
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-slate-900 bg-celo hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors cursor-pointer"
                    >
                    {isLogin ? 'Sign in' : 'Create account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                    	{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>

        {/* Right Side - Graphic */}
        <div className="hidden lg:block relative flex-1 bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center">
                <h2 className="text-4xl font-bold text-white mb-6">Autonomous Agentic Intelligence.</h2>
                <p className="text-lg text-slate-300">Pay per-use via Celo x402. No subscriptions, no API keys. Just pure data.</p>
            </div>
            </div>
        </div>
    </div>
  );
}