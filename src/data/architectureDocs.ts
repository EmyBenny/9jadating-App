export interface DocSection {
  id: string;
  title: string;
  summary: string;
  badge: string;
  content: string;
  codeBlocks?: { language: string; filename: string; code: string }[];
}

export const ARCHITECTURE_DOCUMENTATION: DocSection[] = [
  {
    id: 'architecture',
    title: '1. Updated Architecture & Scaled Infrastructure (MVP 2)',
    badge: 'System Design',
    summary: 'Cloud-first mobile architecture expanded with Paystack payment gateway, voice note audio processing, and analytics telemetry.',
    content: `
### MVP 2 Architecture Overview
Building on MVP 1's serverless foundation, Tender MVP 2 integrates **Paystack (and Flutterwave)** for recurring Naira (₦) payments, an audio processing pipeline for **Voice Notes**, an enhanced **Biometric Liveness Verification Engine**, and an event telemetry bus for conversion analytics.

\`\`\`
       +-------------------------------------------------------------+
       |               FLUTTER / REACT NATIVE CLIENT                 |
       |  - Voice Note Audio Recorder/Player   - Live Radar Nearby   |
       |  - Undo Swipe & Boost Controller      - Paystack Checkout   |
       +-------------------------------------------------------------+
                     |                          |                 |
            (Auth / SMS OTP)            (Firestore SDK)     (Media/Voice)
                     v                          v                 v
       +---------------------+   +---------------------+   +---------------------+
       |   FIREBASE AUTH     |   |   CLOUD FIRESTORE   |   |   CLOUD STORAGE     |
       | - +234 Phone (Termii|   | - Users & Subscriptions | - Voice Notes (.m4a)|
       |   fallback & DND)   |   | - Top Picks / Nearby|   | - WebP Photos       |
       | - Google Sign-in    |   | - Likes You Feed    |   | - Liveness Selfies  |
       +---------------------+   +---------------------+   +---------------------+
                                            |                         |
                                  (Firestore Triggers)                |
                                            v                         v
       +---------------------+   +---------------------+   +---------------------+
       |  PAYSTACK GATEWAY   |<->|  CLOUD FUNCTIONS    |   | AUDIO TRANSCODER    |
       | - Naira Subscriptions   | - verifyPaystackHook|   | - Compress to 32kbps|
       | - Verve/Mastercard  |   | - onSwipeCreated    |   |   Opus / AAC        |
       | - USSD & Transfer   |   | - onVoiceNoteSent   |   +---------------------+
       +---------------------+   | - calculateTopPicks |
                                 | - expireBoostTimer  |
                                 +---------------------+
                                            |
                                            v
                                 +---------------------+
                                 | FIREBASE CLOUD MSG  |
                                 | - "Someone Liked U" |
                                 | - Boost & Match Push|
                                 +---------------------+
\`\`\`
`,
    codeBlocks: [
      {
        language: 'typescript',
        filename: 'functions/src/paystackWebhook.ts',
        code: `import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const db = admin.firestore();

export const paystackWebhook = functions.https.onRequest(async (req, res) => {
  // 1. Verify Paystack HMAC-SHA512 signature
  const signature = req.headers['x-paystack-signature'];
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== signature) {
    res.status(401).send('Invalid signature');
    return;
  }

  const event = req.body;
  if (event.event === 'charge.success') {
    const data = event.data;
    const userId = data.metadata?.userId;
    const planId = data.metadata?.planId; // e.g. 'tender_plus_monthly'
    const durationDays = planId === 'tender_plus_weekly' ? 7 : planId === 'tender_plus_monthly' ? 30 : 90;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // 2. Provision Tender Plus subscription in Firestore
    await db.collection('users').doc(userId).update({
      'subscription.isSubscribed': true,
      'subscription.planId': planId,
      'subscription.expiresAt': admin.firestore.Timestamp.fromDate(expiresAt),
      'subscription.unlimitedSwipes': true,
      'subscription.canSeeWhoLikedYou': true,
      'subscription.superlikesDaily': 5,
      'subscription.boostsRemaining': admin.firestore.FieldValue.increment(1),
    });

    // 3. Record transaction receipt
    await db.collection('transactions').add({
      userId,
      amountNgn: data.amount / 100,
      reference: data.reference,
      channel: data.channel,
      paidAt: admin.firestore.Timestamp.fromDate(new Date(data.paid_at)),
      status: 'success',
    });
  }

  res.status(200).send('Webhook handled');
});`
      }
    ]
  },
  {
    id: 'data-models',
    title: '2. Updated Data Models & Schema (MVP 2)',
    badge: 'Database Schema',
    summary: 'Expanded NoSQL collections with advanced filters, voice notes, subscriptions, and liveness verification.',
    content: `
### Firestore Collection Schemas

- **\`users/{userId}\`**: Adds \`heightCm\`, \`tribe\`, \`religion\`, \`drinking\`, \`smoking\`, \`voicePrompt\`, and \`subscription\` object.
- **\`likes/{fromUid}_{toUid}\`**: Allows populating the "Likes You" feed with high indexing efficiency.
- **\`matches/{matchId}/messages/{messageId}\`**: Adds \`voiceNote\` metadata, \`replyTo\`, and \`reactions\`.
- **\`subscriptions/{subId}\`**: Stores Paystack authorization tokens for recurring Naira charges.
- **\`analytics_events/{eventId}\`**: Stores conversion metrics (\`match_rate\`, \`chat_response_time\`, \`boost_used\`).
`,
    codeBlocks: [
      {
        language: 'typescript',
        filename: 'src/types/schema_mvp2.ts',
        code: `export interface UserProfileV2 {
  uid: string;
  phoneNumber: string;            // +234 E.164
  displayName: string;
  age: number;
  gender: 'male' | 'female' | 'non_binary';
  photos: string[];
  bio: string;
  location: {
    city: string;
    state: string;
    zone: 'Mainland' | 'Island' | 'Central';
    neighborhood: string;
    coordinates: { latitude: number; longitude: number };
  };
  // MVP 2 Advanced Fields
  heightCm?: number;
  tribe?: 'Yoruba' | 'Igbo' | 'Hausa' | 'Edo/Benin' | 'Efik/Ibibio' | 'Ijaw' | 'Other';
  religion?: 'Christianity' | 'Islam' | 'Traditional' | 'Spiritual' | 'Prefer not to say';
  drinking?: 'Never' | 'Socially' | 'Regularly';
  smoking?: 'Never' | 'Socially' | 'Regularly';
  lookingFor: 'marriage' | 'serious' | 'casual' | 'friendship' | 'open';
  voicePrompt?: {
    prompt: string;
    audioUrl: string;
    durationSeconds: number;
  };
  verified: boolean;
  verificationMethod?: 'selfie_gesture_v2';
  verificationConfidence?: number; // e.g. 0.987
  // Subscription & Monetization state
  subscription: {
    isSubscribed: boolean;
    planId?: 'tender_plus_weekly' | 'tender_plus_monthly' | 'tender_gold_quarterly';
    expiresAt?: FirebaseFirestore.Timestamp;
    boostsRemaining: number;
    activeBoostUntil?: FirebaseFirestore.Timestamp;
    superlikesDaily: number;
    unlimitedSwipes: boolean;
    canSeeWhoLikedYou: boolean;
  };
}

export interface ChatMessageV2 {
  id: string;
  matchId: string;
  senderId: string;
  text?: string;
  photoUrl?: string;
  voiceNote?: {
    audioUrl: string;
    durationSeconds: number;
  };
  replyTo?: {
    messageId: string;
    text: string;
    senderName: string;
  };
  reactions?: Record<string, string>; // emoji -> count
  createdAt: FirebaseFirestore.Timestamp;
  status: 'sent' | 'delivered' | 'read';
}`
      }
    ]
  },
  {
    id: 'screens',
    title: '3. New Screens and Flows Breakdown',
    badge: 'UI Specifications',
    summary: 'Detailed specifications for new screens in MVP 2.',
    content: `
### 1. "Likes You" Discovery Hub
- **Purpose**: Displays profiles who have swiped right on the current user.
- **Free Tier State**: Profiles are softly blurred with localized prompt: *"5 people in Lagos enter your eye! Unlock Tender Plus to match immediately."*
- **Subscribed State**: Crystal-clear photos with single-tap "Instant Match" or "Pass".

### 2. Daily "Top Picks" Screen
- **Purpose**: High-compatibility profiles tailored by religion, education, and neighborhood.
- **Refresh Cycle**: Re-computes daily at 12:00 AM West Africa Time (WAT).
- **Badges**: Shows "Top Pick", profession, and verified status.

### 3. "Near Me" Neighborhood Radar
- **Purpose**: City-level and neighborhood proximity view (Lekki Phase 1, Victoria Island, Ikeja GRA, Yaba, Maitama, Jabi Lake).
- **Zone Filters**: Island vs. Mainland switcher to overcome Lagos traffic constraints.

### 4. In-Chat Voice Note Studio
- **Mic Button**: Hold or tap to record with live timer and dynamic sound wave preview.
- **Playable Bubble**: Displays audio waveforms, play/pause toggle, and duration counter.

### 5. Multi-Step Biometric Selfie Verification
- **Challenge 1**: Turn head slightly left (anti-spoof 3D liveness check).
- **Challenge 2**: Give a warm natural smile (facial landmark muscle verification).
- **Challenge 3**: Hold up peace sign ✌️ gesture (human hand liveness check).
- **Outcome**: Confers official golden **Naija Verified** badge.

### 6. Tender Plus / Paystack Subscription Flow
- **Package Selection**: Weekly (₦3,500), Monthly (₦9,500), Quarterly (₦24,000).
- **Channels**: Nigerian Debit Cards (Mastercard, Visa, Verve), Direct Bank Transfer, and Bank USSD.
`
  },
  {
    id: 'monetization',
    title: '4. Subscription & Payment Flow Details',
    badge: 'Monetization Architecture',
    summary: 'Handling Nigerian online payments with Paystack, managing Verve cards, and local currency handling.',
    content: `
### Paystack / Flutterwave Architecture Strategy

1. **Local Pricing Anchor in Naira (₦)**:
   - Apple App Store & Google Play foreign exchange conversion causes 40%+ card failure rates in Nigeria due to central bank FX limits.
   - Using Paystack Web/Mobile SDK allows direct debit in Naira via local switches (Interswitch, NIBSS).

2. **Supported Payment Channels**:
   - **Nigerian Debit Cards**: Full support for local **Verve cards** (which fail on international processors) as well as local Mastercard and Visa.
   - **Bank Transfer via Paystack-Titan Virtual Account**: Dynamic virtual account generation for users who prefer bank app transfers.
   - **USSD**: Dialing string generated for GTBank (*737#), Zenith (*966#), Access (*901#).

3. **Recurring Subscription Lifecycle**:
   - Save Paystack authorization token (\`auth_code\`) on successful first charge.
   - Run a daily Cloud Function cron job at 3:00 AM WAT to renew expiring subscriptions.
   - Send WhatsApp or SMS renewal receipt with instant cancellation link.
`
  },
  {
    id: 'priority-order',
    title: '5. MVP 2 Suggested Implementation Priority',
    badge: 'Roadmap & Sprints',
    summary: 'Recommended shipping order to maximize revenue and user retention.',
    content: `
### Sprint 1: Voice Notes & Enhanced Chat (Days 1–4)
- [x] Voice note recorder with M4A/AAC compression.
- [x] Message replies (quote bubble) and emoji reactions.
- [x] Read receipts and Naija icebreaker drawer.

### Sprint 2: Paystack Subscriptions & "Likes You" (Days 5–8)
- [x] Tender Plus paywall UI with Naira pricing (₦3,500/wk, ₦9,500/mo).
- [x] Paystack webhook integration for subscription provisioning.
- [x] "Likes You" feed with blur-to-unlock mechanism.

### Sprint 3: Advanced Discovery (Tribe, Religion & Top Picks) (Days 9–12)
- [x] Advanced filter modal (Tribe, Religion, Height, Goals).
- [x] Daily Top Picks curated generator.
- [x] "Near Me" neighborhood radar with Mainland vs Island zones.

### Sprint 4: Biometric Liveness Verification & Safety Center (Days 13–16)
- [x] 3-step gesture selfie challenge (turn head, smile, peace sign).
- [x] Dedicated Safety Center (offline dating tips, scam warnings).
- [x] Unmatch with feedback reason.
`
  },
  {
    id: 'nigerian-market',
    title: '6. Key Edge Cases & Nigerian Market Nuances',
    badge: 'Cultural & Market Insights',
    summary: 'Navigating ethnic sensitivities, payment rails, and safety in Nigeria.',
    content: `
### 1. Cultural Sensitivity on Tribe & Religion Filters
- **The Context**: In Nigeria, ethnic origin (Yoruba, Igbo, Hausa, Edo, etc.) and religion (Christianity, Islam) are genuinely influential factors in long-term marriage decisions for families.
- **Design Rule**:
  - Always make Tribe and Religion **100% optional**.
  - Frame the copy respectfully: *"Share your cultural heritage (optional)"* rather than mandatory labeling.
  - Never allow discriminatory harassment in bio; provide an explicit report option for hate speech.

### 2. High Prevalence of Verve Cards
- Over 40% of Nigerian banked youth hold Verve debit cards issued by domestic banks.
- International gateways like Stripe fail on Verve. Paystack and Flutterwave provide native Interswitch routing ensuring 95%+ first-attempt success.

### 3. Voice Notes as a Primary Trust Mechanism
- Nigerian daters heavily distrust text-only profiles due to catfishing. A 10-second voice note introducing oneself provides immediate acoustic verification of accent, personality, and authenticity.

### 4. Offline Date Safety: Anti-Urgent 2K
- Romance scams in Nigeria frequently take the form of "Urgent 2k" (asking for emergency transport money or phone credit prior to a first date).
- The in-app Safety Center explicitly flags this pattern, reducing user loss and protecting community trust.
`
  }
];
