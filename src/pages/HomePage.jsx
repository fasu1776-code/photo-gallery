import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import PhotoCard from '../components/PhotoCard';
import { Compass, Sparkles, Shield, Award, ArrowRight, Aperture } from 'lucide-react';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await API.get('/photos');
        // Take top 4 highlights
        setFeatured(res.data.photos.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured photos', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-36 border-b border-neutral-800/80">
        {/* Glow backdrop blur orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> High Precision Photographic Archive
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-display max-w-4xl mx-auto leading-[1.08]">
            Curating the World’s Most <span className="gold-gradient-text">Evocative Imagery</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            An exclusive gallery built for collectors, creators, and visual artists. Browse verified high-resolution captures across architectural marvels, wild sanctuaries, and candid street poetry.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/gallery"
              className="px-8 py-4 rounded-xl font-bold text-sm text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass className="w-4 h-4" /> Enter The Gallery
            </Link>

            <Link
              to="/register"
              className="px-8 py-4 rounded-xl font-semibold text-sm text-neutral-200 hover:text-white glass-panel hover:bg-neutral-800/60 border border-white/10 transition-all flex items-center gap-2"
            >
              Sign Up As Curator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-2xl text-center">
              <span className="text-2xl lg:text-3xl font-bold font-display text-white">4K+</span>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Raw Fidelity</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <span className="text-2xl lg:text-3xl font-bold font-display text-amber-400">5 Distinct</span>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Visual Domains</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <span className="text-2xl lg:text-3xl font-bold font-display text-white">RBAC</span>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Admin Curated</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <span className="text-2xl lg:text-3xl font-bold font-display text-white">Instant</span>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Cloud & Local</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Highlights Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Aperture className="w-3.5 h-3.5" /> Spotlight
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Curator’s Choice Showcase
            </h2>
          </div>
          <Link
            to="/gallery"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 group"
          >
            Explore Complete Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-2xl h-80 bg-neutral-900/70 animate-pulse border border-neutral-800" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-neutral-400 text-sm">No photographs published yet. Curators can add photos from the dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((photo) => (
              <PhotoCard key={photo._id} photo={photo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
