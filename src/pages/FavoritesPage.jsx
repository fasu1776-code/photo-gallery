import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import PhotoCard from '../components/PhotoCard';
import { Heart, Compass } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await API.get('/favorites');
      setFavorites(res.data.favorites || []);
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggled = (photoId) => {
    setFavorites((prev) => prev.filter((p) => p._id !== photoId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">
          <Heart className="w-3.5 h-3.5 fill-current" /> Personal Bookmarks
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">Saved Favorites</h1>
        <p className="text-neutral-400 text-sm mt-1">Your hand-picked collection of photographic inspirations</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-neutral-900/60 rounded-2xl animate-pulse border border-neutral-800" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-3xl border border-neutral-800 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Bookmarked Photos Yet</h3>
          <p className="text-neutral-400 text-xs mb-6 max-w-xs mx-auto">
            Browse the gallery and click the heart icon on any photo to add it to your personal showcase.
          </p>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
          >
            <Compass className="w-4 h-4" /> Discover Photography
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} onFavoriteToggled={handleFavoriteToggled} />
          ))}
        </div>
      )}
    </div>
  );
}
