import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowUpDown,
  Hash,
  Box,
  Palette,
  IndianRupee,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';
import {
  addMaterial,
  deleteMaterial,
  getMaterials,
  updateMaterial,
} from '../services/materialService';
import { cn } from '../../lib/utils';

const initialForm = {
  materialCode: '',
  yarnType: '',
  color: '',
  pricePerMeter: '',
  stock: '',
  description: '',
  image: null,
};

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('materialCode', form.materialCode);
      formData.append('yarnType', form.yarnType);
      formData.append('color', form.color);
      formData.append('pricePerMeter', Number(form.pricePerMeter));
      formData.append('stock', Number(form.stock));
      if (form.description) formData.append('description', form.description);
      if (form.image) formData.append('image', form.image);

      if (editingId) {
        await updateMaterial(editingId, formData);
      } else {
        await addMaterial(formData);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowAddForm(false);
      await loadMaterials();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item) => {
    setForm({
      materialCode: item.materialCode,
      yarnType: item.yarnType,
      color: item.color,
      pricePerMeter: item.pricePerMeter,
      stock: item.stock,
      description: item.description || '',
      image: null,
    });
    setEditingId(item._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      await deleteMaterial(id);
      await loadMaterials();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.materialCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.yarnType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-emerald-900 font-bold">Materials Catalog</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your yarn inventory and pricing.</p>
        </div>
        <button 
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setEditingId(null);
              setForm(initialForm);
            } else {
              setShowAddForm(true);
            }
          }}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm",
            showAddForm 
              ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" 
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
          )}
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? 'Cancel' : 'Add New Material'}
        </button>
      </div>

      {/* Add Material Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-lg animate-in zoom-in-95 duration-200">
          <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Layers className="text-emerald-600" size={20} />
            {editingId ? 'Edit Material Details' : 'New Material Details'}
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Code</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input className="w-full h-11 border border-zinc-200 rounded-lg pl-10 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="STX-YRN-001" value={form.materialCode} onChange={(e) => setForm((p) => ({ ...p, materialCode: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Yarn Type</label>
              <div className="relative">
                <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input className="w-full h-11 border border-zinc-200 rounded-lg pl-10 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="Combed Cotton 40s" value={form.yarnType} onChange={(e) => setForm((p) => ({ ...p, yarnType: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Color</label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input className="w-full h-11 border border-zinc-200 rounded-lg pl-10 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="Natural White" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Price / Meter</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input type="number" className="w-full h-11 border border-zinc-200 rounded-lg pl-10 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="28" value={form.pricePerMeter} onChange={(e) => setForm((p) => ({ ...p, pricePerMeter: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Stock (Meters)</label>
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input type="number" className="w-full h-11 border border-zinc-200 rounded-lg pl-10 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder="10000" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Product Image</label>
              <input type="file" accept="image/*" className="w-full h-11 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files[0] }))} />
            </div>
            <div className="flex items-end lg:col-span-3">
              <button className="w-full h-11 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-[0.98]">
                {editingId ? 'Update Material' : 'Submit Material'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Materials Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search materials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/10 outline-none transition-colors"
            />
          </div>
          <div className="text-xs text-zinc-400 font-medium">
            Showing {filteredMaterials.length} of {materials.length} items
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredMaterials.map((item) => (
                <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded text-[11px] font-mono border border-zinc-200">
                      {item.materialCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-800">{item.yarnType}</p>
                    <p className="text-xs text-zinc-500">{item.color}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-zinc-900">
                    <div className="flex items-center justify-center gap-1 w-full">
                      ₹{item.pricePerMeter}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    <div 
                      className={cn(
                        "flex items-center justify-center gap-1 w-full",
                        item.stock < 1000 ? "text-red-600" : "text-emerald-700"
                      )}
                    >
                      {item.stock.toLocaleString()} m
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Material"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Material"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && filteredMaterials.length === 0 && (
                 <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2" />
                      <p className="text-zinc-500 font-medium">Loading catalog...</p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    {searchQuery ? 'No materials match your search.' : 'Your catalog is empty. Start by adding a material above.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

