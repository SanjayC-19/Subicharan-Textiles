import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Top decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

      {/* Main footer grid */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <Link to="/" className="block mb-5">
            <span className="font-serif text-3xl font-semibold tracking-wide text-primary-foreground">
              Subicharan
            </span>
            <span className="block font-sans text-[10px] tracking-[0.3em] uppercase text-secondary mt-0.5">
              Heritage Textiles
            </span>
          </Link>
          <p className="font-sans text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
            Three generations of artisanal textile craftsmanship, weaving stories of heritage and beauty into every thread since 1978.
          </p>
          {/* Social icons */}
          <div className="flex gap-4 mt-8">
            {[
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Twitter, href: '#', label: 'Twitter' },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/60 hover:text-secondary hover:border-secondary transition-colors">
                <Icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-sans text-[10px] tracking-[0.25em] uppercase text-secondary mb-6">Navigate</h4>
          <ul className="space-y-3">
            {[
              { label: 'Home', to: '/' },
              { label: 'About Us', to: '/about' },
              { label: 'Products', to: '/products' },
              { label: 'Gallery', to: '/gallery' },
              { label: 'Contact', to: '/contact' },
            ].map(link => (
              <li key={link.label}>
                <Link to={link.to}
                  className="font-sans text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-sans text-[10px] tracking-[0.25em] uppercase text-secondary mb-6">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-primary-foreground/60">
              <MapPin size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-secondary/70" />
              <span className="leading-relaxed">12, Weavers Lane, Kanchipuram, Tamil Nadu — 631501</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-primary-foreground/60">
              <Phone size={15} strokeWidth={1.5} className="shrink-0 text-secondary/70" />
              <a href="tel:+919876543210" className="hover:text-secondary transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-center gap-3 text-sm text-primary-foreground/60">
              <Mail size={15} strokeWidth={1.5} className="shrink-0 text-secondary/70" />
              <a href="mailto:weave@subicharan.in" className="hover:text-secondary transition-colors">weave@subicharan.in</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10 max-w-screen-xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-sans text-xs text-primary-foreground/40 tracking-wide">
          © {year} Subicharan Tex. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Use', 'Shipping Policy'].map(item => (
            <Link key={item} to="#" className="font-sans text-xs text-primary-foreground/40 hover:text-secondary transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
