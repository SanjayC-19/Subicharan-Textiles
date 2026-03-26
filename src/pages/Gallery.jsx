import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', spanRow: true, alt: 'Kanchipuram Silk' },
  { src: 'https://images.unsplash.com/photo-1524228190573-1bdb578c9c29?w=600&q=80', alt: 'Cotton Weave' },
  { src: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80', alt: 'Saree Collection' },
  { src: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80', alt: 'Banarasi Set' },
  { src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80', spanRow: true, alt: 'Weaving Heritage' },
  { src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', alt: 'Traditional Work' },
  { src: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80', alt: 'Kids Wear' },
  { src: 'https://images.unsplash.com/photo-1464374288807-174778f4e0b8?w=800&q=80', alt: 'Festive Drape' },
  { src: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80', alt: 'Detail Work' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    ScrollTrigger.batch('.gallery-item', {
      onEnter: (els) => gsap.from(els, { opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power3.out' }),
      start: 'top 88%',
    });
  }, { scope: gridRef });

  return (
    <main className="pt-24 min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-14">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">Through the Lens</p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground">Gallery</h1>
        </div>
      </div>

      {/* Masonry Grid */}
      <div ref={gridRef} className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px] md:auto-rows-[260px]">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setLightbox(img)}
              className={`gallery-item overflow-hidden cursor-pointer group ${img.spanRow ? 'row-span-2' : ''}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/25 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-primary-foreground hover:text-secondary transition-colors" aria-label="Close">
            <X size={28} strokeWidth={1.5} />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
          />
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-sans text-[11px] tracking-[0.2em] uppercase text-primary-foreground/50">
            {lightbox.alt}
          </p>
        </div>
      )}
    </main>
  );
}
