import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

const heroSlides = [
  'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=1600&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&q=80',
  'https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=1600&q=80'
];

const featuredProducts = [
  {
    id: 'p1', name: 'Pure Kanchipuram Silk Bridal Saree', category: 'Silk',
    price: 24500, originalPrice: 28000,
    imageURL: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80',
  },
  {
    id: 'p2', name: 'Handwoven Chanderi Cotton Saree', category: 'Cotton',
    price: 8500,
    imageURL: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  },
  {
    id: 'p3', name: 'Banarasi Silk Lehenga Set', category: 'Silk',
    price: 35000, originalPrice: 42000,
    imageURL: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
  },
  {
    id: 'p4', name: 'Embroidered Cotton Saree', category: 'Sarees',
    price: 5200,
    imageURL: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80',
  },
];

const collections = [
  { name: 'Silk', tagline: 'Woven in light', to: '/products?category=Silk', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80' },
  { name: 'Cotton', tagline: 'Pure comfort', to: '/products?category=Cotton', img: 'https://images.unsplash.com/photo-1524228190573-1bdb578c9c29?w=800&q=80' },
  { name: 'Sarees', tagline: 'Timeless grace', to: '/products?category=Sarees', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80' },
  { name: 'Kids', tagline: 'Gentle weaves', to: '/products?category=Kids+Wear', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80' },
];

export default function Home() {
  const featuredRef = useRef(null);
  const collectionsRef = useRef(null);
  const storyRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Featured products stagger reveal
  useGSAP(() => {
    ScrollTrigger.batch('.product-reveal', {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        });
      },
      start: 'top 85%',
    });
  }, { scope: featuredRef });

  // Collections parallax images
  useGSAP(() => {
    gsap.utils.toArray('.collection-img').forEach(img => {
      gsap.to(img, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.collection-card'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
    // Reveal collection cards
    gsap.from('.collection-card', {
      opacity: 0,
      y: 60,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: collectionsRef.current,
        start: 'top 80%',
      },
    });
  }, { scope: collectionsRef });

  // Story section reveal
  useGSAP(() => {
    gsap.from('.story-text > *', {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: storyRef.current,
        start: 'top 75%',
      },
    });
    gsap.from('.story-image', {
      opacity: 0,
      scale: 1.05,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: storyRef.current,
        start: 'top 75%',
      },
    });
  }, { scope: storyRef });

  return (
    <main>
      {/* ---------------------------------------------------------------- HERO SLIDER */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-zinc-900">
        {heroSlides.map((slide, index) => (
          <div 
            key={index} 
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              currentSlide === index ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            )}
          >
            <img 
              src={slide} 
              alt={`Textile processing slide ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            {/* Subtle Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>
        ))}

        {/* Slider Controls */}
        <button 
          onClick={() => setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all z-20"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "rounded-full transition-all duration-300",
                currentSlide === idx ? "w-8 h-2 bg-emerald-500" : "w-2 h-2 bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Main Text & CTA */}
        <div className="relative z-10 text-center px-6 max-w-5xl mt-12 flex flex-col items-center">
          <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-white leading-[1.15] mb-10 drop-shadow-2xl tracking-tight">
            Weaving strength, quality, and tradition into every thread.
          </h1>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center min-w-[200px] bg-emerald-600 text-white font-sans text-xs md:text-sm font-bold tracking-[0.15em] uppercase px-10 py-5 hover:bg-emerald-500 transition-all hover:-translate-y-1 shadow-xl hover:shadow-emerald-600/30 rounded-sm"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- COLLECTIONS */}
      <section ref={collectionsRef} className="bg-muted py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-emerald-800 mb-3 font-bold">Curated for You</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">Shop by Collection</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {collections.map(col => (
              <Link key={col.name} to={col.to} className="collection-card group relative overflow-hidden aspect-[2/3] block">
                <img
                  src={col.img}
                  alt={col.name}
                  className="collection-img absolute inset-0 w-full h-[115%] object-cover -top-[7.5%] transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="block font-sans text-[9px] tracking-[0.3em] uppercase text-emerald-400 mb-1">{col.tagline}</span>
                  <h3 className="font-serif text-2xl text-white font-light">{col.name}</h3>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase bg-emerald-600 text-white px-4 py-2">Explore</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- FEATURED PRODUCTS */}
      <section ref={featuredRef} className="bg-background py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-emerald-800 mb-3 font-bold">Handpicked for You</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Featured Weaves</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.08em] uppercase text-foreground border-b border-foreground/30 pb-0.5 hover:text-emerald-600 hover:border-emerald-600 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {featuredProducts.map(p => (
              <div key={p.id} className="product-reveal">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- STORY STRIP */}
      <section ref={storyRef} className="bg-zinc-900 py-24 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-emerald-950/20 pointer-events-none" />
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="story-image relative aspect-[4/5] overflow-hidden order-last lg:order-first">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
              alt="Master weaver at work"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply" />
          </div>
          {/* Text */}
          <div className="story-text">
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-emerald-400 font-bold mb-4">Our Legacy</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
              Threads that carry a thousand stories.
            </h2>
            <p className="font-sans text-sm text-zinc-300 leading-relaxed mb-5 text-balance">
              Loyal Textile Mills began with a vision to weave excellence in every fiber. Today, our family of artisans continues the same tradition — combining state-of-the-art machinery with the irreplaceable warmth of human hands.
            </p>
            <p className="font-sans text-sm text-zinc-300 leading-relaxed mb-10 text-balance">
              Every yard of fabric that leaves our workshop carries with it the mark of an artisan's devotion, creating more jobs everyday while preserving our rich textile heritage.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.12em] uppercase text-emerald-400 border-b border-emerald-400/40 pb-0.5 hover:border-emerald-400 transition-colors"
            >
              Read Our Story <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- NEWSLETTER */}
      <section className="bg-emerald-50 py-20 border-y border-emerald-100">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-emerald-800 font-bold mb-3">Exclusive Access</p>
          <h2 className="font-serif text-3xl md:text-4xl text-emerald-950 mb-4">
            Join the circle of discerning weavers.
          </h2>
          <p className="font-sans text-sm text-emerald-800/80 mb-8">Get early access to new collections, artisan stories, and seasonal offers.</p>
          <form className="flex gap-0 max-w-sm mx-auto shadow-sm" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white border border-emerald-200 border-r-0 px-4 py-3 font-sans text-sm text-emerald-900 placeholder:text-emerald-300 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-700 text-white font-sans text-[11px] tracking-[0.15em] uppercase px-6 hover:bg-emerald-600 transition-colors shrink-0 font-bold"
            >
              Join
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
