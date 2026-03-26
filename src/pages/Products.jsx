import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';
import { SlidersHorizontal, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['All', 'Silk', 'Cotton', 'Sarees', 'Kids Wear'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCategory = searchParams.get('category') || 'All';
  const [category, setCategory] = useState(initCategory);
  const [sort, setSort] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    })();
  }, []);

  const filtered = products
    .filter(p => category === 'All' || p.category === category)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return 0;
    });

  const handleCategory = (cat) => {
    setCategory(cat);
    cat === 'All' ? searchParams.delete('category') : setSearchParams({ category: cat });
  };

  useGSAP(() => {
    gsap.from('.product-grid-item', {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
    });
  }, { scope: gridRef, dependencies: [filtered.length, loading] });

  return (
    <main className="pt-24 min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border pb-0">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-14">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">Our Catalog</p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground">Products</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          {/* Category pills */}
          <div className="hidden md:flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`font-sans text-[11px] tracking-[0.12em] uppercase px-4 py-2 border transition-colors ${
                  category === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent border-border text-foreground/70 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center gap-2 font-sans text-[11px] tracking-[0.1em] uppercase border border-border px-4 py-2"
            onClick={() => setFilterOpen(o => !o)}
          >
            <SlidersHorizontal size={14} /> Filter
          </button>

          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-muted-foreground hidden md:inline">{filtered.length} products</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="font-sans text-[11px] tracking-[0.05em] bg-background border border-border px-3 py-2 text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {filterOpen && (
          <div className="md:hidden mb-6 p-5 border border-border bg-muted">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase">Filter by Category</span>
              <button onClick={() => setFilterOpen(false)}><X size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => { handleCategory(cat); setFilterOpen(false); }}
                  className={`font-sans text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-colors ${category === cat ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground/70'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {filtered.map(p => (
              <div key={p.id} className="product-grid-item">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-foreground/30 mb-3">No products found.</p>
            <button onClick={() => handleCategory('All')} className="font-sans text-sm text-primary underline underline-offset-4">
              Clear filter
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
