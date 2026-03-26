import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const initialForm = {
  email: '',
  password: '',
};

export default function Login() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await loginUser(formData);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));
      alert('Successfully logged in to Subicharan Tex.');
      navigate('/');
    } catch (error) {
      alert(error.message || 'Unable to login right now');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen pt-10 pb-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto bg-card border border-border grid md:grid-cols-2 overflow-hidden">
        <div className="p-6 sm:p-8 md:p-10">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">Subicharan Tex</p>
          <h1 className="mt-2 text-4xl font-serif text-foreground">Login</h1>
          <p className="mt-2 font-sans text-sm text-muted-foreground">Access your account to continue.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block mb-2 font-sans text-xs tracking-[0.1em] uppercase text-foreground/80">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full h-11 px-3 border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.email ? <p className="mt-1 text-xs text-destructive font-sans">{errors.email}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 font-sans text-xs tracking-[0.1em] uppercase text-foreground/80">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-11 px-3 border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.password ? <p className="mt-1 text-xs text-destructive font-sans">{errors.password}</p> : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary text-primary-foreground font-sans text-xs tracking-[0.16em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Logging In...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 font-sans text-sm text-muted-foreground">
            New to Subicharan Tex?{' '}
            <Link to="/signup" className="text-primary hover:underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>

        <div className="relative hidden md:block min-h-[520px]">
          <img
            src="https://images.unsplash.com/photo-1617611413968-5370f2b849f2?auto=format&fit=crop&w=1200&q=80"
            alt="Southern Indian powerloom textile weaving"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/35" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-primary-foreground/85">Southern Weaving Craft</p>
            <p className="mt-2 font-serif text-3xl text-primary-foreground">Powered by traditional looms and modern quality.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
