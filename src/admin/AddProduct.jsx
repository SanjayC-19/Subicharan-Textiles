import { useState } from 'react';
import { addProduct } from '../services/productService';
import { PackagePlus, CheckCircle, AlertCircle, ImageIcon } from 'lucide-react';

const CATS = ['Silk', 'Cotton', 'Sarees', 'Kids Wear'];

export default function AddProduct() {
  const [form, setForm] = useState({ name: '', category: 'Silk', price: '', stock: '', imageURL: '', description: '' });
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: (name === 'price' || name === 'stock') ? Number(value) : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('submitting');
    try {
      if (!form.name || !form.price || !form.imageURL) throw new Error('Please fill all required fields.');
      await addProduct({ ...form, price: Number(form.price), stock: Number(form.stock), createdAt: new Date() });
      setStatus('success');
      setForm({ name: '', category: 'Silk', price: '', stock: '', imageURL: '', description: '' });
      setTimeout(() => setStatus('idle'), 3500);
    } catch (err) {
      setErrMsg(err.message || 'Failed to publish product.');
      setStatus('error');
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-muted">
      <div className="max-w-2xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 mb-10">
          <PackagePlus size={24} strokeWidth={1.5} className="text-primary" />
          <div>
            <h1 className="font-serif text-3xl text-foreground">Admin Portal</h1>
            <p className="font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground mt-0.5">Publish a new product</p>
          </div>
        </div>

        <div className="bg-background p-10">
          {status === 'success' && (
            <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/30 text-foreground px-4 py-3 mb-6 font-sans text-sm">
              <CheckCircle size={16} className="text-secondary" />
              Product published successfully!
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 mb-6 font-sans text-sm">
              <AlertCircle size={16} />
              {errMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Product Name *</label>
              <input name="name" required value={form.name} onChange={handleChange}
                className="w-full border border-border bg-background px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
                placeholder="Pure Kanchipuram Silk Bridal Saree" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Category *</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-border bg-background px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary cursor-pointer">
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Price (₹) *</label>
                <input name="price" type="number" min="0" required value={form.price} onChange={handleChange}
                  className="w-full border border-border bg-background px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
                  placeholder="15000" />
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Stock *</label>
                <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange}
                  className="w-full border border-border bg-background px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
                  placeholder="25" />
              </div>
            </div>
            <div>
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Image URL *</label>
              <div className="flex">
                <span className="border border-border border-r-0 flex items-center px-3 bg-muted">
                  <ImageIcon size={15} strokeWidth={1.5} className="text-muted-foreground" />
                </span>
                <input name="imageURL" type="url" required value={form.imageURL} onChange={handleChange}
                  className="flex-1 border border-border bg-background px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
                  placeholder="https://images.unsplash.com/..." />
              </div>
              {form.imageURL && (
                <div className="mt-3 w-20 h-28 overflow-hidden border border-border">
                  <img src={form.imageURL} alt="Preview" className="w-full h-full object-cover"
                    onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            <div>
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Description *</label>
              <textarea name="description" required rows={4} value={form.description} onChange={handleChange}
                className="w-full border border-border bg-background px-4 py-3 font-sans text-sm resize-none focus:outline-none focus:border-primary"
                placeholder="Describe the product in detail..." />
            </div>
            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={status === 'submitting'}
                className="bg-primary text-primary-foreground font-sans text-[11px] tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-primary/85 transition-colors disabled:opacity-60">
                {status === 'submitting' ? 'Publishing...' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
