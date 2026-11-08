export type Gender = 'male' | 'female' | 'non_binary';
export type InterestedIn = 'men' | 'women' | 'everyone';
export type LookingFor = 'marriage' | 'serious' | 'casual' | 'friendship' | 'open';

export type NigerianTribe = 'Yoruba' | 'Igbo' | 'Hausa' | 'Edo/Benin' | 'Efik/Ibibio' | 'Ijaw' | 'Urhobo' | 'Tiv' | 'Other' | 'Prefer not to say';
export type Religion = 'Christianity' | 'Islam' | 'Traditional' | 'Spiritual' | 'Agnostic/Atheist' | 'Prefer not to say';
export type LifestyleHabit = 'Never' | 'Socially' | 'Regularly';

export interface NigerianLocation {
  city: string;
  state: string;
  zone: 'Mainland' | 'Island' | 'Central' | 'Suburbs' | 'North' | 'East' | 'West' | 'South-South';
  neighborhood?: string;
  coordinates?: { lat: number; lng: number };
}

export interface VoiceNoteData {
  audioUrl: string;
  durationSeconds: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phoneNumber?: string;
  photos: string[];
  bio: string;
  location: NigerianLocation;
  distanceKm: number;
  interestedIn: InterestedIn;
  lookingFor: LookingFor;
  verified: boolean;
  verificationMethod?: 'selfie_gesture' | 'bvn_optional';
  occupation?: string;
  education?: string;
  heightCm?: number;
  tribe?: NigerianTribe;
  religion?: Religion;
  drinking?: LifestyleHabit;
  smoking?: LifestyleHabit;
  interests: string[];
  prompts?: { question: string; answer: string }[];
  voicePrompt?: { prompt: string; duration: number };
  isOnline?: boolean;
  lastSeen?: string;
  isTopPick?: boolean;
  likedCurrentUser?: boolean; // For "Likes You" feed
}

export interface SwipeAction {
  targetUserId: string;
  type: 'like' | 'pass' | 'superlike';
  timestamp: number;
  profileSnapshot: UserProfile;
}

export interface MatchItem {
  id: string;
  user: UserProfile;
  matchedAt: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  lastMessageType?: 'text' | 'voice' | 'photo';
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string; // 'me' or user id
  text: string;
  photoUrl?: string;
  voiceNote?: VoiceNoteData;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
  reactions?: Record<string, string>; // emoji -> count or user list
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

export interface FilterPreferences {
  ageRange: [number, number];
  maxDistanceKm: number;
  interestedIn: InterestedIn;
  lookingFor?: LookingFor | 'all';
  verifiedOnly: boolean;
  selectedCity?: string;
  // MVP 2 Advanced Filters
  minHeightCm?: number;
  religion?: Religion | 'all';
  tribe?: NigerianTribe | 'all';
  educationLevel?: string;
  drinking?: LifestyleHabit | 'all';
  smoking?: LifestyleHabit | 'all';
}

export interface ReportPayload {
  targetUserId: string;
  reason: 'catfish' | 'harassment' | 'scam' | 'underage' | 'inappropriate' | 'urgent_2k' | 'other';
  details: string;
  timestamp: number;
}

export interface SubscriptionPlan {
  id: 'tender_plus_weekly' | 'tender_plus_monthly' | 'tender_gold_quarterly';
  name: string;
  priceNgn: number;
  interval: 'week' | 'month' | '3 months';
  popular?: boolean;
  features: string[];
}

export interface UserSubscriptionState {
  isSubscribed: boolean;
  planId?: string;
  expiresAt?: number;
  boostsRemaining: number;
  superlikesDaily: number;
  unlimitedSwipes: boolean;
  canSeeWhoLikedYou: boolean;
  activeBoostUntil?: number;
}

export type FeedCategory = 'thoughts' | 'lifestyle' | 'date_ideas' | 'weekend_vibes';

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: number;
}

export interface FeedPost {
  id: string;
  author: UserProfile;
  content: string;
  category: FeedCategory;
  photoUrl?: string;
  likesCount: number;
  hasLiked?: boolean;
  comments: PostComment[];
  timestamp: number;
}

