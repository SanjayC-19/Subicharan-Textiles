import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { submitContactMessage } from '../services/productService';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const info = [
    { icon: MapPin, text: '12, Weavers Lane, Kanchipuram, Tamil Nadu — 631501' },
    { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: Mail, text: 'weave@subicharan.in', href: 'mailto:weave@subicharan.in' },
    { icon: Clock, text: 'Mon–Sat / 9 AM – 7 PM IST' },
  ];

  return (
    <main className="pt-24 min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-14">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">Get in Touch</p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-5 gap-16">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-secondary mb-5">Visit Our Showroom</p>
            <div className="space-y-5">
              {info.map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-start gap-4">
                  <div className="w-8 h-8 border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} strokeWidth={1.5} className="text-secondary" />
                  </div>
                  {href
                    ? <a href={href} className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors leading-relaxed">{text}</a>
                    : <span className="font-sans text-sm text-muted-foreground leading-relaxed">{text}</span>
                  }
                </div>
              ))}
            </div>
          </div>
          {/* Decorative block */}
          <div className="bg-muted p-8 border-l-2 border-secondary">
            <p className="font-serif text-lg text-foreground italic leading-relaxed">
              "We are weavers of cloth and of a bond with every customer who chooses to wear our heritage."
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          {status === 'success' ? (
            <div className="border border-secondary/30 bg-secondary/10 p-8 text-center">
              <p className="font-serif text-2xl text-foreground mb-2">Message Received</p>
              <p className="font-sans text-sm text-muted-foreground">We will get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { name: 'name', label: 'Full Name', type: 'text', required: true },
                  { name: 'email', label: 'Email Address', type: 'email', required: true },
                ].map(f => (
                  <div key={f.name}>
                    <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">{f.label} {f.required && '*'}</label>
                    <input
                      name={f.name}
                      type={f.type}
                      required={f.required}
                      value={form[f.name]}
                      onChange={handleChange}
                      className="w-full bg-background border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/50"
                      placeholder={f.label}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">Subject</label>
                <input
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-background border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground/50"
                  placeholder="Custom order, wholesale inquiry, etc."
                />
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-background border border-border px-4 py-3 font-sans text-sm resize-none focus:outline-none focus:border-primary placeholder:text-muted-foreground/50"
                  placeholder="Tell us how we can help..."
                />
              </div>
              {status === 'error' && (
                <p className="font-sans text-sm text-destructive">Something went wrong. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-primary text-primary-foreground font-sans text-[11px] tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary/85 transition-colors disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
