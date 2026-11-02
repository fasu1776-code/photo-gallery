import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { UploadCloud, Trash2, Link as LinkIcon, Image as ImageIcon, Shield, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Nature');
  const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadPhotos = async () => {
    try {
      const res = await API.get('/photos');
      setPhotos(res.data.photos || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    if (uploadType === 'file' && file) {
      formData.append('image', file);
    } else {
      formData.append('imageUrl', imageUrl);
    }

    try {
      await API.post('/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: 'Photograph published to gallery successfully!' });
      setTitle('');
      setDescription('');
      setImageUrl('');
      setFile(null);
      loadPhotos();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photograph from the archive?')) return;
    try {
      await API.delete(`/photos/${id}`);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Could not delete photo: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
          <Shield className="w-4 h-4" />
        </div>
        <h1 className="text-3xl font-extrabold text-white font-display">Curator Command Hub</h1>
      </div>
      <p className="text-neutral-400 text-sm mb-8">Publish new archival captures via direct URL or local files, and manage gallery inventory.</p>

      {/* Upload Form */}
      <div className="glass-card border border-neutral-800 rounded-3xl p-6 sm:p-8 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white font-display">Publish New Photograph</h2>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-xs font-semibold flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Photograph Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kyoto Midnight Monolith"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/60"
              >
                {['Nature', 'Architecture', 'Portrait', 'Travel', 'Street'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Description / Backstory</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide artistic metadata, camera equipment, or narrative..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/60"
            />
          </div>

          {/* Upload Method Switcher */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">Image Source</label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => setUploadType('url')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  uploadType === 'url'
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" /> Direct Image URL
              </button>
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  uploadType === 'file'
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Local Multipart Upload (Multer)
              </button>
            </div>

            {uploadType === 'url' ? (
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/60"
              />
            ) : (
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-400 file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:bg-amber-400 file:text-neutral-950 file:font-bold file:text-xs file:cursor-pointer"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-neutral-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Publishing Capture...' : 'Publish to Archive'}
          </button>
        </form>
      </div>

      {/* Inventory Table */}
      <h2 className="text-xl font-bold text-white font-display mb-4">Curated Inventory ({photos.length})</h2>
      <div className="glass-card border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
              <tr>
                <th className="p-4">Visual</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Curator</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {photos.map((p) => {
                const src = p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:5000${p.imageUrl}`;
                return (
                  <tr key={p._id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="p-4">
                      <img src={src} alt="" className="w-12 h-12 object-cover rounded-xl border border-neutral-800" />
                    </td>
                    <td className="p-4 font-semibold text-white truncate max-w-[200px]">{p.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-950 border border-neutral-800 text-amber-300">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400 text-xs">{p.uploadedBy?.name || 'Curator'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-rose-400 hover:text-white p-2 rounded-xl hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Remove Photograph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
