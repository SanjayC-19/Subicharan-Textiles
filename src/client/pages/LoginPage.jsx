import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { saveAuth, isLoggedIn } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.warning('Missing fields', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email: email.trim(), password });
      saveAuth(data.token, data.user);
      toast.success('Welcome back!', `Signed in as ${data.user.name || data.user.email}`);
      setTimeout(() => navigate('/'), 800);
    } catch (error) {
      toast.error('Sign in failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-slate-50 via-zinc-50 to-stone-100">
      <section className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100">
        {/* Header */}
        <div className="px-8 pt-10 pb-8 text-center bg-linear-to-br from-zinc-800 via-zinc-900 to-black">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-white/70 text-sm mt-1">Sign in to your buyer account</p>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-zinc-900 p-2 text-white">
                  <Lock size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Secure login</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Enter your email and password to access your account.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200" />
              <span className="text-xs text-zinc-500 font-medium">New to us?</span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            <Link to="/signup" className="block rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-center text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-colors">
              Create Account →
            </Link>

            <div className="pt-2 border-t border-zinc-100 text-center">
              <p className="text-xs text-zinc-500">
                Are you an admin?{' '}
                <Link to="/admin/login" className="text-emerald-600 font-bold hover:underline underline-offset-2">
                  Admin Login →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

