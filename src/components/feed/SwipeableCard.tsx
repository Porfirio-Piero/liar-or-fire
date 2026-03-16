"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Flame, Pin, Trash2, MessageSquare, Share2, Bookmark, Eye } from "lucide-react";

interface SwipeableCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  category?: { name: string; color: string; icon?: string };
  author?: { username: string; avatar?: string };
  fireVotes: number;
  liarVotes: number;
  trashVotes: number;
  commentCount: number;
  viewCount?: number;
  isVerified?: boolean;
  onVote?: (type: "fire" | "liar" | "trash") => void;
  onClick?: () => void;
}

export function SwipeableCard({
  id,
  title,
  description,
  imageUrl,
  videoUrl,
  category,
  author,
  fireVotes,
  liarVotes,
  trashVotes,
  commentCount,
  viewCount = 0,
  isVerified = false,
  onVote,
  onClick,
}: SwipeableCardProps) {
  const [direction, setDirection] = useState<"fire" | "liar" | "trash" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [exitX, setExitX] = useState(0);
  
  const totalVotes = fireVotes + liarVotes + trashVotes;
  const firePercentage = totalVotes > 0 ? Math.round((fireVotes / totalVotes) * 100) : 0;

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      setDirection("fire");
      setExitX(1000);
      setTimeout(() => onVote?.("fire"), 300);
    } else if (info.offset.x < -threshold) {
      setDirection("liar");
      setExitX(-1000);
      setTimeout(() => onVote?.("liar"), 300);
    } else if (info.offset.y < -threshold) {
      setDirection("trash");
      setExitX(0);
      setTimeout(() => onVote?.("trash"), 300);
    }
  };

  const handleVoteClick = (type: "fire" | "liar" | "trash") => {
    setDirection(type);
    setExitX(type === "fire" ? 1000 : type === "liar" ? -1000 : 0);
    setTimeout(() => onVote?.(type), 300);
  };

  return (
    <div className="relative w-full h-[calc(100vh-200px)]">
      <AnimatePresence>
        <motion.div
          key={id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ 
            x: exitX, 
            opacity: 0,
            scale: 0.8,
          }}
          drag={isDragging ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          onDrag={() => setIsDragging(true)}
          whileDrag={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl"
        >
          {/* Media */}
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : null}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Swipe Indicators */}
          <AnimatePresence>
            {direction === "fire" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-orange-500/80"
              >
                <Flame className="w-32 h-32 text-white animate-bounce" />
              </motion.div>
            )}
            {direction === "liar" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-purple-500/80"
              >
                <Pin className="w-32 h-32 text-white animate-bounce" />
              </motion.div>
            )}
            {direction === "trash" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-zinc-700/80"
              >
                <Trash2 className="w-32 h-32 text-white animate-bounce" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Category & Verification */}
            <div className="flex items-center gap-2 mb-3">
              {category && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: category.color + "20", color: category.color }}
                >
                  {category.icon} {category.name}
                </span>
              )}
              {isVerified && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">✓</span>
                  Verified
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                {description}
              </p>
            )}

            {/* Author & Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {author && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm">
                      {author.avatar ? (
                        <img src={author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        author.username[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-zinc-400 text-sm">u/{author.username}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-zinc-500 text-sm">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {commentCount}
                </span>
              </div>
            </div>

            {/* Vote Stats */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-white font-medium">{fireVotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Pin className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">{liarVotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Trash2 className="w-4 h-4 text-zinc-400" />
                <span className="text-white font-medium">{trashVotes}</span>
              </div>
              <div className="ml-auto">
                <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
                    style={{ width: `${firePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vote Buttons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            <button
              onClick={() => handleVoteClick("fire")}
              className="p-4 rounded-full bg-orange-500/20 backdrop-blur-xl text-orange-400 hover:bg-orange-500/40 hover:scale-110 transition-all vote-btn fire"
            >
              <Flame className="w-7 h-7" />
            </button>
            <button
              onClick={() => handleVoteClick("liar")}
              className="p-4 rounded-full bg-purple-500/20 backdrop-blur-xl text-purple-400 hover:bg-purple-500/40 hover:scale-110 transition-all vote-btn liar"
            >
              <Pin className="w-7 h-7" />
            </button>
            <button
              onClick={() => handleVoteClick("trash")}
              className="p-4 rounded-full bg-zinc-700/50 backdrop-blur-xl text-zinc-400 hover:bg-zinc-600/50 hover:scale-110 transition-all vote-btn trash"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe Instructions */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-zinc-400 text-sm">
        ← Swipe left for Liar · Swipe right for Fire · Swipe up for Trash →
      </div>
    </div>
  );
}