import { FeedPost } from '../types';
import { INITIAL_PROFILES } from './mockProfiles';

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'post_1',
    author: INITIAL_PROFILES[0], // Chioma (Lekki, 25)
    content: 'Looking for someone who actually enjoys quiet art gallery dates in VI and Lekki instead of just loud clubs every Friday night 😂. Any art lovers here? What’s your favorite hidden gem in Lagos?',
    category: 'date_ideas',
    photoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    likesCount: 24,
    hasLiked: false,
    timestamp: Date.now() - 1000 * 60 * 25, // 25 mins ago
    comments: [
      {
        id: 'c_1',
        authorId: INITIAL_PROFILES[1].id, // Tunde
        authorName: INITIAL_PROFILES[1].name,
        authorAvatar: INITIAL_PROFILES[1].photos[0],
        text: 'Rele Gallery in Onikan is unmatched! Then coffee afterwards at Danfo Bistro.',
        timestamp: Date.now() - 1000 * 60 * 18,
      },
      {
        id: 'c_2',
        authorId: 'user_emeka',
        authorName: 'Emeka',
        authorAvatar: INITIAL_PROFILES[3].photos[0],
        text: '100% agree! Quiet dates where you can actually hear each other talk win every time 🙌',
        timestamp: Date.now() - 1000 * 60 * 10,
      }
    ]
  },
  {
    id: 'post_2',
    author: INITIAL_PROFILES[1], // Tunde (VI, 27)
    content: 'Saturday 10km run on the Lekki-Ikoyi link bridge done! 🏃‍♂️ Beautiful sunrise over the lagoon. Who else believes morning dates with fresh smoothies > late night stress? Looking for a weekend running buddy.',
    category: 'lifestyle',
    photoUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    likesCount: 38,
    hasLiked: true,
    timestamp: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
    comments: [
      {
        id: 'c_3',
        authorId: INITIAL_PROFILES[4].id, // Folake
        authorName: 'Folake',
        authorAvatar: INITIAL_PROFILES[4].photos[0],
        text: 'Consistency! Some of us are still in bed enjoying Saturday sleep lol 😂',
        timestamp: Date.now() - 1000 * 60 * 45,
      }
    ]
  },
  {
    id: 'post_3',
    author: INITIAL_PROFILES[2], // Zainab (Abuja, 24)
    content: 'Sunday afternoon sketch session in Maitama under the mahogany trees. Abuja weather has been giving pure romance recently ✨. A calm life with someone ambitious is truly the ultimate flex.',
    category: 'thoughts',
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    likesCount: 42,
    hasLiked: false,
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    comments: [
      {
        id: 'c_4',
        authorId: 'user_tunde',
        authorName: 'Tunde',
        authorAvatar: INITIAL_PROFILES[1].photos[0],
        text: 'Abuja tranquility is undefeated. Lagos could never relax like that haha.',
        timestamp: Date.now() - 1000 * 60 * 120,
      }
    ]
  },
  {
    id: 'post_4',
    author: INITIAL_PROFILES[3], // Emeka (Yaba, 28)
    content: 'Serious question for the timeline: Best street Amala in Lagos? Amala Shitta or White House Yaba? First date rule: If you can eat swallow comfortably in front of me, you have already won 50% of my heart 😂🍛',
    category: 'thoughts',
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    likesCount: 56,
    hasLiked: false,
    timestamp: Date.now() - 1000 * 60 * 300, // 5 hours ago
    comments: [
      {
        id: 'c_5',
        authorId: INITIAL_PROFILES[0].id,
        authorName: 'Chioma',
        authorAvatar: INITIAL_PROFILES[0].photos[0],
        text: 'Amala Shitta with gbegiri, ewedu and goat meat any day! Don’t let anyone lie to you.',
        timestamp: Date.now() - 1000 * 60 * 200,
      }
    ]
  },
  {
    id: 'post_5',
    author: INITIAL_PROFILES[5], // Amina (Ikeja, 25)
    content: 'Live jazz & old-school afrobeats at Jazzhole yesterday was magical 🎷. My ideal date is someone who can talk about business & finance, but also vibe to Fela, Burna and Asa with their whole soul.',
    category: 'weekend_vibes',
    photoUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    likesCount: 31,
    hasLiked: false,
    timestamp: Date.now() - 1000 * 60 * 420, // 7 hours ago
    comments: []
  }
];
