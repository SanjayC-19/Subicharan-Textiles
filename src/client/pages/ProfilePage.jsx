import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/userService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ name: '', address: '' });

  useEffect(() => {
    const load = async () => {
      const profile = await getProfile();
      setForm({ name: profile.name, address: profile.address });
      setUser(profile);
    };
    load();
  }, [setUser]);

  const handleSave = async () => {
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      alert('Profile updated');
    } catch (error) {
      alert(error.message);
    }
  };

  if (!user) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 space-y-6">
      <div className="border border-border p-5 bg-card">
        <h1 className="text-3xl font-serif">Profile</h1>
        <p className="mt-2">Email: {user.email}</p>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="h-11 border border-border px-3"
            placeholder="Name"
          />
          <input
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            className="h-11 border border-border px-3"
            placeholder="Address"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={handleSave} className="px-4 h-10 bg-primary text-primary-foreground text-xs uppercase tracking-widest">
            Edit profile
          </button>
          <button type="button" onClick={logout} className="px-4 h-10 border border-border text-xs uppercase tracking-widest hover:bg-gray-50">
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
