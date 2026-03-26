import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const collections = [
  {
    name: 'Silk',
    tagline: 'Luxury Woven in Every Thread',
    desc: 'Our Kanchipuram silk sarees are crafted using pure mulberry silk and authentic zari. The intricate patterns — peacocks, temple borders, checks — reflect centuries of Tamil artistry.',
    to: '/products?category=Silk',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80',
    highlight: 'Zari borders sourced from Surat, India',
  },
  {
    name: 'Cotton',
    tagline: 'Natural Comfort, Timeless Style',
    desc: 'Lightweight, breathable, and utterly versatile. Our cotton weaves are perfect for daily elegance — from soft Chanderi to durable Chettinad checks and vibrant handloom prints.',
    to: '/products?category=Cotton',
    img: 'https://images.unsplash.com/photo-1524228190573-1bdb578c9c29?w=900&q=80',
    highlight: 'GOTS-certified organic cotton options available',
  },
  {
    name: 'Sarees',
    tagline: 'Grace That Transcends Time',
    desc: 'The saree is India\'s oldest garment and most beautiful. Our curated collection spans Banarasi, Chanderi, Coimbatore, and Kanjivaram styles — each with its own character.',
    to: '/products?category=Sarees',
    img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=900&q=80',
    highlight: 'All draping styles and blouse dimensions accommodated',
  },
  {
    name: 'Kids Wear',
    tagline: 'Heritage Scaled for Little Ones',
    desc: 'Delicate, soft, yet rich in artisan character — our kids\' wear range brings the beauty of traditional textiles to the smallest members of your family, for every festive occasion.',
    to: '/products?category=Kids+Wear',
    img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=900&q=80',
    highlight: 'Hypoallergenic materials. Safe for sensitive skin.',
  },
];

export default function Collections() {
  const sectionRefs = useRef([]);

  useGSAP(() => {
    sectionRefs.current.forEach((el) => {
      if (!el) return;
      gsap.from(el.querySelectorAll('.reveal-item'), {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
        },
      });
      const img = el.querySelector('.col-img');
      if (img) {
        gsap.from(img, {
          scale: 1.08,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
      }
    });
  }, []);

  return (
    <main className="pt-24 bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-14">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">Curated Categories</p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground">Collections</h1>
        </div>
      </div>

      {/* Collection blocks */}
      {collections.map((col, i) => (
        <section
          key={col.name}
          ref={el => sectionRefs.current[i] = el}
          className={`py-20 ${i % 2 === 0 ? 'bg-background' : 'bg-muted'}`}
        >
          <div className={`max-w-screen-xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center ${i % 2 !== 0 ? 'lg:[&>*:first-child]:order-last' : ''}`}>
            {/* Image */}
            <div className="col-img overflow-hidden aspect-[4/3]">
              <img src={col.img} alt={col.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            {/* Text */}
            <div>
              <p className="reveal-item font-sans text-[10px] tracking-[0.35em] uppercase text-secondary mb-4">{col.tagline}</p>
              <h2 className="reveal-item font-serif text-4xl md:text-5xl text-foreground leading-tight mb-5">{col.name}</h2>
              <p className="reveal-item font-sans text-sm text-muted-foreground leading-relaxed mb-6">{col.desc}</p>
              <div className="reveal-item border-l-2 border-secondary pl-4 mb-8">
                <p className="font-sans text-xs text-muted-foreground italic">{col.highlight}</p>
              </div>
              <Link to={col.to} className="reveal-item inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans text-[11px] tracking-[0.15em] uppercase px-7 py-3.5 hover:bg-primary/85 transition-colors">
                Shop {col.name} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
