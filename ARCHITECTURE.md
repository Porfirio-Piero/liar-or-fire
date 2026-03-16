# Liar-or-Fire v2.0 Architecture

## 🎯 Vision

Transform Liar-or-Fire into a high-engagement social review network with scam detection, marketplace, video, AI, and gamification.

---

## 📊 System Architecture

### Frontend Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Framer Motion
- **Video**: Video.js / Mux Player
- **Animations**: Framer Motion + GSAP
- **State**: Zustand + React Query

### Backend Stack
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Neon) + Redis (Upstash)
- **ORM**: Drizzle ORM
- **Auth**: Clerk
- **Storage**: Uploadthing + Cloudflare R2
- **Video Processing**: Mux / Cloudflare Stream
- **AI**: OpenAI GPT-4 Vision + Claude

### External Services
- **Search**: Algolia / Meilisearch
- **Analytics**: PostHog / Mixpanel
- **Notifications**: Pusher / Liveblocks
- **Email**: Resend

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar TEXT,
  bio TEXT,
  website TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_active TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  is_seller BOOLEAN DEFAULT FALSE,
  seller_rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts (Rateable Items)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  type TEXT NOT NULL, -- 'product', 'video', 'scam', 'poll'
  title TEXT NOT NULL,
  description TEXT,
  media_urls TEXT[], -- Array of image/video URLs
  video_url TEXT,
  thumbnail_url TEXT,
  product_url TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  brand TEXT,
  is_scam_report BOOLEAN DEFAULT FALSE,
  scam_score DECIMAL(5,2), -- 0-100, AI-generated
  scam_probability DECIMAL(5,4), -- 0-1, AI-generated
  fire_votes INTEGER DEFAULT 0,
  liar_votes INTEGER DEFAULT 0,
  trash_votes INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  ai_summary TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#8b5cf6',
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  vote_type TEXT NOT NULL CHECK (vote_type IN ('fire', 'liar', 'trash')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  parent_id UUID REFERENCES comments(id),
  content TEXT NOT NULL,
  media_url TEXT,
  fire_votes INTEGER DEFAULT 0,
  liar_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Follows
CREATE TABLE follows (
  follower_id UUID REFERENCES users(id),
  following_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_required INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Badges
CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Scam Reports
CREATE TABLE scam_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  reporter_id UUID REFERENCES users(id),
  scam_type TEXT NOT NULL,
  website_url TEXT,
  seller_name TEXT,
  seller_phone TEXT,
  seller_email TEXT,
  marketplace TEXT,
  evidence_urls TEXT[],
  ai_confidence DECIMAL(5,4),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace Listings
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  condition TEXT,
  media_urls TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Streaks
CREATE TABLE streaks (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_action_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎮 Gamification System

### XP System
| Action | XP |
|--------|-----|
| Post creation | +10 XP |
| Fire vote | +2 XP |
| Comment | +5 XP |
| Share | +15 XP |
| Scam report verified | +100 XP |
| Daily streak | +25 XP per day |
| Invite friend | +50 XP |
| Level up bonus | +100 XP |

### Levels
| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 | Newbie |
| 2 | 100 | Fire Starter |
| 3 | 500 | Flame Keeper |
| 4 | 1000 | Fire Expert |
| 5 | 2500 | Liar Hunter |
| 6 | 5000 | Scam Detective |
| 7 | 10000 | Truth Master |
| 8 | 25000 | Fire Lord |
| 9 | 50000 | Legendary |
| 10 | 100000 | Mythic |

### Badges
- 🔥 First Fire - Cast your first fire vote
- 🤥 Liar Liar - Cast your first liar vote
- 🗑️ Trash Talker - Cast your first trash vote
- 📸 Photo Evidence - Upload image with post
- 🎥 Video Proof - Upload video with post
- 🛡️ Scam Hunter - Submit verified scam report
- ⭐ Verified - Get verified seller badge
- 🏆 Trending - Have a post hit trending
- 💬 Chatterbox - Leave 100 comments
- 🎯 Sharp Eye - Correctly identify 50 scams

---

## 🤖 AI Features

### Scam Detection
```typescript
interface ScamAnalysis {
  confidence: number; // 0-1
  signals: string[];
  category: 'definite_scam' | 'likely_scam' | 'suspicious' | 'legitimate';
  riskFactors: string[];
  recommendation: string;
}
```

### AI Pipeline
1. **Image Analysis** - Extract text, logos, detect manipulation
2. **Text Analysis** - Sentiment, scam patterns, grammar analysis
3. **Price Analysis** - Compare to market prices
4. **Seller Analysis** - History, reviews, patterns
5. **Cross-Reference** - Check against scam database

---

## 🎨 UI Components

### Animation System
```typescript
// Framer Motion Variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" },
  tap: { scale: 0.98 }
};

const fireVoteVariants = {
  idle: { scale: 1 },
  voting: { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] },
  success: { scale: [1, 1.3, 1], filter: "brightness(1.2)" }
};
```

### Key Components
- `SwipeableCard` - Tinder-style swipe cards
- `VideoPlayer` - TikTok-style video feed
- `VoteButtons` - Animated fire/liar/trash
- `ScamMeter` - Visual scam probability
- `XPMeter` - Animated XP progress
- `BadgeShowcase` - User badges display
- `LeaderboardCard` - Animated rankings
- `NotificationBell` - Real-time notifications
- `TrendingTag` - Animated trending indicator

---

## 📅 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Database schema migration
- [ ] User profiles & authentication
- [ ] Basic post creation
- [ ] Vote system upgrade
- [ ] Category system

### Phase 2: Video & Media (Week 3-4)
- [ ] Video upload pipeline
- [ ] Image upload optimization
- [ ] Thumbnail generation
- [ ] Media gallery component
- [ ] Auto-captions

### Phase 3: Scam Database (Week 5-6)
- [ ] Scam report system
- [ ] AI scam detection
- [ ] Search & filtering
- [ ] Evidence upload
- [ ] Scam graph

### Phase 4: Social Layer (Week 7-8)
- [ ] Follow system
- [ ] Comments & replies
- [ ] Notifications
- [ ] Activity feed
- [ ] Share functionality

### Phase 5: Gamification (Week 9-10)
- [ ] XP system
- [ ] Levels & badges
- [ ] Streaks
- [ ] Leaderboards
- [ ] Daily challenges

### Phase 6: Marketplace (Week 11-12)
- [ ] Seller profiles
- [ ] Listing creation
- [ ] Search & filters
- [ ] Verified seller program
- [ ] Buyer protection

### Phase 7: Polish & Launch (Week 13-14)
- [ ] Animation polish
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Analytics integration
- [ ] Beta testing
- [ ] Launch!

---

## 🚀 Getting Started

This architecture document provides the blueprint. Let me now begin implementing the core features...

---

**Document Version**: 2.0.0  
**Last Updated**: 2026-03-15  
**Status**: Ready for Implementation