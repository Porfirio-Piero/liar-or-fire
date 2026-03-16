'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Flame, Pin, Trash2, MessageSquare, Upload, X, CheckCircle2,
  Plus, TrendingUp, Clock, Search, Bell, User,
  Image as ImageIcon, Link as LinkIcon, Shield, LogOut, Users, BarChart3, FileText
} from 'lucide-react';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: string;
  isAdmin: boolean;
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  imageUrl?: string;
  fireVotes: number;
  liarVotes: number;
  createdAt: string;
}

interface Post {
  id: string;
  authorId: string;
  authorUsername: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  productUrl?: string;
  price?: string;
  brand?: string;
  fireVotes: number;
  liarVotes: number;
  trashVotes: number;
  commentCount: number;
  createdAt: string;
  isVerified: boolean;
}

interface Vote {
  userId: string;
  postId: string;
  voteType: 'fire' | 'liar' | 'trash';
}

// Categories
const categories = [
  { id: 'all', name: 'All', icon: '🔥', color: '#8b5cf6' },
  { id: 'tech', name: 'Tech & Gadgets', icon: '💻', color: '#3b82f6' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', color: '#10b981' },
  { id: 'fashion', name: 'Fashion', icon: '👗', color: '#ec4899' },
  { id: 'food', name: 'Food & Drinks', icon: '🍕', color: '#f97316' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: '#f43f5e' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: '#06b6d4' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#0ea5e9' },
  { id: 'finance', name: 'Finance', icon: '💰', color: '#22c55e' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#a855f7' },
  { id: 'home', name: 'Home & Living', icon: '🏠', color: '#f59e0b' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', color: '#64748b' },
];

// Storage helpers
const STORAGE_KEYS = {
  users: 'liar_or_fire_users',
  posts: 'liar_or_fire_posts',
  comments: 'liar_or_fire_comments',
  votes: 'liar_or_fire_votes',
  currentUser: 'liar_or_fire_current_user',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const ADMIN_PASSWORD = 'liarorfire2024';

export default function LiarOrFire() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '', description: '', category: 'tech', productUrl: '', price: '', brand: ''
  });
  const [newComment, setNewComment] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    setCurrentUser(loadFromStorage(STORAGE_KEYS.currentUser, null));
    setPosts(loadFromStorage(STORAGE_KEYS.posts, []));
    setComments(loadFromStorage(STORAGE_KEYS.comments, []));
    setVotes(loadFromStorage(STORAGE_KEYS.votes, []));
  }, []);

  // Save data
  useEffect(() => { saveToStorage(STORAGE_KEYS.posts, posts); }, [posts]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.comments, comments); }, [comments]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.votes, votes); }, [votes]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.currentUser, currentUser); }, [currentUser]);

  // Auth
  const handleSignUp = () => {
    if (!authEmail || !authPassword || !authUsername) return;
    const users = loadFromStorage<User[]>(STORAGE_KEYS.users, []);
    if (users.find(u => u.email === authEmail || u.username === authUsername)) {
      alert('Email or username already exists');
      return;
    }
    const newUser: User = {
      id: generateId(), email: authEmail, password: authPassword, username: authUsername,
      createdAt: new Date().toISOString(), isAdmin: false
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.users, users);
    setCurrentUser(newUser);
    setShowAuth(false);
    setAuthEmail(''); setAuthPassword(''); setAuthUsername('');
  };

  const handleLogin = () => {
    const users = loadFromStorage<User[]>(STORAGE_KEYS.users, []);
    const user = users.find(u => (u.email === authEmail || u.username === authEmail) && u.password === authPassword);
    if (!user) { alert('Invalid credentials'); return; }
    setCurrentUser(user);
    setShowAuth(false);
    setAuthEmail(''); setAuthPassword('');
  };

  const handleLogout = () => setCurrentUser(null);

  const handleAdminLogin = () => {
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setShowAdmin(true);
      setAdminPasswordInput('');
    } else {
      alert('Invalid admin password');
    }
  };

  // Image upload
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  // Posts
  const createPost = () => {
    if (!currentUser) { setShowAuth(true); return; }
    if (!newPost.title.trim() || !newPost.description.trim()) return;
    const post: Post = {
      id: generateId(), authorId: currentUser.id, authorUsername: currentUser.username,
      title: newPost.title, description: newPost.description, category: newPost.category,
      imageUrl: uploadedImage || undefined, productUrl: newPost.productUrl || undefined,
      price: newPost.price || undefined, brand: newPost.brand || undefined,
      fireVotes: 0, liarVotes: 0, trashVotes: 0, commentCount: 0,
      createdAt: new Date().toISOString(), isVerified: false
    };
    setPosts([post, ...posts]);
    setShowCreatePost(false);
    setNewPost({ title: '', description: '', category: 'tech', productUrl: '', price: '', brand: '' });
    setUploadedImage(null);
  };

  const handleVote = (postId: string, voteType: 'fire' | 'liar' | 'trash') => {
    if (!currentUser) { setShowAuth(true); return; }
    const existingVote = votes.find(v => v.postId === postId && v.userId === currentUser.id);
    
    if (existingVote) {
      setVotes(votes.filter(v => !(v.postId === postId && v.userId === currentUser.id)));
      setPosts(posts.map(p => {
        if (p.id === postId) {
          const key = (existingVote.voteType + 'Votes') as keyof Post;
          const currentValue = p[key] as number;
          return { ...p, [key]: currentValue - 1 };
        }
        return p;
      }));
    }

    if (!existingVote || existingVote.voteType !== voteType) {
      const newVote: Vote = { userId: currentUser.id, postId, voteType };
      setVotes([...votes, newVote]);
      setPosts(posts.map(p => {
        if (p.id === postId) {
          const key = (voteType + 'Votes') as keyof Post;
          const currentValue = p[key] as number;
          return { ...p, [key]: currentValue + 1 };
        }
        return p;
      }));
    }
  };

  const getUserVote = (postId: string): 'fire' | 'liar' | 'trash' | null => {
    if (!currentUser) return null;
    const vote = votes.find(v => v.postId === postId && v.userId === currentUser.id);
    return vote?.voteType || null;
  };

  // Comments
  const addComment = () => {
    if (!currentUser) { setShowAuth(true); return; }
    if (!selectedPost || !newComment.trim()) return;
    const comment: Comment = {
      id: generateId(), postId: selectedPost.id, authorId: currentUser.id, authorUsername: currentUser.username,
      content: newComment, imageUrl: commentImage || undefined, fireVotes: 0, liarVotes: 0,
      createdAt: new Date().toISOString()
    };
    setComments([comment, ...comments]);
    setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, commentCount: p.commentCount + 1 } : p));
    setNewComment('');
    setCommentImage(null);
  };

  const handleCommentVote = (commentId: string, voteType: 'fire' | 'liar') => {
    if (!currentUser) { setShowAuth(true); return; }
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const key = (voteType + 'Votes') as keyof Comment;
        const currentValue = c[key] as number;
        return { ...c, [key]: currentValue + 1 };
      }
      return c;
    }));
  };

  // Filter and sort
  const filteredPosts = posts
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'new') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'top') return (b.fireVotes + b.liarVotes) - (a.fireVotes + a.liarVotes);
      const scoreA = (a.fireVotes - a.liarVotes) / Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / 3600000);
      const scoreB = (b.fireVotes - b.liarVotes) / Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / 3600000);
      return scoreB - scoreA;
    });

  const totalVotes = (post: Post) => post.fireVotes + post.liarVotes + post.trashVotes;
  const firePercentage = (post: Post) => Math.round((post.fireVotes / Math.max(1, totalVotes(post))) * 100);
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent cursor-pointer" onClick={() => setSelectedPost(null)}>
              Liar or Fire
            </h1>
            <span className="text-xs text-zinc-500 hidden sm:block">Is it worth the hype?</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-violet-500" />
            </div>
            {currentUser ? (
              <>
                <button onClick={() => setShowCreatePost(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-medium hover:opacity-90">
                  <Plus className="h-4 w-4" /><span className="hidden sm:inline">Post</span>
                </button>
                <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 relative">
                  <Bell className="h-5 w-5 text-zinc-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
                </button>
                {currentUser.isAdmin && (
                  <button onClick={() => setShowAdmin(true)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800">
                    <Shield className="h-5 w-5 text-violet-400" />
                  </button>
                )}
                <button onClick={handleLogout} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800">
                  <LogOut className="h-5 w-5 text-zinc-400" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsSignUp(false); setShowAuth(true); }} className="px-4 py-2 text-zinc-400 hover:text-white">Log in</button>
                <button onClick={() => { setIsSignUp(true); setShowAuth(true); }} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-medium hover:opacity-90">Sign up</button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/50 text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}>
              <span>{cat.icon}</span><span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { id: 'hot', icon: Flame, label: 'Hot' },
            { id: 'new', icon: Clock, label: 'New' },
            { id: 'top', icon: TrendingUp, label: 'Top' },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setSortBy(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                sortBy === id
                  ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
            const userVote = getUserVote(post.id);
            const total = totalVotes(post);
            const firePct = firePercentage(post);
            return (
              <article key={post.id} onClick={() => setSelectedPost(post)}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer group">
                {post.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="px-2 py-0.5 rounded-lg font-medium"
                      style={{ backgroundColor: categories.find(c => c.id === post.category)?.color + '20', color: categories.find(c => c.id === post.category)?.color }}>
                      {categories.find(c => c.id === post.category)?.name}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-500">u/{post.authorUsername}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-500">{formatDate(post.createdAt)}</span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{post.description}</p>
                  {(post.price || post.brand) && (
                    <div className="flex items-center gap-2 mb-3">
                      {post.price && <span className="text-emerald-400 font-semibold">{post.price}</span>}
                      {post.brand && <span className="text-zinc-500 text-sm">{post.brand}</span>}
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-orange-400">🔥 {post.fireVotes}</span>
                      <span className="text-zinc-400">{firePct}% Fire</span>
                      <span className="text-red-400">🤥 {post.liarVotes}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${firePct}%` }} />
                      <div className="h-full bg-gradient-to-r from-red-500 to-pink-500" style={{ width: `${total > 0 ? ((post.liarVotes + post.trashVotes) / total) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'fire'); }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                        userVote === 'fire' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-zinc-800 text-zinc-400 hover:text-orange-400 hover:bg-zinc-700'
                      }`}>
                      <Flame className="h-4 w-4" /><span className="text-sm">Fire</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'liar'); }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                        userVote === 'liar' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700'
                      }`}>
                      <Pin className="h-4 w-4" /><span className="text-sm">Liar</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'trash'); }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                        userVote === 'trash' ? 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/50' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700'
                      }`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="ml-auto flex items-center gap-1 text-zinc-500 text-sm">
                      <MessageSquare className="h-4 w-4" />{post.commentCount}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Flame className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No posts yet</p>
              <p className="text-zinc-600 text-sm mt-1">Be the first to add a product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl my-8">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create Post</h2>
              <button onClick={() => setShowCreatePost(false)} className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                <select value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500">
                  {categories.filter(c => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Title *</label>
                <input type="text" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Is [Product Name] worth the hype?"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Your Experience *</label>
                <textarea value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  rows={4} placeholder="Share your honest experience..."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Image</label>
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-700 hover:border-violet-500'
                  }`}>
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                      <p className="text-zinc-400">Drag & drop or click to upload</p>
                      <p className="text-zinc-500 text-xs mt-1">PNG, JPG up to 10MB</p>
                    </>
                  )}
                  <input id="file-input" type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                </div>
                {uploadedImage && (
                  <button onClick={() => setUploadedImage(null)} className="mt-2 text-sm text-red-400 hover:text-red-300">Remove image</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Price</label>
                  <input type="text" value={newPost.price} onChange={(e) => setNewPost({ ...newPost, price: e.target.value })}
                    placeholder="$99" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Brand</label>
                  <input type="text" value={newPost.brand} onChange={(e) => setNewPost({ ...newPost, brand: e.target.value })}
                    placeholder="Apple, Sony, etc." className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Product Link (Optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input type="url" value={newPost.productUrl} onChange={(e) => setNewPost({ ...newPost, productUrl: e.target.value })}
                    placeholder="https://..." className="w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowCreatePost(false)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
                <button onClick={createPost} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Username</label>
                  <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} placeholder="username"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email or Username</label>
                <input type="text" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500" />
              </div>
              <button onClick={isSignUp ? handleSignUp : handleLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 font-medium">
                {isSignUp ? 'Create Account' : 'Log In'}
              </button>
              <p className="text-center text-zinc-500">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-violet-400 hover:text-violet-300">
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl my-8">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Discussion</h2>
              <button onClick={() => setSelectedPost(null)} className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{selectedPost.title}</h1>
                <p className="text-zinc-400 mb-4">{selectedPost.description}</p>
                {selectedPost.imageUrl && <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full rounded-xl mb-4" />}
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  {selectedPost.price && <span className="text-emerald-400 font-semibold text-base">{selectedPost.price}</span>}
                  {selectedPost.brand && <span>{selectedPost.brand}</span>}
                  <span>•</span>
                  <span>u/{selectedPost.authorUsername}</span>
                  <span>•</span>
                  <span>{formatDate(selectedPost.createdAt)}</span>
                </div>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-400 font-medium">🔥 Fire ({selectedPost.fireVotes})</span>
                  <span className="text-zinc-400">{firePercentage(selectedPost)}% Fire</span>
                  <span className="text-red-400 font-medium">🤥 Liar ({selectedPost.liarVotes})</span>
                </div>
                <div className="h-3 bg-zinc-700 rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${firePercentage(selectedPost)}%` }} />
                  <div className="h-full bg-gradient-to-r from-red-500 to-pink-500" style={{ width: `${100 - firePercentage(selectedPost)}%` }} />
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Add Comment</h3>
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-violet-500 resize-none" />
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => document.getElementById('comment-file-input')?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-400">
                    <ImageIcon className="h-4 w-4" /> Add Image
                  </button>
                  <input id="comment-file-input" type="file" accept="image/*" onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setCommentImage(ev.target?.result as string);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }} className="hidden" />
                  {commentImage && <button onClick={() => setCommentImage(null)} className="text-sm text-red-400 hover:text-red-300">Remove</button>}
                </div>
                {commentImage && <img src={commentImage} alt="Preview" className="max-h-32 mt-2 rounded-lg" />}
                <button onClick={addComment} disabled={!newComment.trim()}
                  className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 disabled:opacity-50">
                  Comment
                </button>
              </div>
              <div className="space-y-4">
                {comments.filter(c => c.postId === selectedPost.id).map((comment) => (
                  <div key={comment.id} className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">u/{comment.authorUsername}</span>
                      <span className="text-zinc-500 text-xs">• {formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-zinc-300 mb-2">{comment.content}</p>
                    {comment.imageUrl && <img src={comment.imageUrl} alt="Comment" className="max-w-md rounded-lg mb-2" />}
                    <div className="flex items-center gap-4 text-sm">
                      <button onClick={() => handleCommentVote(comment.id, 'fire')}
                        className="flex items-center gap-1 text-zinc-500 hover:text-orange-400"><Flame className="h-4 w-4" />{comment.fireVotes}</button>
                      <button onClick={() => handleCommentVote(comment.id, 'liar')}
                        className="flex items-center gap-1 text-zinc-500 hover:text-red-400"><Pin className="h-4 w-4" />{comment.liarVotes}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-6xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl my-8">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-violet-400" />
                <h2 className="text-xl font-semibold">Admin Panel</h2>
              </div>
              <button onClick={() => setShowAdmin(false)} className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-violet-500/10"><Users className="h-5 w-5 text-violet-400" /></div>
                    <div><p className="text-2xl font-bold">{loadFromStorage<User[]>(STORAGE_KEYS.users, []).length}</p><p className="text-sm text-zinc-500">Users</p></div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-orange-500/10"><Flame className="h-5 w-5 text-orange-400" /></div>
                    <div><p className="text-2xl font-bold">{posts.length}</p><p className="text-sm text-zinc-500">Posts</p></div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/10"><MessageSquare className="h-5 w-5 text-blue-400" /></div>
                    <div><p className="text-2xl font-bold">{comments.length}</p><p className="text-sm text-zinc-500">Comments</p></div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10"><BarChart3 className="h-5 w-5 text-emerald-400" /></div>
                    <div><p className="text-2xl font-bold">{votes.length}</p><p className="text-sm text-zinc-500">Votes</p></div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="h-5 w-5" /> Posts</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-800">
                      <tr>
                        <th className="p-3 text-left text-zinc-400">Title</th>
                        <th className="p-3 text-left text-zinc-400">Author</th>
                        <th className="p-3 text-left text-zinc-400">Category</th>
                        <th className="p-3 text-left text-zinc-400">Votes</th>
                        <th className="p-3 text-left text-zinc-400">Date</th>
                        <th className="p-3 text-left text-zinc-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {posts.map(post => (
                        <tr key={post.id} className="hover:bg-zinc-800/50">
                          <td className="p-3">{post.title.substring(0, 30)}...</td>
                          <td className="p-3">u/{post.authorUsername}</td>
                          <td className="p-3">{categories.find(c => c.id === post.category)?.name}</td>
                          <td className="p-3">🔥 {post.fireVotes} / 🤥 {post.liarVotes}</td>
                          <td className="p-3">{formatDate(post.createdAt)}</td>
                          <td className="p-3">
                            <button onClick={() => {
                              if (confirm('Delete this post?')) {
                                setPosts(posts.filter(p => p.id !== post.id));
                                setComments(comments.filter(c => c.postId !== post.id));
                              }
                            }} className="p-1 rounded hover:bg-red-500/20 text-red-400"><Trash2 className="h-4 w-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5" /> Users</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-800">
                      <tr>
                        <th className="p-3 text-left text-zinc-400">Username</th>
                        <th className="p-3 text-left text-zinc-400">Email</th>
                        <th className="p-3 text-left text-zinc-400">Role</th>
                        <th className="p-3 text-left text-zinc-400">Posts</th>
                        <th className="p-3 text-left text-zinc-400">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {loadFromStorage<User[]>(STORAGE_KEYS.users, []).map(user => (
                        <tr key={user.id} className="hover:bg-zinc-800/50">
                          <td className="p-3">u/{user.username}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">
                            {user.isAdmin ? (
                              <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-400">Admin</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-zinc-700 text-zinc-400">User</span>
                            )}
                          </td>
                          <td className="p-3">{posts.filter(p => p.authorId === user.id).length}</td>
                          <td className="p-3">{formatDate(user.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}