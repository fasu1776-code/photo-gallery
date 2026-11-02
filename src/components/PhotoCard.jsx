import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, User, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const PhotoCard = ({ photo, onFavoriteToggled }) => {
  const { user, isAuthenticated, updateFavoriteList } = useAuth();

  const isFavorited = user?.favorites?.some(
    (fav) => (typeof fav === 'string' ? fav : fav._id) === photo._id
  );

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      await API.post(`/favorites/${photo._id}`);
      updateFavoriteList(photo._id);
      if (onFavoriteToggled) onFavoriteToggled(photo._id);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Static local backend upload
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${url}`;
  };

  const formattedDate = new Date(photo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative rounded-2xl overflow-hidden glass-card flex flex-col justify-between">
      {/* Visual Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-neutral-900">
        <img
          src={getFullImageUrl(photo.imageUrl)}
          alt={photo.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Category Pill Tag */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-950/70 text-amber-300 backdrop-blur-md border border-amber-400/20 shadow-sm">
            {photo.category}
          </span>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={handleToggleFavorite}
          aria-label="Save to favorites"
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
            isFavorited
              ? 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/30'
              : 'bg-neutral-950/60 text-neutral-300 hover:text-white hover:bg-neutral-900 border border-white/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Details Link Overlay */}
        <Link
          to={`/photos/${photo._id}`}
          className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-950/40 backdrop-blur-[2px]"
        >
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/90 text-neutral-100 text-xs font-semibold border border-white/15 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-400" /> View Photograph
          </span>
        </Link>
      </div>

      {/* Info Content Footer */}
      <div className="p-4 flex flex-col gap-2 z-20">
        <Link to={`/photos/${photo._id}`} className="hover:text-amber-400 transition-colors">
          <h3 className="font-semibold text-base text-neutral-100 leading-snug truncate">
            {photo.title}
          </h3>
        </Link>

        {photo.description && (
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {photo.description}
          </p>
        )}

        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
          <span className="flex items-center gap-1.5 truncate max-w-[130px]">
            <User className="w-3 h-3 text-neutral-400" />
            <span className="text-neutral-300 truncate">{photo.uploadedBy?.name || 'Curator'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-500" />
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
