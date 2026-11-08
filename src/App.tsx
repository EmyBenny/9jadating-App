import React, { useState, useEffect } from 'react';
import { 
  UserProfile, MatchItem, ChatMessage, FilterPreferences, 
  ReportPayload, SubscriptionPlan, UserSubscriptionState, 
  VoiceNoteData, FeedPost, FeedCategory 
} from './types';
import { INITIAL_PROFILES, CURRENT_USER_MOCK, SUBSCRIPTION_PLANS } from './data/mockProfiles';
import { INITIAL_FEED_POSTS } from './data/mockFeed';
import { MobileFrame } from './components/mobile/MobileFrame';
import { SwipeDeck } from './components/discovery/SwipeDeck';
import { ProfileDetailModal } from './components/discovery/ProfileDetailModal';
import { MatchModal } from './components/discovery/MatchModal';
import { MatchesList } from './components/chat/MatchesList';
import { ChatRoom } from './components/chat/ChatRoom';
import { ProfileView } from './components/profile/ProfileView';
import { PreferencesModal } from './components/profile/PreferencesModal';
import { PhotoVerificationModal } from './components/profile/PhotoVerificationModal';
import { ReportBlockModal } from './components/safety/ReportBlockModal';
import { AuthFlow } from './components/onboarding/AuthFlow';
import { ArchitectureStudio } from './components/docs/ArchitectureStudio';
import { LikesYouFeed } from './components/discovery/LikesYouFeed';
import { TopPicksView } from './components/discovery/TopPicksView';
import { NearMeRadar } from './components/discovery/NearMeRadar';
import { SubscriptionModal } from './components/monetization/SubscriptionModal';
import { PaystackModal } from './components/monetization/PaystackModal';
import { SafetyCenterModal } from './components/safety/SafetyCenterModal';
import { UnmatchModal } from './components/chat/UnmatchModal';
import { FeedView } from './components/feed/FeedView';
import { CreatePostModal } from './components/feed/CreatePostModal';
import { 
  Flame, Smartphone, BookOpen, RefreshCw, Sparkles, 
  CheckCircle2, UserPlus, Shield, Heart, Navigation, 
  Zap, Lock, Compass, MessageCircle, User, Monitor, 
  ChevronRight, MessageSquare, Plus, SlidersHorizontal 
} from 'lucide-react';

export default function App() {
  // View Mode: 'responsive' (default fluid web app) | 'phone_frame' (simulated device) | 'docs_only' (architecture)
  const [viewMode, setViewMode] = useState<'responsive' | 'phone_frame' | 'docs_only'>('responsive');

  // Navigation Tab: 'discovery' | 'feed' | 'matches' | 'profile'
  const [activeTab, setActiveTab] = useState<'discovery' | 'feed' | 'matches' | 'profile'>('discovery');

  // Discovery Sub-View: 'cards' | 'likes_you' | 'top_picks' | 'near_me'
  const [discoverySubView, setDiscoverySubView] = useState<'cards' | 'likes_you' | 'top_picks' | 'near_me'>('cards');

  // User & Feed State
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER_MOCK);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [remainingSuperlikes, setRemainingSuperlikes] = useState(3);
  const [lastSwipedProfile, setLastSwipedProfile] = useState<UserProfile | null>(null);

  // Community Feed State
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // MVP 2 Subscription & Boost State
  const [subscription, setSubscription] = useState<UserSubscriptionState>({
    isSubscribed: false,
    boostsRemaining: 1,
    superlikesDaily: 3,
    unlimitedSwipes: false,
    canSeeWhoLikedYou: false,
  });
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(30);

  // Active Chats & Matches State
  const [matches, setMatches] = useState<MatchItem[]>([
    {
      id: 'match_chioma',
      user: INITIAL_PROFILES[0],
      matchedAt: Date.now() - 3600000 * 2,
      lastMessage: 'Lekki coffee sounds good! What day works for you? ☕',
      lastMessageTime: '1h ago',
      unreadCount: 1,
      lastMessageType: 'text',
    }
  ]);
  const [messagesByMatchId, setMessagesByMatchId] = useState<Record<string, ChatMessage[]>>({
    'match_chioma': [
      {
        id: 'msg_1',
        matchId: 'match_chioma',
        senderId: 'user_chioma',
        text: 'Hey! Loved your prompt about Lagos music and food 🙌',
        timestamp: Date.now() - 3600000 * 2,
        status: 'read'
      },
      {
        id: 'msg_2',
        matchId: 'match_chioma',
        senderId: 'me',
        text: 'Haha thank you! University of Suya or Danfo Bistro any day.',
        timestamp: Date.now() - 3600000 * 1.5,
        status: 'read'
      },
      {
        id: 'msg_3',
        matchId: 'match_chioma',
        senderId: 'user_chioma',
        text: 'Lekki coffee sounds good! What day works for you? ☕',
        timestamp: Date.now() - 3600000 * 1,
        status: 'delivered'
      }
    ]
  });

  // Selected chat conversation
  const [activeChatUser, setActiveChatUser] = useState<UserProfile | null>(null);

  // MVP 2 Filter preferences
  const [preferences, setPreferences] = useState<FilterPreferences>({
    ageRange: [20, 35],
    maxDistanceKm: 50,
    interestedIn: 'women',
    lookingFor: 'all',
    verifiedOnly: false,
    tribe: 'all',
    religion: 'all',
    minHeightCm: 155,
  });

  // Modals & Flows
  const [inspectedProfile, setInspectedProfile] = useState<UserProfile | null>(null);
  const [celebrationMatch, setCelebrationMatch] = useState<UserProfile | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [reportTargetUser, setReportTargetUser] = useState<UserProfile | null>(null);
  const [unmatchTargetUser, setUnmatchTargetUser] = useState<UserProfile | null>(null);
  const [showSafetyCenter, setShowSafetyCenter] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlanForPaystack, setSelectedPlanForPaystack] = useState<SubscriptionPlan | null>(null);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Boost timer simulation
  useEffect(() => {
    let interval: any;
    if (isBoostActive && boostTimeLeft > 0) {
      interval = setInterval(() => {
        setBoostTimeLeft((prev) => {
          if (prev <= 1) {
            setIsBoostActive(false);
            return 30;
          }
          return prev - 1;
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isBoostActive, boostTimeLeft]);

  // Show a toast helper
  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Play subtle sound effect
  const playSound = (type: 'match' | 'swipe' | 'pop') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'match') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'swipe') {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  // Handle Swipe Actions (Like, Pass, Superlike)
  const handleSwipe = (profile: UserProfile, type: 'like' | 'pass' | 'superlike') => {
    playSound('swipe');
    setLastSwipedProfile(profile);

    setAllProfiles((prev) => prev.filter((p) => p.id !== profile.id));

    if (type === 'superlike') {
      if (remainingSuperlikes > 0) {
        setRemainingSuperlikes((prev) => prev - 1);
      }
    }

    if (type === 'like' || type === 'superlike') {
      setTimeout(() => {
        playSound('match');
        setCelebrationMatch(profile);

        const matchId = `match_${profile.id}`;
        setMatches((prev) => {
          if (prev.some((m) => m.user.id === profile.id)) return prev;
          return [
            {
              id: matchId,
              user: profile,
              matchedAt: Date.now(),
              unreadCount: 1,
            },
            ...prev,
          ];
        });

        setMessagesByMatchId((prev) => ({
          ...prev,
          [matchId]: prev[matchId] || [],
        }));
      }, 350);
    } else {
      showToast(`Passed on ${profile.name}`);
    }
  };

  // Undo Last Swipe
  const handleUndoSwipe = () => {
    if (!lastSwipedProfile) return;
    setAllProfiles((prev) => [lastSwipedProfile, ...prev]);
    showToast(`Restored ${lastSwipedProfile.name} to your deck`);
    setLastSwipedProfile(null);
  };

  // Handle Send Message
  const handleSendMessage = (
    text: string, 
    photoUrl?: string, 
    voiceNote?: VoiceNoteData, 
    replyTo?: ChatMessage['replyTo']
  ) => {
    if (!activeChatUser) return;
    const matchId = `match_${activeChatUser.id}`;
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      matchId,
      senderId: 'me',
      text,
      photoUrl,
      voiceNote,
      replyTo,
      timestamp: Date.now(),
      status: 'sent',
    };

    setMessagesByMatchId((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg],
    }));

    setMatches((prev) =>
      prev.map((m) =>
        m.user.id === activeChatUser.id
          ? {
              ...m,
              lastMessage: voiceNote ? '🎙️ Voice note' : photoUrl ? '📷 Photo shared' : text,
              lastMessageTime: 'Just now',
              lastMessageType: voiceNote ? 'voice' : photoUrl ? 'photo' : 'text',
              unreadCount: 0,
            }
          : m
      )
    );
  };

  // Unmatch a user with reason
  const handleConfirmUnmatch = (reason?: string) => {
    if (!unmatchTargetUser) return;
    setMatches((prev) => prev.filter((m) => m.user.id !== unmatchTargetUser.id));
    setActiveChatUser(null);
    setUnmatchTargetUser(null);
    showToast(`Unmatched: "${reason || 'Conversation closed'}"`);
  };

  // Report and block user
  const handleReportAndBlock = (report: ReportPayload, blockUser: boolean) => {
    if (blockUser) {
      setAllProfiles((prev) => prev.filter((p) => p.id !== report.targetUserId));
      setMatches((prev) => prev.filter((m) => m.user.id !== report.targetUserId));
      if (activeChatUser?.id === report.targetUserId) {
        setActiveChatUser(null);
      }
    }
    showToast('Report submitted to safety team. User blocked.');
  };

  // Reset Deck
  const handleResetDeck = () => {
    setAllProfiles(INITIAL_PROFILES);
    setLastSwipedProfile(null);
    showToast('Deck reloaded with Nigerian profiles');
  };

  // Create Feed Post
  const handleCreatePost = (content: string, category: FeedCategory, photoUrl?: string) => {
    const newPost: FeedPost = {
      id: 'post_' + Date.now(),
      author: currentUser,
      content,
      category,
      photoUrl,
      likesCount: 0,
      hasLiked: false,
      comments: [],
      timestamp: Date.now(),
    };
    setFeedPosts((prev) => [newPost, ...prev]);
    showToast('Your post has been published to Tender Feed ✨');
  };

  // Like Feed Post
  const handleLikePost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likesCount: hasLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  // Add Comment to Feed Post
  const handleAddPostComment = (postId: string, text: string) => {
    const newComment = {
      id: 'c_' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.photos[0],
      text,
      timestamp: Date.now(),
    };
    setFeedPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
    showToast('Comment posted!');
  };

  // Shoot your shot from Feed -> Open or create conversation
  const handleDirectMessageFromFeed = (author: UserProfile) => {
    const matchId = `match_${author.id}`;
    setMatches((prev) => {
      if (prev.some((m) => m.user.id === author.id)) return prev;
      return [
        {
          id: matchId,
          user: author,
          matchedAt: Date.now(),
          unreadCount: 0,
        },
        ...prev,
      ];
    });
    setMessagesByMatchId((prev) => ({
      ...prev,
      [matchId]: prev[matchId] || [],
    }));
    setActiveTab('matches');
    setActiveChatUser(author);
  };

  // Trigger Profile Boost
  const handleTriggerBoost = () => {
    setIsBoostActive(true);
    setBoostTimeLeft(30);
    showToast('⚡ Profile Boost Activated! 10x visibility in your zone for 30 minutes.');
  };

  // Handle Paystack Payment Success
  const handlePaystackSuccess = (plan: SubscriptionPlan) => {
    setSelectedPlanForPaystack(null);
    setShowSubscriptionModal(false);
    setSubscription({
      isSubscribed: true,
      planId: plan.id,
      unlimitedSwipes: true,
      canSeeWhoLikedYou: true,
      superlikesDaily: 5,
      boostsRemaining: 2,
    });
    setRemainingSuperlikes(5);
    showToast(`🎉 Payment confirmed! You are now subscribed to ${plan.name}.`);
  };

  // Instant match from "Likes You" feed
  const handleInstantMatch = (profile: UserProfile) => {
    handleSwipe(profile, 'like');
  };

  const profilesWhoLikedMe = INITIAL_PROFILES.filter((p) => p.likedCurrentUser);
  const topPicks = INITIAL_PROFILES.filter((p) => p.isTopPick);

  // Filter profiles according to current filter preferences
  const visibleProfiles = allProfiles.filter((p) => {
    if (p.age < preferences.ageRange[0] || p.age > preferences.ageRange[1]) return false;
    if (p.distanceKm > preferences.maxDistanceKm) return false;
    if (preferences.verifiedOnly && !p.verified) return false;
    if (preferences.interestedIn !== 'everyone') {
      const matchGender = preferences.interestedIn === 'women' ? 'female' : 'male';
      if (p.gender !== matchGender) return false;
    }
    if (preferences.lookingFor && preferences.lookingFor !== 'all') {
      if (p.lookingFor !== preferences.lookingFor) return false;
    }
    if (preferences.selectedCity) {
      if (!p.location.city.toLowerCase().includes(preferences.selectedCity.toLowerCase())) {
        return false;
      }
    }
    if (preferences.tribe && preferences.tribe !== 'all') {
      if (p.tribe !== preferences.tribe) return false;
    }
    if (preferences.religion && preferences.religion !== 'all') {
      if (p.religion !== preferences.religion) return false;
    }
    if (preferences.minHeightCm && p.heightCm) {
      if (p.heightCm < preferences.minHeightCm) return false;
    }
    return true;
  });

  // Main Core View Render Helper (shared between Responsive Desktop and Mobile)
  const renderActiveViewContent = () => {
    if (showOnboardingWizard) {
      return (
        <AuthFlow
          onComplete={(newUser) => {
            setCurrentUser(newUser);
            setShowOnboardingWizard(false);
            showToast(`Welcome to Tender, ${newUser.name}! Profile active.`);
          }}
          onCancel={() => setShowOnboardingWizard(false)}
        />
      );
    }

    if (activeTab === 'discovery') {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Discovery Sub-Mode Switcher */}
          <div className="px-3 sm:px-4 pt-2 pb-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex gap-1 p-0.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setDiscoverySubView('cards')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  discoverySubView === 'cards' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cards Stack
              </button>
              <button
                onClick={() => setDiscoverySubView('likes_you')}
                className={`px-3 py-1.5 rounded-lg transition-colors relative flex items-center gap-1.5 whitespace-nowrap ${
                  discoverySubView === 'likes_you' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Likes You</span>
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {profilesWhoLikedMe.length}
                </span>
              </button>
              <button
                onClick={() => setDiscoverySubView('top_picks')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  discoverySubView === 'top_picks' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Top Picks
              </button>
              <button
                onClick={() => setDiscoverySubView('near_me')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  discoverySubView === 'near_me' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Near Me Radar
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isBoostActive && (
                <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  <span>10x {boostTimeLeft}m</span>
                </div>
              )}
              <button
                onClick={() => setShowPreferences(true)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                title="Filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {discoverySubView === 'cards' && (
              <SwipeDeck
                profiles={visibleProfiles}
                onSwipe={handleSwipe}
                onUndoSwipe={handleUndoSwipe}
                canUndo={!!lastSwipedProfile}
                onOpenDetail={(p) => setInspectedProfile(p)}
                onOpenPreferences={() => setShowPreferences(true)}
                onResetDeck={handleResetDeck}
                remainingSuperlikes={remainingSuperlikes}
              />
            )}
            {discoverySubView === 'likes_you' && (
              <LikesYouFeed
                profilesWhoLikedMe={profilesWhoLikedMe}
                isSubscribed={subscription.canSeeWhoLikedYou}
                onOpenUpgrade={() => setShowSubscriptionModal(true)}
                onInstantMatch={handleInstantMatch}
                onViewProfile={(p) => setInspectedProfile(p)}
              />
            )}
            {discoverySubView === 'top_picks' && (
              <TopPicksView
                topPicks={topPicks}
                onSelectPick={(p) => setInspectedProfile(p)}
                onLikePick={(p) => handleSwipe(p, 'like')}
              />
            )}
            {discoverySubView === 'near_me' && (
              <NearMeRadar
                profiles={visibleProfiles}
                onSelectProfile={(p) => setInspectedProfile(p)}
                onLikeProfile={(p) => handleSwipe(p, 'like')}
              />
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'feed') {
      return (
        <div className="flex-1 max-w-2xl mx-auto w-full h-full overflow-hidden flex flex-col">
          <FeedView
            currentUser={currentUser}
            posts={feedPosts}
            onOpenCreatePost={() => setShowCreatePostModal(true)}
            onLikePost={handleLikePost}
            onAddComment={handleAddPostComment}
            onViewProfile={(p) => setInspectedProfile(p)}
            onDirectMessage={handleDirectMessageFromFeed}
          />
        </div>
      );
    }

    if (activeTab === 'matches') {
      if (activeChatUser) {
        return (
          <ChatRoom
            currentUser={currentUser}
            matchedUser={activeChatUser}
            messages={messagesByMatchId[`match_${activeChatUser.id}`] || []}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveChatUser(null)}
            onOpenUnmatch={(u) => setUnmatchTargetUser(u)}
            onReport={(u) => setReportTargetUser(u)}
          />
        );
      }
      return (
        <MatchesList
          matches={matches}
          onSelectMatch={(m) => setActiveChatUser(m.user)}
          onGoToDiscovery={() => {
            setActiveTab('discovery');
            setDiscoverySubView('cards');
          }}
        />
      );
    }

    if (activeTab === 'profile') {
      return (
        <div className="flex-1 max-w-2xl mx-auto w-full h-full overflow-hidden flex flex-col">
          <ProfileView
            currentUser={currentUser}
            onUpdateProfile={(updated) => {
              setCurrentUser((prev) => ({ ...prev, ...updated }));
              showToast('Profile updated!');
            }}
            onStartVerification={() => setShowVerificationModal(true)}
            onOpenPreferences={() => setShowPreferences(true)}
            onOpenSafetyCenter={() => setShowSafetyCenter(true)}
            onOpenUpgrade={() => setShowSubscriptionModal(true)}
            onTriggerBoost={handleTriggerBoost}
            isBoostActive={isBoostActive}
            boostTimeLeft={boostTimeLeft}
            onDeleteAccount={() => {
              setCurrentUser(CURRENT_USER_MOCK);
              setMatches([]);
              setAllProfiles(INITIAL_PROFILES);
              showToast('Account data reset.');
            }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Top Universal App Header */}
      <header className="h-16 px-4 sm:px-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 z-40">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Tender
          </span>
          <span className="hidden sm:inline-block text-[11px] text-amber-400 font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
            Naija Edition
          </span>
        </div>

        {/* Zone 2: Viewport Mode Switcher */}
        <nav className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setViewMode('responsive')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              viewMode === 'responsive' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Auto-adapts to Desktop and Mobile Screens"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Responsive App</span>
            <span className="sm:hidden">App</span>
          </button>
          <button
            onClick={() => setViewMode('phone_frame')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              viewMode === 'phone_frame' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Simulated iPhone Frame on Desktop"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone Frame</span>
            <span className="sm:hidden">Frame</span>
          </button>
          <button
            onClick={() => setViewMode('docs_only')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              viewMode === 'docs_only' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="View Full Architecture Specs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tech Specs</span>
            <span className="sm:hidden">Specs</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all whitespace-nowrap"
            title="Tender Plus Subscription in Naira"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span className="hidden md:inline">{subscription.isSubscribed ? 'Tender Plus Active' : 'Upgrade · ₦3,500'}</span>
            <span className="md:hidden">Upgrade</span>
          </button>

          <button
            onClick={handleResetDeck}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reload Sample Profiles"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Toast Notification Banner */}
        {toastNotification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-orange-600 text-white text-xs font-bold shadow-xl shadow-orange-950/60 animate-in fade-in slide-in-from-top duration-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{toastNotification}</span>
          </div>
        )}

        {/* 1. RESPONSIVE MODE (Desktop Multi-Column + Mobile Native Edge-to-Edge) */}
        {viewMode === 'responsive' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* DESKTOP VIEWPORT (>= lg) */}
            <div className="hidden lg:flex flex-1 overflow-hidden p-6 max-w-7xl mx-auto w-full">
              <div className="flex-1 flex overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
                {/* Desktop Left Sidebar (Navigation & Info) */}
                <aside className="w-80 xl:w-88 shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col h-full">
                  {/* User Profile Mini Header */}
                  <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                    <div 
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <img
                          src={currentUser.photos[0]}
                          alt={currentUser.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        {currentUser.verified && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 bg-amber-500 rounded-full text-slate-950">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-slate-950 text-amber-300" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors block">
                          {currentUser.name}, {currentUser.age}
                        </span>
                        <span className="text-[11px] text-slate-400 block -mt-0.5">
                          {currentUser.location.city}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowPreferences(true)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800"
                      title="Preferences"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Boost & Plus Status Widget */}
                  <div className="p-3 border-b border-slate-800/60">
                    <div className="p-3 bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-900 border border-orange-500/30 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                          <Zap className="w-4 h-4 fill-orange-400" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {isBoostActive ? `Boost Active (${boostTimeLeft}m)` : 'Profile Visibility'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {isBoostActive ? '10x profile views in Lagos' : 'Boost your card for 30m'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleTriggerBoost}
                        disabled={isBoostActive}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-[10px] disabled:opacity-50"
                      >
                        {isBoostActive ? 'Active' : 'Boost'}
                      </button>
                    </div>
                  </div>

                  {/* Primary Navigation Destinations */}
                  <div className="p-3 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('discovery');
                        setActiveChatUser(null);
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                        activeTab === 'discovery' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4" />
                        <span className="text-xs font-semibold">Discover Profiles</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80">{visibleProfiles.length}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('feed');
                        setActiveChatUser(null);
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                        activeTab === 'feed' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-semibold">Community Feed</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80">{feedPosts.length}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('matches')}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                        activeTab === 'matches' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">Matches & Chats</span>
                      </div>
                      {matches.length > 0 && (
                        <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full">
                          {matches.length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setShowSafetyCenter(true)}
                      className="w-full p-2.5 rounded-xl flex items-center justify-between text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold">Naija Safety Center</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>

                  {/* Sidebar Contextual Content */}
                  <div className="flex-1 overflow-y-auto p-3 border-t border-slate-800/80">
                    {activeTab === 'matches' ? (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                          Conversations
                        </span>
                        {matches.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setActiveChatUser(m.user)}
                            className={`p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${
                              activeChatUser?.id === m.user.id ? 'bg-orange-600/20 border border-orange-500/50' : 'hover:bg-slate-900'
                            }`}
                          >
                            <img
                              src={m.user.photos[0]}
                              alt={m.user.name}
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate">{m.user.name}</span>
                                <span className="text-[10px] text-slate-400">{m.lastMessageTime}</span>
                              </div>
                              <p className="text-[11px] text-slate-300 truncate mt-0.5">{m.lastMessage || 'Matched recently'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : activeTab === 'feed' ? (
                      <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                          Naija Vibe Topics
                        </span>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <p>• <strong>#LekkiCoffeeDates</strong></p>
                          <p>• <strong>#AbujaTranquility</strong></p>
                          <p>• <strong>#JollofWarsOfficial</strong></p>
                          <p>• <strong>#NoUrgent2k</strong></p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                          Quick Match Preview
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {topPicks.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => setInspectedProfile(p)}
                              className="flex flex-col items-center shrink-0 cursor-pointer group"
                            >
                              <img
                                src={p.photos[0]}
                                alt={p.name}
                                className="w-12 h-12 rounded-full object-cover border border-amber-500/60 group-hover:scale-105 transition-transform"
                              />
                              <span className="text-[10px] text-slate-300 font-semibold mt-1 truncate max-w-[50px]">{p.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </aside>

                {/* Desktop Main Stage */}
                <section className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900/60 relative">
                  {renderActiveViewContent()}
                </section>
              </div>
            </div>

            {/* MOBILE VIEWPORT (< lg): Fluid Native Edge-to-Edge */}
            <div className="lg:hidden flex-1 flex flex-col h-full overflow-hidden relative pb-16">
              {renderActiveViewContent()}

              {/* Fixed Bottom Mobile Navigation Bar */}
              <nav className="h-16 fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 flex items-center justify-around z-40">
                <button
                  onClick={() => {
                    setActiveTab('discovery');
                    setActiveChatUser(null);
                  }}
                  className={`flex flex-col items-center justify-center gap-1 transition-all ${
                    activeTab === 'discovery' ? 'text-orange-500 scale-105' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-[10px] font-bold">Discover</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('feed');
                    setActiveChatUser(null);
                  }}
                  className={`flex flex-col items-center justify-center gap-1 transition-all ${
                    activeTab === 'feed' ? 'text-orange-500 scale-105' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                  </svg>
                  <span className="text-[10px] font-bold">Feed</span>
                </button>

                <button
                  onClick={() => setActiveTab('matches')}
                  className={`relative flex flex-col items-center justify-center gap-1 transition-all ${
                    activeTab === 'matches' ? 'text-orange-500 scale-105' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="relative">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                    {matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0) > 0 && (
                      <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                        {matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold">Matches</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setActiveChatUser(null);
                  }}
                  className={`flex flex-col items-center justify-center gap-1 transition-all ${
                    activeTab === 'profile' ? 'text-orange-500 scale-105' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="text-[10px] font-bold">Profile</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* 2. PHONE SIMULATOR FRAME MODE */}
        {viewMode === 'phone_frame' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
            <MobileFrame
              activeTab={activeTab}
              onChangeTab={(tab) => {
                setActiveTab(tab);
                setActiveChatUser(null);
              }}
              unreadCount={matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0)}
            >
              {renderActiveViewContent()}
            </MobileFrame>
            <div className="mt-3 text-center text-xs text-slate-400">
              Simulated iPhone 16 Pro Viewport · Switch to <strong>Responsive App</strong> for full desktop layout
            </div>
          </div>
        )}

        {/* 3. TECHNICAL SPECIFICATIONS & ARCHITECTURE STUDIO */}
        {viewMode === 'docs_only' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl mx-auto w-full overflow-hidden">
            <ArchitectureStudio />
          </div>
        )}
      </main>

      {/* GLOBAL MODALS */}
      {/* 1. Profile Detail Modal */}
      {inspectedProfile && (
        <ProfileDetailModal
          profile={inspectedProfile}
          onClose={() => setInspectedProfile(null)}
          onLike={(p) => {
            setInspectedProfile(null);
            handleSwipe(p, 'like');
          }}
          onPass={(p) => {
            setInspectedProfile(null);
            handleSwipe(p, 'pass');
          }}
          onSuperlike={(p) => {
            setInspectedProfile(null);
            handleSwipe(p, 'superlike');
          }}
          onReport={(p) => {
            setInspectedProfile(null);
            setReportTargetUser(p);
          }}
        />
      )}

      {/* 2. Match Celebration Modal ("E Don Happen!") */}
      {celebrationMatch && (
        <MatchModal
          currentUser={currentUser}
          matchedUser={celebrationMatch}
          onClose={() => setCelebrationMatch(null)}
          onOpenChat={(user, initialMsg) => {
            setCelebrationMatch(null);
            setActiveTab('matches');
            setActiveChatUser(user);
            if (initialMsg) {
              handleSendMessage(initialMsg);
            }
          }}
        />
      )}

      {/* 3. Preferences & Discovery Filter Modal */}
      {showPreferences && (
        <PreferencesModal
          preferences={preferences}
          isSubscribed={subscription.isSubscribed}
          onUpgradeToUnlock={() => {
            setShowPreferences(false);
            setShowSubscriptionModal(true);
          }}
          onSave={(newPrefs) => {
            setPreferences(newPrefs);
            showToast('Preferences updated');
          }}
          onClose={() => setShowPreferences(false)}
        />
      )}

      {/* 4. Multi-Step Photo Verification Modal */}
      {showVerificationModal && (
        <PhotoVerificationModal
          onClose={() => setShowVerificationModal(false)}
          onVerifySuccess={() => {
            setCurrentUser((prev) => ({ ...prev, verified: true }));
            showToast('Congratulations! You are now Naija Verified');
          }}
        />
      )}

      {/* 5. Report & Block Safety Modal */}
      {reportTargetUser && (
        <ReportBlockModal
          targetUser={reportTargetUser}
          onClose={() => setReportTargetUser(null)}
          onSubmitReport={handleReportAndBlock}
        />
      )}

      {/* 6. Unmatch with Reason Modal */}
      {unmatchTargetUser && (
        <UnmatchModal
          user={unmatchTargetUser}
          onClose={() => setUnmatchTargetUser(null)}
          onConfirmUnmatch={handleConfirmUnmatch}
        />
      )}

      {/* 7. Safety Center Modal */}
      {showSafetyCenter && (
        <SafetyCenterModal
          onClose={() => setShowSafetyCenter(false)}
        />
      )}

      {/* 8. Tender Plus Subscription Plans Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSelectPlan={(plan) => {
            setSelectedPlanForPaystack(plan);
          }}
          onBuyBoost={() => {
            setShowSubscriptionModal(false);
            handleTriggerBoost();
          }}
          onBuySuperlikes={() => {
            setShowSubscriptionModal(false);
            setRemainingSuperlikes((prev) => prev + 5);
            showToast('⭐ 5 Superlikes added to your account!');
          }}
        />
      )}

      {/* 9. Paystack Payment Checkout Modal */}
      {selectedPlanForPaystack && (
        <PaystackModal
          plan={selectedPlanForPaystack}
          onClose={() => setSelectedPlanForPaystack(null)}
          onSuccess={handlePaystackSuccess}
        />
      )}

      {/* 10. Create Feed Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          currentUser={currentUser}
          onClose={() => setShowCreatePostModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
}
