import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { getCartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const cartCount = getCartCount();

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Handle scroll to change navbar appearance
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-0' : 'bg-transparent py-0'
        )}
      >
        {/* Main Navbar Bar - subtle background when not scrolled to ensure text readability */}
        <div className={cn(
          "absolute inset-0 -z-10 transition-colors duration-300",
          !scrolled && "bg-gradient-to-b from-black/50 to-transparent"
        )} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-stretch h-20 md:h-24 justify-between">
          
          {/* Logo Tab */}
          <Link
            to="/"
            className="group relative flex items-center justify-center px-6 md:px-10 h-full bg-white transition-all duration-300 shadow-sm z-20"
            style={{ 
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px', 
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
            }}
          >
            {/* The white tab that extends downwards */}
            <div className="absolute inset-0 bg-white shadow-xl translate-y-0 pb-4 h-[115%] rounded-b-xl -z-10 transition-transform origin-top" />
            <div className="flex flex-col items-center">
              <span className="font-sans font-black tracking-tight text-3xl md:text-4xl text-emerald-800 leading-none group-hover:text-emerald-600 transition-colors">
                LOYAL
              </span>
              <span className="font-sans text-[8px] md:text-[10px] tracking-widest uppercase text-emerald-600 font-bold mt-1">
                Textile Mills Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10 ml-auto mr-8">
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'font-sans text-[14px] font-bold tracking-[0.05em] uppercase transition-all duration-300 relative group',
                    // If scrolled, use green. If not scrolled, use white to contrast with backgrounds.
                    scrolled ? (isActive ? 'text-emerald-600' : 'text-emerald-900 hover:text-emerald-600') 
                             : (isActive ? 'text-emerald-400' : 'text-white hover:text-emerald-300')
                  )
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className={cn(
                "relative p-2 transition-colors",
                scrolled ? "text-emerald-800 hover:text-emerald-500" : "text-white hover:text-emerald-300"
              )}
            >
              <ShoppingBag size={24} strokeWidth={2} />
              {cartCount >= 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none shadow-md border-2 border-transparent">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              className={cn(
                "lg:hidden p-2 transition-colors",
                scrolled ? "text-emerald-800" : "text-white"
              )}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={26} strokeWidth={2} className={scrolled ? "text-emerald-800" : "text-white"} /> : <Menu size={26} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={cn(
        'fixed inset-0 z-40 lg:hidden transition-all duration-500',
        mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}>
        {/* Overlay */}
        <div
          className={cn('absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500', mobileOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div className={cn(
          'absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl flex flex-col pt-28 px-8 pb-10 transition-transform duration-500 ease-out',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          {/* Close Button Inside Drawer */}
          <button 
            className="absolute top-8 right-8 text-emerald-900 hover:text-emerald-600 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X size={28} strokeWidth={2} />
          </button>
          
          <nav className="flex flex-col gap-2 mt-8">
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'block py-4 font-sans text-lg font-bold tracking-wider uppercase border-b border-emerald-100 transition-colors',
                    isActive ? 'text-emerald-600' : 'text-emerald-900 hover:text-emerald-600 hover:pl-2'
                  )
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

