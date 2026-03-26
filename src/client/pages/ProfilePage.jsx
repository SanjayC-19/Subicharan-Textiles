import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/userService';
import { User, Mail, MapPin, LogOut, Save, Edit3, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ name: '', address: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getProfile();
        setForm({ name: profile.name || '', address: profile.address || '' });
        setUser(profile);
      } catch {
        // Firebase-only user — populate from auth context
        setForm({ name: user?.name || '', address: user?.address || '' });
      }
    };
    load();
  }, [setUser, user?.name, user?.address]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen pt-24 pb-24 bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 px-8 py-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(45deg,transparent,transparent_10px,white_10px,white_11px)]" />
            <div className="relative flex items-center gap-5">
              <div className="w-18 h-18 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-bold font-serif w-20 h-20">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-serif text-white font-bold leading-tight">{user.name || 'My Profile'}</h1>
                <p className="text-emerald-200 text-sm mt-1 flex items-center gap-2">
                  <Mail size={13} /> {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            {saved && (
              <div className="mb-6 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 text-sm font-medium">
                <CheckCircle size={16} /> Profile updated successfully
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
                  <User size={11} className="inline mr-1.5" />Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!editing}
                  className="w-full h-12 border border-zinc-200 rounded-lg px-4 text-sm font-medium text-zinc-900 bg-zinc-50 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
                  <MapPin size={11} className="inline mr-1.5" />Delivery Address
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!editing}
                  rows={3}
                  className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm font-medium text-zinc-900 bg-zinc-50 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                  placeholder="Your delivery address"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-60"
                  >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-5 py-2.5 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Logout Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-8 py-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Sign Out</h3>
            <p className="text-xs text-zinc-500 mt-0.5">You'll be returned to the login page.</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

      </div>
    </main>
  );
}
