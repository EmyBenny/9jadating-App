import React, { useState } from 'react';
import { FeedPost, FeedCategory, UserProfile } from '../../types';
import { 
  Heart, MessageCircle, Send, Sparkles, Plus, CheckCircle2, 
  MapPin, Share2, Flame, UserPlus, Filter 
} from 'lucide-react';

interface FeedViewProps {
  currentUser: UserProfile;
  posts: FeedPost[];
  onOpenCreatePost: () => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onViewProfile: (profile: UserProfile) => void;
  onDirectMessage: (profile: UserProfile) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentUser,
  posts,
  onOpenCreatePost,
  onLikePost,
  onAddComment,
  onViewProfile,
  onDirectMessage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FeedCategory | 'all'>('all');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const categories: { id: FeedCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Vibes' },
    { id: 'thoughts', label: 'Thoughts & Gist' },
    { id: 'date_ideas', label: 'Date Ideas' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'weekend_vibes', label: 'Weekend Vibes' },
  ];

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const getCategoryBadge = (cat: FeedCategory) => {
    switch (cat) {
      case 'date_ideas':
        return <span className="text-[10px] font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded-full">Date Idea 🍹</span>;
      case 'lifestyle':
        return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">Lifestyle ✨</span>;
      case 'weekend_vibes':
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">Weekend Vibe 🎉</span>;
      case 'thoughts':
      default:
        return <span className="text-[10px] font-bold text-sky-400 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded-full">Thoughts 💭</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Feed Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Tender Feed
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Share your thoughts, feelings, lifestyle & see who matches your vibe.
            </p>
          </div>

          <button
            onClick={onOpenCreatePost}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Post</span>
          </button>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === c.id
                  ? 'bg-orange-600 border-orange-500 text-white shadow-sm'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Quick Share Prompt Card */}
        <div 
          onClick={onOpenCreatePost}
          className="p-3 bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-2xl flex items-center gap-3 cursor-pointer transition-all shadow-sm group"
        >
          <img
            src={currentUser.photos[0]}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-700"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 bg-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
            Wetin dey your mind? Share thoughts, date ideas...
          </div>
          <button className="p-2 rounded-xl bg-orange-600/20 text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-md space-y-3"
          >
            {/* Post Author Bar */}
            <div className="flex items-center justify-between">
              <div 
                onClick={() => onViewProfile(post.author)}
                className="flex items-center gap-2.5 cursor-pointer group"
                title="Tap to view full profile & pictures"
              >
                <div className="relative">
                  <img
                    src={post.author.photos[0]}
                    alt={post.author.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {post.author.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                      {post.author.name}, {post.author.age}
                    </h4>
                    {post.author.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                    <span>{post.author.location.city}</span>
                    <span>·</span>
                    <span>{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Category Badge & View Profile CTA */}
              <div className="flex items-center gap-2">
                {getCategoryBadge(post.category)}
              </div>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {post.content}
            </p>

            {/* Post Photo if attached */}
            {post.photoUrl && (
              <div 
                onClick={() => onViewProfile(post.author)}
                className="rounded-2xl overflow-hidden border border-slate-800 max-h-64 cursor-pointer group"
                title="Tap to see author's profile"
              >
                <img
                  src={post.photoUrl}
                  alt="Post visual"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Action Bar: Like, Comments, Shoot Your Shot (DM) */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.hasLiked ? 'text-rose-500 font-bold' : 'hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="font-mono tabular-nums">{post.likesCount}</span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-mono tabular-nums">{post.comments.length}</span>
                </button>
              </div>

              {/* Direct Shoot Your Shot / Match */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewProfile(post.author)}
                  className="text-[11px] text-slate-300 hover:text-white font-medium px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onDirectMessage(post.author)}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[11px] font-bold shadow-sm hover:brightness-110 flex items-center gap-1"
                >
                  <Flame className="w-3 h-3 fill-white" />
                  <span>Shoot Shot</span>
                </button>
              </div>
            </div>

            {/* Comments Drawer if expanded */}
            {expandedCommentsPostId === post.id && (
              <div className="pt-3 border-t border-slate-800/60 space-y-2.5 animate-in fade-in duration-150">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Comments & Banter ({post.comments.length})
                </span>

                {post.comments.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {post.comments.map((c) => (
                      <div key={c.id} className="p-2.5 bg-slate-800/60 rounded-xl flex items-start gap-2.5">
                        <img
                          src={c.authorAvatar}
                          alt={c.authorName}
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-white block">
                            {c.authorName}
                          </span>
                          <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">No comments yet. Be the first to reply!</p>
                )}

                {/* Inline Comment Composer */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    placeholder="Drop your thoughts or banter..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendComment(post.id);
                    }}
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white disabled:opacity-40"
                    title="Send comment"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
