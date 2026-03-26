import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, UserCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';


const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/#contact', scrollTo: 'contact' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(isAdmin ? '/admin/dashboard' : '/profile');
  };

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Handle scroll to change navbar appearance
  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
      setScrolled(scrollPos > 40);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true }); // Fallback for body scrolling
    
    // Check initial state in case page is loaded already scrolled
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
    };
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

        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center h-16 justify-between w-full">

          <div className="flex items-center gap-4 z-20">
            {/* Back Button (Only show on non-home pages) */}
            {location.pathname !== '/' && (
              <button 
                onClick={() => navigate(-1)}
                className={cn(
                  "flex items-center justify-center p-2 rounded-full transition-all duration-200",
                  scrolled ? "hover:bg-zinc-100 text-zinc-600" : "hover:bg-white/20 text-white"
                )}
                aria-label="Go Back"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center justify-center"
            >
            <span className={cn(
              "font-serif tracking-tight text-2xl font-bold leading-none transition-colors",
              scrolled ? "text-emerald-900 group-hover:text-emerald-700" : "text-white group-hover:text-emerald-100"
            )}>
              Subicharan<span className={cn("font-sans font-black ml-1 text-2xl", scrolled ? "text-emerald-600" : "text-emerald-400")}>TEX</span>
            </span>
          </Link>          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 ml-auto mr-6">
            {navLinks.map(link => (
              link.scrollTo ? (
                <button
                  key={link.label}
                  type="button"
                  className={cn(
                    'font-sans text-[13px] font-bold tracking-[0.05em] uppercase transition-all duration-300 relative group bg-transparent border-none outline-none cursor-pointer',
                    scrolled ? 'text-emerald-900 hover:text-emerald-600' : 'text-white hover:text-emerald-300'
                  )}
                  onClick={() => {
                    if (location.pathname === '/') {
                      const el = document.getElementById(link.scrollTo);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      navigate('/');
                      setTimeout(() => {
                        const scroll = () => {
                          const el = document.getElementById(link.scrollTo);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                            window.removeEventListener('popstate', scroll);
                          } else {
                            setTimeout(scroll, 100);
                          }
                        };
                        window.addEventListener('popstate', scroll);
                        scroll();
                      }, 300);
                    }
                  }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    'font-sans text-[13px] font-bold tracking-[0.05em] uppercase transition-all duration-300 relative group',
                    scrolled ? 'text-emerald-900 hover:text-emerald-600' : 'text-white hover:text-emerald-300'
                  )}
                >
                  {link.label}
                </Link>
              )
            ))}
            {isLoggedIn && !isAdmin && (
              <button
                type="button"
                className={cn(
                  'font-sans text-[13px] font-bold tracking-[0.05em] uppercase transition-all duration-300 relative group bg-transparent border-none outline-none cursor-pointer',
                  scrolled ? 'text-emerald-900 hover:text-emerald-600' : 'text-white hover:text-emerald-300'
                )}
                onClick={() => {
                  if (location.pathname === '/orders') {
                    const el = document.getElementById('orders');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    navigate('/orders');
                    setTimeout(() => {
                      const scroll = () => {
                        const el = document.getElementById('orders');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                          window.removeEventListener('popstate', scroll);
                        } else {
                          setTimeout(scroll, 100);
                        }
                      };
                      window.addEventListener('popstate', scroll);
                      scroll();
                    }, 300);
                  }
                }}
              >
                My Orders
              </button>
            )}
            {isLoggedIn && isAdmin && (
              <Link
                to="/admin/dashboard"
                className={cn(
                  'font-sans text-[13px] font-bold tracking-[0.05em] uppercase transition-all duration-300 relative group',
                  scrolled ? 'text-indigo-900 hover:text-indigo-600' : 'text-indigo-200 hover:text-white'
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <Link 
                to="/login" 
                className={cn(
                  "hidden lg:inline-flex px-4 py-2 border text-xs font-bold uppercase transition-all tracking-wider rounded-sm",
                  scrolled 
                    ? "border-emerald-700 text-emerald-800 hover:bg-emerald-50" 
                    : "border-white/80 text-white hover:bg-white/10"
                )}
              >
                Login
              </Link>
            ) : null}

            <button
              type="button"
              onClick={handleProfileClick}
              className={cn(
                "h-10 w-10 rounded-full border flex items-center justify-center transition-colors",
                scrolled 
                  ? "border-emerald-700 text-emerald-800 hover:bg-emerald-50" 
                  : "border-white/80 text-white hover:bg-white/10"
              )}
              aria-label="Profile"
            >
              <UserCircle size={22} />
            </button>

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
              link.scrollTo ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (location.pathname === '/') {
                      const el = document.getElementById(link.scrollTo);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      navigate('/');
                      setTimeout(() => {
                        const scroll = () => {
                          const el = document.getElementById(link.scrollTo);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                            window.removeEventListener('popstate', scroll);
                          } else {
                            setTimeout(scroll, 100);
                          }
                        };
                        window.addEventListener('popstate', scroll);
                        scroll();
                      }, 300);
                    }
                  }}
                  className="block py-4 font-sans text-lg font-bold tracking-wider uppercase border-b border-emerald-100 text-emerald-900 hover:text-emerald-600 hover:pl-2 transition-all bg-transparent border-none outline-none cursor-pointer"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 font-sans text-lg font-bold tracking-wider uppercase border-b border-emerald-100 text-emerald-900 hover:text-emerald-600 hover:pl-2 transition-all"
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {isLoggedIn && !isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  if (location.pathname === '/orders') {
                    const el = document.getElementById('orders');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    navigate('/orders');
                    setTimeout(() => {
                      const scroll = () => {
                        const el = document.getElementById('orders');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                          window.removeEventListener('popstate', scroll);
                        } else {
                          setTimeout(scroll, 100);
                        }
                      };
                      window.addEventListener('popstate', scroll);
                      scroll();
                    }, 300);
                  }
                }}
                className="block py-4 font-sans text-lg font-bold tracking-wider uppercase border-b border-emerald-100 text-emerald-900 hover:text-emerald-600 hover:pl-2 transition-all bg-transparent border-none outline-none cursor-pointer"
              >
                My Orders
              </button>
            )}

            {isLoggedIn && isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block py-4 font-sans text-lg font-bold tracking-wider uppercase border-b border-indigo-100 text-indigo-900 hover:text-indigo-600 hover:pl-2 transition-all"
              >
                Dashboard
              </Link>
            )}

            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-4 font-sans text-lg font-bold tracking-wider uppercase border-b border-emerald-100 text-emerald-900 hover:text-emerald-600 hover:pl-2 transition-all"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
