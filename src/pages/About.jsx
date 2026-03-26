import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const values = [
  { label: 'Craftsmanship', desc: 'Every weave is a masterpiece, each thread placed with intention and care.', num: '01' },
  { label: 'Heritage', desc: 'Patterns passed down across four generations of dedicated artisans.', num: '02' },
  { label: 'Sustainability', desc: 'Natural dyes and responsible sourcing. We honour both the earth and its people.', num: '03' },
  { label: 'Community', desc: 'Rooted in the weaving communities of Kanchipuram, we uplift through craft.', num: '04' },
];

const stats = [
  { value: '45+', label: 'Years of Craft' },
  { value: '3', label: 'Generations' },
  { value: '1200+', label: 'Families Served' },
  { value: '30+', label: 'Weave Patterns' },
];

export default function About() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from('.about-eyebrow', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .from('.about-title', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from('.about-sub', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6')
      .from('.about-hero-img', { scale: 1.06, opacity: 0, duration: 1.4, ease: 'power3.out' }, '-=0.8');
  }, { scope: heroRef });

  useGSAP(() => {
    gsap.from('.stat-item', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
    });
  }, { scope: statsRef });

  useGSAP(() => {
    gsap.from('.value-item', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: valuesRef.current, start: 'top 80%' },
    });
  }, { scope: valuesRef });

  useGSAP(() => {
    gsap.from('.team-reveal', {
      opacity: 0,
      y: 50,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: teamRef.current, start: 'top 80%' },
    });
  }, { scope: teamRef });

  return (
    <main className="pt-24">
      {/* HERO */}
      <section ref={heroRef} className="bg-background pb-0 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="about-eyebrow font-sans text-[10px] tracking-[0.35em] uppercase text-secondary mb-5">Est. 1978</p>
            <h1 className="about-title font-serif text-5xl md:text-6xl xl:text-7xl text-foreground leading-[0.92] mb-8">
              Woven in the<br /><em>heart of</em><br />Kanchipuram.
            </h1>
            <p className="about-sub font-sans text-base text-muted-foreground leading-relaxed max-w-sm">
              Subicharan Tex is a family heritage brand rooted in the ancient craft of silk and cotton weaving, carrying forward a tradition of excellence that spans nearly five decades.
            </p>
          </div>
          <div className="about-hero-img relative aspect-[4/3] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80"
              alt="Master weaver at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Decorative marker */}
        <div className="border-t border-border/50" />
      </section>

      {/* STATS */}
      <section ref={statsRef} className="bg-primary py-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-primary-foreground/10">
          {stats.map(s => (
            <div key={s.label} className="stat-item bg-primary p-10 text-center">
              <span className="font-serif text-5xl text-primary-foreground font-light block">{s.value}</span>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-primary-foreground/50 mt-2 block">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="bg-background py-28">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-20 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-secondary mb-4">Our Origins</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-6">
              A story of devotion, thread by thread.
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
              In 1978, Murugesan Subicharan began weaving in a modest loom room in the heart of Kanchipuram with nothing but a traditional pit loom and an unwavering belief in the beauty of Kanjivaram silk.
            </p>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
              What started as one man's craft soon grew into a family tradition. His children learned the patterns, the rhythms of the shuttle, the intricacy of zari work. Today, his grandchildren carry that same passion — blending ancestral technique with contemporary sensibility.
            </p>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              We believe that a true textile tells a story — of the land it comes from, the hands that made it, and the woman who wears it.
            </p>
          </div>
          <div className="space-y-6">
            <div className="aspect-[4/5] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1524228190573-1bdb578c9c29?w=700&q=80" alt="Heritage weaving" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden">
                <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80" alt="Silk saree closeup" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center p-6">
                <p className="font-serif text-xl text-muted-foreground italic text-center leading-relaxed">"Every thread a whisper of eternity."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section ref={valuesRef} className="bg-muted py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">What We Stand For</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">Our Principles</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {values.map(v => (
              <div key={v.label} className="value-item bg-muted p-8 lg:p-10 hover:bg-background transition-colors duration-300">
                <span className="font-serif text-5xl text-primary/20 font-light block mb-6">{v.num}</span>
                <h3 className="font-serif text-xl text-foreground mb-3">{v.label}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground py-20 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-5">Ready to find your perfect weave?</h2>
          <p className="font-sans text-sm text-primary-foreground/60 mb-8">Explore our curated collection of timeless textiles, crafted just for you.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-sans text-[12px] tracking-[0.12em] uppercase px-8 py-4 hover:bg-secondary/80 transition-colors">
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
