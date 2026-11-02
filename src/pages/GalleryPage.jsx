import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ImageOff, Compass } from 'lucide-react';
import API from '../services/api';
import PhotoCard from '../components/PhotoCard';

const CATEGORIES = ['All', 'Nature', 'Architecture', 'Portrait', 'Travel', 'Street'];

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        if (search.trim()) params.search = search.trim();
        const res = await API.get('/photos', { params });
        setPhotos(res.data.photos || []);
      } catch (err) {
        console.error('Error fetching gallery photos:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchPhotos();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Compass className="w-3.5 h-3.5" /> Curated Collection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">Photographic Archives</h1>
          <p className="text-neutral-400 text-sm mt-1">Filter by visual discipline or search across titles and narratives</p>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-84">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, descriptions..."
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              category === cat
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-400/20'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-neutral-900/60 rounded-2xl animate-pulse border border-neutral-800/80" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-2xl border border-neutral-800">
          <ImageOff className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-300 font-medium">No photographs matched your query.</p>
          <p className="text-neutral-500 text-xs mt-1">Try resetting the category filter or searching for another term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}
