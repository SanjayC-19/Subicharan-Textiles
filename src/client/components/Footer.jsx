import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100/70 border-t border-emerald-900 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-white">
              Subicharan <span className="font-sans font-bold text-emerald-400">Tex</span>
            </h3>
            <p className="font-sans text-sm leading-relaxed max-w-sm">
              Weaving strength, quality, and tradition into every thread since 1978. A trusted powerloom mill in Tamil Nadu.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-sm tracking-wider uppercase text-emerald-400">Contact</h4>
            <ul className="space-y-3 font-sans text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>24 Mill Road, Erode, Tamil Nadu 638001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>sales@subicharantex.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-sm tracking-wider uppercase text-emerald-400">Follow Us</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center hover:bg-emerald-800 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center hover:bg-emerald-800 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center hover:bg-emerald-800 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-emerald-900/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-sans text-xs tracking-wider">
          <p>© {new Date().getFullYear()} Subicharan Tex. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
