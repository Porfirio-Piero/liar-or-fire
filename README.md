# Liar or Fire 🔥

<div align="center">
  <img src="screenshots/landing.png" alt="Liar or Fire" width="100%">
  
  **Is it worth the hype? Vote and find out.**
  
  [![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://liar-or-fire.vercel.app)
  [![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
  [![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge)](https://orm.drizzle.team/)
</div>

---

## 🎯 About

**Liar or Fire** is a Reddit-style social voting platform where users vote on products, services, and trends to determine if they're worth the hype.

### Vote Options

| Emoji | Meaning | Description |
|-------|---------|-------------|
| 🔥 | **Fire** | This is amazing! Worth every penny! |
| 🤥 | **Liar** | Overhyped, doesn't deliver on promises |
| 🗑️ | **Trash** | Avoid at all costs, total waste |

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| **🗳️ Reddit-style Voting** | Upvote/downvote with Fire/Liar/Trash |
| **💬 Comments with Images** | Full comment system with image support |
| **📸 Image Uploads** | Uploadthing integration for post images |
| **📁 12 Categories** | Tech, Gaming, Fashion, Food, Beauty, etc. |
| **👤 User Profiles** | Clerk authentication with karma system |
| **🔍 Search & Filter** | Search posts by title, brand, category |
| **📊 Vote Analytics** | Fire percentage bar and vote breakdown |
| **✅ Verified Purchases** | Badge for verified purchase reviews |
| **🔥 Trending Sidebar** | Top products by votes |
| **📱 Mobile Responsive** | Works on all devices |
| **🌙 Dark Mode** | Beautiful dark theme by default |

### Technical Features

| Feature | Technology |
|---------|------------|
| **Database** | PostgreSQL (Neon) with Drizzle ORM |
| **Auth** | Clerk authentication |
| **Image Upload** | Uploadthing |
| **API** | RESTful API routes |
| **UI** | shadcn/ui components |
| **State** | React hooks with optimistic updates |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database (Neon recommended)
- Clerk account for auth
- Uploadthing account for image uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Porfirio-Piero/liar-or-fire.git
   cd liar-or-fire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   
   # Uploadthing
   UPLOADTHING_SECRET="sk_..."
   UPLOADTHING_APP_ID="..."
   
   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
liar-or-fire/
├── drizzle.config.ts         # Drizzle ORM config
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── posts/         # Posts API
│   │   │   ├── categories/    # Categories API
│   │   │   └── uploadthing/   # Image upload API
│   │   ├── page.tsx           # Main feed page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   └── ui/                # shadcn/ui components
│   └── lib/                   # Utilities
│       ├── db/                # Database schema & client
│       ├── uploadthing.ts     # Uploadthing config
│       └── utils.ts           # Helper functions
└── screenshots/               # App screenshots
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Radix) |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM |
| **Authentication** | Clerk |
| **Image Upload** | Uploadthing |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/posts` | GET | Get all posts (with filtering) |
| `/api/posts` | POST | Create a new post |
| `/api/posts/[id]/vote` | POST | Vote on a post |
| `/api/posts/[id]/comments` | GET | Get comments for a post |
| `/api/posts/[id]/comments` | POST | Create a comment |
| `/api/categories` | GET | Get all categories |
| `/api/uploadthing` | POST | Upload image |

---

## 🗄️ Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `users` | User profiles (linked to Clerk) |
| `posts` | Product/service reviews |
| `comments` | Comments on posts |
| `votes` | User votes on posts/comments |
| `categories` | Post categories |

---

## 🧪 Development

```bash
# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate    # Generate migrations
npm run db:migrate    # Run migrations
npm run db:push        # Push schema to database
npm run db:studio      # Open Drizzle Studio
```

---

## 🗺️ Roadmap

- [ ] User profiles with karma
- [ ] Post editing and deletion
- [ ] Comment replies (nested comments)
- [ ] User badges and achievements
- [ ] Moderator tools
- [ ] Report system
- [ ] Dark/light mode toggle
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this for your own voting platform!

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Clerk](https://clerk.com/) - Authentication made simple
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Uploadthing](https://uploadthing.com/) - File uploads

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Porfirio-Piero">Porfirio-Piero</a>
  
  **[⬆ Back to Top](#liar-or-fire-)**
</div>