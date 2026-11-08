import React, { useState } from 'react';
import { UserProfile, FeedCategory } from '../../types';
import { X, Image as ImageIcon, Sparkles, MapPin, Send, Check } from 'lucide-react';

interface CreatePostModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onSubmit: (content: string, category: FeedCategory, photoUrl?: string) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<FeedCategory>('thoughts');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', // cozy restaurant/date
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // nature / landscape
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', // jollof / food
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80', // concert / vibes
  ];

  const categories: { id: FeedCategory; label: string; icon: string }[] = [
    { id: 'thoughts', label: 'Thoughts & Feelings', icon: '💭' },
    { id: 'lifestyle', label: 'Lifestyle & Hobbies', icon: '✨' },
    { id: 'date_ideas', label: 'Date Ideas', icon: '🍹' },
    { id: 'weekend_vibes', label: 'Weekend Vibes', icon: '🎉' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), category, selectedPhoto || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-100 shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <h3 className="text-base font-bold text-white">Share on Tender Feed</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User preview */}
        <div className="flex items-center gap-2.5 py-3 shrink-0">
          <img
            src={currentUser.photos[0]}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-700"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="text-xs font-bold text-white block">{currentUser.name}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-400" />
              <span>{currentUser.location.city}</span>
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto space-y-3 pr-1">
          {/* Category Chips */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Topic Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors border ${
                    category === c.id
                      ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                      : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Wetin dey your mind? Share your thoughts, dating preference, weekend plan, or ideal first date spot..."
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 leading-relaxed"
              autoFocus
            />
          </div>

          {/* Attached Photo Preview if any */}
          {selectedPhoto && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 h-36 shrink-0">
              <img
                src={selectedPhoto}
                alt="Selected attachment"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Add Sample Photo Picker */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
              <span>Attach Aesthetic Date / Lifestyle Photo (Optional)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {samplePhotos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className={`relative aspect-video rounded-xl overflow-hidden border transition-all ${
                    selectedPhoto === photo ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="Sample" className="w-full h-full object-cover" />
                  {selectedPhoto === photo && (
                    <div className="absolute inset-0 bg-orange-600/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!content.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/25 active:scale-98 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
