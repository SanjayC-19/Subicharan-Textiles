import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, ArrowRight, Mail, Lock, User, MapPin } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { saveAuth, isLoggedIn } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password.trim() || !address.trim()) {
      toast.warning('Missing fields', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', 'Please make sure both passwords are the same');
      return;
    }

    if (password.length < 6) {
      toast.warning('Password too short', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role: 'user',
      });
      saveAuth(data.user.uid, data.user);
      toast.success('Account created!', `Welcome to Subicharan Textiles, ${data.user.name}!`);
      setTimeout(() => navigate('/'), 900);
    } catch (error) {
      // If Firebase signup succeeded but backend email failed, still complete signup
      if (error.message && error.message.includes('Failed to create account')) {
        toast.warning('Signup complete, but welcome email failed', 'Your account was created, but we could not send a welcome email.');
        setTimeout(() => navigate('/'), 900);
      } else {
        toast.error('Registration failed', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <section className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">
        {/* Header */}
        <div className="px-8 pt-10 pb-8 text-center bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-600">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur mb-4">
            <UserPlus size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-white/70 text-sm mt-1">Join Subicharan Textiles today</p>
        </div>

        <div className="p-8">
          <div className="space-y-5">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-violet-600 p-2 text-white">
                  <UserPlus size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Create your account</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Sign up with your email and password to start shopping.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3.5 text-zinc-400 group-focus-within:text-violet-600 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-400 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 text-zinc-400 group-focus-within:text-violet-600 transition-colors" size={16} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-400 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 text-zinc-400 group-focus-within:text-violet-600 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-400 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 text-zinc-400 group-focus-within:text-violet-600 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-400 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Delivery Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-3.5 text-zinc-400 group-focus-within:text-violet-600 transition-colors" size={16} />
                  <textarea
                    placeholder="Your full delivery address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 pt-2.5 pb-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-400 transition-all placeholder:text-zinc-300 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-violet-200" />
              <span className="text-xs text-zinc-500 font-medium">Already have an account?</span>
              <div className="flex-1 h-px bg-violet-200" />
            </div>

            <Link to="/login" className="block rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors">
              ← Back to Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
