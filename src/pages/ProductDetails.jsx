import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getAllProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, Heart, Share2, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const contentRef = useRef(null);

  useEffect(() => {
    (async () => {
      setProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const p = await getProductById(id);
      setProduct(p);
      if (p?.category) {
        const all = await getAllProducts();
        setRelated(all.filter(x => x.category === p.category && x.id !== id).slice(0, 4));
      }
    })();
  }, [id]);

  useGSAP(() => {
    if (!product) return;
    const tl = gsap.timeline({ delay: 0.1 });
    tl.from('.pd-img', { opacity: 0, scale: 1.04, duration: 1, ease: 'power3.out' })
      .from('.pd-info > *', { opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'power3.out' }, '-=0.6');
  }, { scope: contentRef, dependencies: [product?.id] });

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!product) return (
    <div className="pt-24 min-h-screen flex items-center justify-center bg-background">
      <div className="space-y-3 text-center">
        <div className="w-48 h-64 bg-muted animate-pulse mx-auto" />
        <div className="w-32 h-4 bg-muted animate-pulse mx-auto" />
        <div className="w-40 h-4 bg-muted animate-pulse mx-auto" />
      </div>
    </div>
  );

  const tabs = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'care', label: 'Care', content: 'Dry clean only. Store in a cool, dry muslin bag. Avoid direct sunlight. Press on reverse side with steam iron on low heat.' },
    { id: 'shipping', label: 'Shipping', content: 'Free shipping on orders above ₹2,000. Estimated delivery 5–7 business days. Express delivery available at checkout.' },
  ];

  return (
    <main className="pt-24 bg-background min-h-screen">
      <div ref={contentRef} className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12">
        {/* Back */}
        <Link to="/products" className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.1em] uppercase text-muted-foreground hover:text-primary mb-10 transition-colors">
          <ArrowLeft size={14} /> Back to Products
        </Link>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image */}
          <div className="pd-img aspect-[3/4] overflow-hidden bg-muted sticky top-28 self-start">
            <img
              src={product.imageURL || product.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'; }}
            />
          </div>

          {/* Info */}
          <div className="pd-info space-y-6">
            <div>
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-secondary">{product.category}</span>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground mt-2 leading-tight">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="font-serif text-3xl text-primary">₹{Number(product.price).toLocaleString('en-IN')}</span>
              {product.originalPrice && <span className="font-sans text-sm text-muted-foreground line-through">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>}
            </div>

            <div className="border-t border-border pt-6">
              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted-foreground w-20">Quantity</span>
                <div className="flex items-center border border-border">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                    <ChevronDown size={16} strokeWidth={1.5} />
                  </button>
                  <span className="w-10 text-center font-sans text-sm">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(10, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                    <ChevronUp size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 font-sans text-[12px] tracking-[0.12em] uppercase py-4 transition-all ${added ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/85'}`}
                >
                  <ShoppingBag size={15} strokeWidth={1.5} />
                  {added ? '✓ Added to Bag' : 'Add to Bag'}
                </button>
                <button className="w-12 h-12 sm:h-auto border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Heart size={17} strokeWidth={1.5} />
                </button>
                <button className="w-12 h-12 sm:h-auto border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Share2 size={17} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-border pt-6">
              <div className="flex border-b border-border mb-5">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`font-sans text-[11px] tracking-[0.15em] uppercase pb-3 mr-8 border-b-2 transition-colors ${activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {tabs.find(t => t.id === activeTab)?.content}
              </p>
            </div>

            {/* Trust */}
            <div className="bg-muted px-5 py-4 grid grid-cols-2 gap-3">
              {['Authentic Handcraft', '7-Day Returns', 'Free Shipping ₹2k+', 'Secure Checkout'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  <span className="font-sans text-[11px] tracking-[0.05em] text-muted-foreground">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-border pt-16">
            <h2 className="font-serif text-3xl text-foreground mb-10">More from {product.category}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
