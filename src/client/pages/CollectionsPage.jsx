import { useEffect, useState, useRef } from 'react';
import { Search, ArrowDownUp } from 'lucide-react';
import MaterialCard from '../components/MaterialCard';
import { getMaterials } from '../services/materialService';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CollectionsPage() {
  const containerRef = useRef(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when collections page mounts
    const load = async () => {
      try {
        const data = await getMaterials();
        if (Array.isArray(data)) {
          setMaterials(data);
        } else {
          setMaterials([]);
        }
      } catch {
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useGSAP(() => {
    if (!loading && materials.length > 0) {
      ScrollTrigger.batch('.material-card-wrapper', {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' }),
        start: 'top 85%'
      });
      gsap.set('.material-card-wrapper', { y: 50, opacity: 0 });
    }
  }, { scope: containerRef, dependencies: [loading, materials.length] });

  const filteredAndSortedMaterials = materials
    .filter(m =>
      (selectedType === 'All' || m.yarnType === selectedType) &&
      (m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (m.materialCode && m.materialCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
       (m.color && m.color.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerMeter - b.pricePerMeter;
      if (sortBy === 'price-high') return b.pricePerMeter - a.pricePerMeter;
      if (sortBy === 'name-asc') return (a.description || '').localeCompare(b.description || '');
      if (sortBy === 'name-desc') return (b.description || '').localeCompare(a.description || '');
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });

  return (
    <div ref={containerRef} className="bg-zinc-50 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 w-full pt-10">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">All Collections</h1>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Browse our complete inventory of premium yarns and fabrics. Explore different qualities, patterns, and colors tailored for all your requirements.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products by name, type or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative min-w-[200px]">
              <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>        
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredAndSortedMaterials.length === 0 ? (
          <div className="text-center py-32 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <p className="text-zinc-500 font-medium text-lg">No products match your current filters.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedType('All'); setSortBy('newest');}}
              className="mt-6 px-8 py-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors font-medium shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMaterials.map((material) => (
              <div key={material._id} className="material-card-wrapper">
                <MaterialCard material={material} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
