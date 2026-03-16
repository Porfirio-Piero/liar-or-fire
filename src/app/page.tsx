"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Pin, 
  Trash2, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Plus,
  TrendingUp,
  Clock,
  ArrowUp,
  Filter,
  Search,
  Bell,
  User,
  ChevronDown,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Categories
const categories = [
  { id: "all", name: "All", icon: "🔥", color: "#8b5cf6" },
  { id: "tech", name: "Tech & Gadgets", icon: "💻", color: "#3b82f6" },
  { id: "gaming", name: "Gaming", icon: "🎮", color: "#10b981" },
  { id: "fashion", name: "Fashion", icon: "👗", color: "#ec4899" },
  { id: "food", name: "Food & Drinks", icon: "🍕", color: "#f97316" },
  { id: "beauty", name: "Beauty", icon: "💄", color: "#f43f5e" },
  { id: "fitness", name: "Fitness", icon: "💪", color: "#06b6d4" },
  { id: "travel", name: "Travel", icon: "✈️", color: "#0ea5e9" },
  { id: "finance", name: "Finance", icon: "💰", color: "#22c55e" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "#a855f7" },
  { id: "home", name: "Home & Living", icon: "🏠", color: "#f59e0b" },
  { id: "automotive", name: "Automotive", icon: "🚗", color: "#64748b" },
];

// Sample posts
const samplePosts = [
  {
    id: "1",
    title: "Apple Vision Pro - Is it worth $3,499?",
    description: "I've been testing the Vision Pro for 2 weeks. Here's my honest take on whether it lives up to the hype...",
    category: "tech",
    author: { username: "techreviewer", avatar: null },
    imageUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d4a9?w=800",
    productUrl: "https://apple.com/vision-pro",
    price: "$3,499",
    brand: "Apple",
    fireVotes: 234,
    liarVotes: 89,
    trashVotes: 12,
    commentCount: 156,
    createdAt: "2 hours ago",
    isVerified: true,
  },
  {
    id: "2",
    title: "Stanley Cup Dupe - $40 vs $45",
    description: "Found this Stanley cup dupe on Amazon. Is it as good as the original? Let's find out!",
    category: "home",
    author: { username: "budgetfinder", avatar: null },
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    productUrl: "https://amazon.com/stanley-dupe",
    price: "$40",
    brand: "Generic",
    fireVotes: 567,
    liarVotes: 234,
    trashVotes: 45,
    commentCount: 89,
    createdAt: "4 hours ago",
    isVerified: false,
  },
  {
    id: "3",
    title: "PS5 Pro - Better graphics or waste of money?",
    description: "Sony just announced the PS5 Pro. Is it worth upgrading from your current PS5?",
    category: "gaming",
    author: { username: "gamerz", avatar: null },
    imageUrl: "https://images.unsplash.com/photo-1606144044134-47ea0ab28d7b?w=800",
    productUrl: "https://playstation.com/ps5-pro",
    price: "$699",
    brand: "Sony",
    fireVotes: 445,
    liarVotes: 234,
    trashVotes: 89,
    commentCount: 234,
    createdAt: "6 hours ago",
    isVerified: true,
  },
  {
    id: "4",
    title: "Shein Quality Test - Is the $5 dress worth it?",
    description: "Ordered 10 items from Shein to test the quality. Some surprises, some disappointments...",
    category: "fashion",
    author: { username: "fashionista", avatar: null },
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    productUrl: "https://shein.com",
    price: "$5-20",
    brand: "Shein",
    fireVotes: 123,
    liarVotes: 456,
    trashVotes: 234,
    commentCount: 178,
    createdAt: "8 hours ago",
    isVerified: false,
  },
];

// Comments
const sampleComments = [
  {
    id: "1",
    author: "realitycheck",
    content: "Bought this last month. Total waste of money. The screen quality is nowhere near what they advertised.",
    fireVotes: 45,
    liarVotes: 12,
    createdAt: "1 hour ago",
    isVerified: true,
  },
  {
    id: "2",
    author: "techfan2024",
    content: "Actually been using it daily for work. The spatial computing is game-changing for productivity.",
    fireVotes: 89,
    liarVotes: 23,
    createdAt: "2 hours ago",
    isVerified: true,
    imageUrl: "https://images.unsplash.com/photo-1593062096033-9a0a6c6e0ab8?w=400",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("hot");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<typeof samplePosts[0] | null>(null);

  const totalVotes = (post: typeof samplePosts[0]) => post.fireVotes + post.liarVotes + post.trashVotes;
  const firePercentage = (post: typeof samplePosts[0]) => Math.round((post.fireVotes / totalVotes(post)) * 100);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Liar or Fire
            </h1>
            <span className="text-xs text-zinc-500 hidden sm:block">Is it worth the hype?</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-violet-500 text-white placeholder:text-zinc-500"
              />
            </div>
            
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            
            <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors relative">
              <Bell className="h-5 w-5 text-zinc-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
            </button>
            
            <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <User className="h-5 w-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Categories */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">Categories</h3>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                      selectedCategory === cat.id
                        ? "bg-gradient-to-r from-violet-600/20 to-pink-600/20 text-white border border-violet-500/50"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Stats */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Members</span>
                  <span className="text-white font-medium">12.4K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Products</span>
                  <span className="text-white font-medium">8.2K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Votes</span>
                  <span className="text-white font-medium">245K</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Sort & Filter Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy("hot")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sortBy === "hot"
                    ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Flame className="h-4 w-4" />
                Hot
              </button>
              <button
                onClick={() => setSortBy("new")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sortBy === "new"
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Clock className="h-4 w-4" />
                New
              </button>
              <button
                onClick={() => setSortBy("top")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sortBy === "top"
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Top
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {samplePosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <div className="flex">
                  {/* Vote Buttons */}
                  <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/50 border-r border-zinc-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle vote
                      }}
                      className="p-2 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:scale-110 transition-all vote-btn fire"
                    >
                      <Flame className="h-5 w-5" />
                    </button>
                    <span className="my-2 text-sm font-bold text-white">{totalVotes(post)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle vote
                      }}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all vote-btn liar"
                    >
                      <Pin className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle vote
                      }}
                      className="mt-1 p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:scale-110 transition-all vote-btn trash"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    {/* Category & Author */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-lg text-xs font-medium"
                        style={{ 
                          backgroundColor: categories.find(c => c.id === post.category)?.color + "20",
                          color: categories.find(c => c.id === post.category)?.color 
                        }}
                      >
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      {post.isVerified && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified Purchase
                        </span>
                      )}
                      <span className="text-zinc-500 text-xs">•</span>
                      <span className="text-zinc-500 text-xs">Posted by u/{post.author.username}</span>
                      <span className="text-zinc-500 text-xs">•</span>
                      <span className="text-zinc-500 text-xs">{post.createdAt}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Product Info */}
                    <div className="flex items-center gap-4 mb-3">
                      {post.price && (
                        <span className="text-emerald-400 font-semibold">{post.price}</span>
                      )}
                      {post.brand && (
                        <span className="text-zinc-500 text-sm">{post.brand}</span>
                      )}
                    </div>

                    {/* Image */}
                    {post.imageUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden bg-zinc-800">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">{post.commentCount} comments</span>
                      </button>
                      <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">Share</span>
                      </button>
                      <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                        <Bookmark className="h-4 w-4" />
                        <span className="text-sm">Save</span>
                      </button>
                      
                      {/* Vote Breakdown */}
                      <div className="ml-auto flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          <span className="text-orange-400">{post.fireVotes}</span>
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="text-red-400">{post.liarVotes}</span>
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                          <span className="text-zinc-400">{post.trashVotes}</span>
                        </span>
                      </div>

                      {/* Fire Percentage Bar */}
                      <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
                          style={{ width: `${firePercentage(post)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-orange-400">{firePercentage(post)}% Fire</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Create Post CTA */}
            <div className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-violet-500/30 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Know a product?</h3>
              <p className="text-zinc-400 text-sm mb-4">Share your experience and help others make better decisions.</p>
              <Button
                onClick={() => setShowCreatePost(true)}
                className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            {/* Trending */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending Now
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-bold">1</span>
                  <div>
                    <p className="text-sm text-white">Apple Vision Pro</p>
                    <p className="text-xs text-zinc-500">2.4K votes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-bold">2</span>
                  <div>
                    <p className="text-sm text-white">Stanley Cup Dupe</p>
                    <p className="text-xs text-zinc-500">1.8K votes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-bold">3</span>
                  <div>
                    <p className="text-sm text-white">PS5 Pro</p>
                    <p className="text-xs text-zinc-500">1.5K votes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">Community Rules</h3>
              <ol className="space-y-2 text-sm text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-violet-400">1.</span>
                  <span>Be honest about your experience</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400">2.</span>
                  <span>Provide evidence when possible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400">3.</span>
                  <span>No affiliate link spamming</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400">4.</span>
                  <span>Respect others' opinions</span>
                </li>
              </ol>
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Create Post</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                <select className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-violet-500">
                  {categories.filter(c => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Is [Product Name] worth the hype?"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Your Experience</label>
                <textarea
                  rows={4}
                  placeholder="Share your honest experience with this product. Include pros, cons, and whether you'd recommend it."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Add Image</label>
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-violet-500 transition-colors cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-zinc-400 text-sm">Drag & drop an image or click to upload</p>
                  <p className="text-zinc-500 text-xs mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Product URL */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Product Link (Optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="url"
                    placeholder="https://example.com/product"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Price & Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Price</label>
                  <input
                    type="text"
                    placeholder="$99"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Brand</label>
                  <input
                    type="text"
                    placeholder="Brand name"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500">
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Discussion</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            <div className="p-6">
              {/* Post Content */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">{selectedPost.title}</h1>
                <p className="text-zinc-400">{selectedPost.description}</p>
                {selectedPost.imageUrl && (
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full rounded-xl mt-4"
                  />
                )}
              </div>

              {/* Vote Summary */}
              <div className="bg-zinc-800/50 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Vote Results</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-orange-400 font-medium">🔥 Fire {selectedPost.fireVotes}</span>
                      <span className="text-red-400 font-medium">🤥 Liar {selectedPost.liarVotes}</span>
                    </div>
                    <div className="h-4 bg-zinc-700 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                        style={{ width: `${firePercentage(selectedPost)}%` }}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                        style={{ width: `${100 - firePercentage(selectedPost)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{firePercentage(selectedPost)}%</div>
                    <div className="text-xs text-zinc-500">Fire Rate</div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Comments ({selectedPost.commentCount})</h3>
                
                {/* Add Comment */}
                <div className="mb-6">
                  <textarea
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                      <ImageIcon className="h-4 w-4" />
                      Add Image
                    </button>
                    <Button className="bg-gradient-to-r from-violet-600 to-pink-600">
                      Comment
                    </Button>
                  </div>
                </div>

                {/* Comment List */}
                <div className="space-y-4">
                  {sampleComments.map((comment) => (
                    <div key={comment.id} className="bg-zinc-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">u/{comment.author}</span>
                        {comment.isVerified && (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                        <span className="text-zinc-500 text-xs">•</span>
                        <span className="text-zinc-500 text-xs">{comment.createdAt}</span>
                      </div>
                      <p className="text-zinc-300 mb-3">{comment.content}</p>
                      {comment.imageUrl && (
                        <img
                          src={comment.imageUrl}
                          alt="Comment"
                          className="max-w-md rounded-lg mb-3"
                        />
                      )}
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-zinc-500 hover:text-orange-400 transition-colors">
                          <Flame className="h-4 w-4" />
                          {comment.fireVotes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-zinc-500 hover:text-red-400 transition-colors">
                          <Pin className="h-4 w-4" />
                          {comment.liarVotes}
                        </button>
                        <button className="text-sm text-zinc-500 hover:text-white transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}