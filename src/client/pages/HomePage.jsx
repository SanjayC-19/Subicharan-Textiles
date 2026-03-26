import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Leaf, 
  Droplets,
  Wind,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingUp,
  Truck,
  RotateCcw
} from 'lucide-react';
import MaterialCard from '../components/MaterialCard';
import { getMaterials } from '../services/materialService';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Refs for animations
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroImageRef = useRef(null);
  const featuresRef = useRef(null);
  const collectionsRef = useRef(null);
  const processRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await getMaterials();
        if (data) {
          setMaterials(data);
        } else {
          setMaterials([]);
        }
      } catch (err) {
        console.error('Failed to fetch materials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  // GSAP Animations
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Animation
      const tl = gsap.timeline();
      
      tl.fromTo(heroContentRef.current.children,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power3.out" 
        }
      ).fromTo(heroImageRef.current,
        { scale: 0.8, opacity: 0, rotation:-5 },
        { 
          scale: 1, 
          opacity: 1, 
          rotation: 0,
          duration: 1.5, 
          ease: "elastic.out(1, 0.5)" 
        }, 
        "-=0.8"
      );

      // Features Parallax
      gsap.fromTo(".feature-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Process Steps
      const steps = gsap.utils.toArray('.process-step');
      steps.forEach((step, i) => {
        gsap.fromTo(step,
          { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      title: "Sustainable Sources",
      description: "Ethically harvested materials from certified eco-friendly producers."
    },
    {
      icon: <Wind className="w-8 h-8 text-blue-500" />,
      title: "Breathable Comfort",
      description: "Advanced weaves allowing maximum airflow for everyday comfort."
    },
    {
      icon: <Droplets className="w-8 h-8 text-cyan-500" />,
      title: "Color Fastness",
      description: "Premium reactive dyes ensuring colors stay vibrant wash after wash."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-purple-500" />,
      title: "Quality Assured",
      description: "Rigorous 10-point quality check on every fabric roll."
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Sourcing",
      description: "We handpick the finest raw materials from trusted global partners."
    },
    {
      number: "02",
      title: "Spinning & Weaving",
      description: "State-of-the-art machinery transforms raw fibers into premium yarn and fabrics."
    },
    {
      number: "03",
      title: "Dyeing & Finishing",
      description: "Eco-friendly dyeing processes ensuring vibrant, long-lasting colors."
    },
    {
      number: "04",
      title: "Quality Control",
      description: "Every meter is inspected for flaws before reaching our inventory."
    }
  ];

  const testimonials = [
    {
      name: "Geetika Menon",
      role: "Fashion Designer",
      content: "The silk blends from Subicharan are unmatched. They drape beautifully and have a luxurious feel that my clients absolutely love.",
      rating: 5
    },
    {
      name: "Rohith V",
      role: "Boutique Owner",
      content: "Consistent quality and vibrant colors. Finding reliable textile suppliers is hard, but Subicharan delivers excellence every time.",
      rating: 5
    },
    {
      name: "Anita Desai",
      role: "Textile Artist",
      content: "Their organic cotton range is a dream to work with. Perfect tension, great dye absorption, and truly sustainably sourced.",
      rating: 5
    }
  ];

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gray-50" ref={containerRef}>
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      >
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            style={{ y, opacity }}
            className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-3xl"
          />
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-30%']) }}
            className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-100/40 to-teal-100/40 blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content */}
            <div ref={heroContentRef} className="max-w-2xl">
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Weave Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Imagination
                </span><br/>
                Into Reality
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                Discover our curated collection of premium textiles. From diaphanous silks to robust organic cottons, find the perfect fabric for your next masterpiece.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/collections"
                  className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-gray-900/20 hover:shadow-indigo-600/20 flex items-center gap-2 group transform hover:-translate-y-1"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Explore Collections
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a
                  href="#popular"
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl font-medium ring-1 ring-gray-200 hover:ring-indigo-300 hover:bg-indigo-50 transition-all duration-300 flex items-center gap-2"
                >
                  Trending Now
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-8 border-t border-gray-200 pt-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">5k+</div>
                  <div className="text-sm text-gray-500 font-medium">Premium Fabrics</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">10k+</div>
                  <div className="text-sm text-gray-500 font-medium">Happy Clients</div>
                </div>
                <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">4.9/5 Average Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div ref={heroImageRef} className="relative hidden lg:block h-[600px] w-full preserve-3d">
              {/* Decorative elements behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 group">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="/images/Pink%20&%20White%20Dual%20Tone%20Premium%20Cotton%20Linen%20Fabric.png"
                  alt="Pink & White Dual Tone Premium Cotton Linen Fabric"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute top-6 right-6 z-20 -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                  <div className="bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/10 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium text-white">New Arrivals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose Our Textiles?</h2>
            <p className="text-lg text-gray-600">We combine traditional craftsmanship with modern technology to deliver fabrics that exceed expectations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-gray-700 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Select Products Gallery (Instead of full catalog & filters) */}
      <section id="popular" ref={collectionsRef} className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-3">
                <TrendingUp className="w-5 h-5" />
                <span>Popular Now</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">Featured Fabrics</h2>
            </div>
            
            <Link 
              to="/collections"
              className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-indigo-600 transition-colors group"
            >
              View All Collections
              <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
          ) : (
            <>
              {materials.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Featured Products</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">Check back soon for our latest arrivals.</p>
                  <Link
                    to="/collections"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Show only top 8 products on home page */}
                  {materials.slice(0, 8).map((material, idx) => (
                    <motion.div
                      key={material._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <MaterialCard material={material} />
                    </motion.div>
                  ))}
                </div>
              )}
              
              {materials.length > 0 && (
                <div className="mt-16 text-center">
                  <Link
                    to="/collections"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                  >
                    Discover More
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* The Process */}
      <section ref={processRef} className="py-24 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">How It's Made</h2>
            <p className="text-xl text-gray-400">The journey of our fabrics from raw fiber to finished masterpiece.</p>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 hidden lg:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
              {processSteps.map((step, idx) => (
                <div key={idx} className="process-step relative">
                  <div className="bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-400 font-bold text-xl mb-6 relative z-10 border border-gray-700 mx-auto lg:mx-0">
                    {step.number}
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section id="contact" className="py-24 bg-zinc-900 text-zinc-100 flex items-center relative overflow-hidden">
        {/* Abstract background shape */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[150%] rounded-full border-[1px] border-emerald-400/30"></div>
          <div className="absolute -top-[40%] -right-[5%] w-[60%] h-[130%] rounded-full border-[1px] border-emerald-400/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-emerald-500 font-bold tracking-[0.2em] text-xs uppercase block">Get in touch</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white">Visit Our Mill</h2>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                For detailed quotes, custom dyeing ranges, or bulk yarn requirements, connect with our sales office directly. Experience the quality firsthand.
              </p>

              <div className="pt-8 space-y-6">
                <div className="group flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Location</h4>
                    <p className="text-zinc-400">24 Mill Road, Erode, Tamil Nadu 638001</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Call Us</h4>
                    <p className="text-zinc-400">+91 98765 43210</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-zinc-400">sales@subicharantex.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full">
              <div className="w-full h-80 lg:h-[500px] overflow-hidden border border-white/10 rounded-xl relative group">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15632.61057404364!2d77.713898!3d11.341398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f46762f4671%3A0xd97da6e3cb9a941a!2sErode%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                  title="Subicharan Tex Location"
                ></iframe>
                <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it.</p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute top-0 right-0 text-9xl text-indigo-50/50 font-serif leading-none -z-10 select-none">"</div>
            
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100"
                >
                  <div className="flex items-center gap-1 mb-6">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-2xl md:text-3xl text-gray-900 font-medium leading-relaxed mb-8">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {testimonials[activeTestimonial].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-gray-500">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeTestimonial ? 'bg-indigo-600 w-8' : 'bg-gray-300 hover:bg-indigo-400'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to Create Something Beautiful?</h2>
          <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join our newsletter to receive updates on new collections, exclusive offers, and textile inspiration.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg"
              required
            />
            <button 
              type="submit"
              className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-sm text-indigo-200">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
};

// SVG Icon Component (inline since it's just one)
const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default HomePage;
