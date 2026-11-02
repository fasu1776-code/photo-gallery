import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Heart, Calendar, User, Tag, Download, Share2, Sparkles } from 'lucide-react';

export default function PhotoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateFavoriteList } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await API.get(`/photos/${id}`);
        setPhoto(res.data.photo);
      } catch (err) {
        setError(err.response?.data?.message || 'Photo not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPhoto();
  }, [id]);

  const isFavorited = user?.favorites?.some(
    (fav) => (typeof fav === 'string' ? fav : fav._id) === id
  );

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await API.post(`/favorites/${id}`);
      updateFavoriteList(id);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${url}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-4" />
        <p className="text-neutral-400 text-sm">Loading photograph...</p>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-rose-400 font-semibold mb-4">{error || 'Photograph not found'}</p>
        <Link to="/gallery" className="px-5 py-2.5 rounded-xl bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700">
          Return to Gallery
        </Link>
      </div>
    );
  }

  const imageUrl = getFullImageUrl(photo.imageUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/gallery"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Full Image Display */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden glass-card border border-neutral-800/80 shadow-2xl relative group bg-neutral-900">
          <img
            src={imageUrl}
            alt={photo.title}
            className="w-full max-h-[75vh] object-contain mx-auto"
          />
        </div>

        {/* Metadata Sidebar */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-neutral-800 space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-3">
              <Tag className="w-3 h-3" /> {photo.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-tight">
              {photo.title}
            </h1>
          </div>

          {photo.description && (
            <p className="text-neutral-300 text-sm leading-relaxed border-t border-neutral-800/80 pt-4">
              {photo.description}
            </p>
          )}

          {/* Details list */}
          <div className="border-t border-neutral-800/80 pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-neutral-500" /> Published By
              </span>
              <span className="font-semibold text-white">{photo.uploadedBy?.name || 'Curator'}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" /> Date Added
              </span>
              <span className="font-semibold text-neutral-200">
                {new Date(photo.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Interactive Actions */}
          <div className="border-t border-neutral-800/80 pt-6 space-y-3">
            <button
              onClick={handleToggleFavorite}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isFavorited
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Saved in Your Favorites' : 'Add to Personal Favorites'}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> Open Raw
              </a>
              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
