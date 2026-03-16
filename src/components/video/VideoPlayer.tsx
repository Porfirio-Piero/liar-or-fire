"use client";

import { useState, useRef, useEffect } from "react";
import { Flame, Pin, Trash2, MessageSquare, Share2, Bookmark } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  postId: string;
  onVote?: (type: "fire" | "liar" | "trash") => void;
  fireVotes?: number;
  liarVotes?: number;
  trashVotes?: number;
  autoPlay?: boolean;
  muted?: boolean;
}

export function VideoPlayer({
  src,
  thumbnail,
  postId,
  onVote,
  fireVotes = 0,
  liarVotes = 0,
  trashVotes = 0,
  autoPlay = false,
  muted = true,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const totalVotes = fireVotes + liarVotes + trashVotes;
  const firePercentage = totalVotes > 0 ? Math.round((fireVotes / totalVotes) * 100) : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVote = (type: "fire" | "liar" | "trash") => {
    if (onVote) {
      onVote(type);
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-zinc-900"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-white ml-1" />
          </div>
        </div>
      )}

      {/* Vote Buttons */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-3">
        <button
          onClick={() => handleVote("fire")}
          className="p-4 rounded-full bg-orange-500/20 backdrop-blur-xl text-orange-400 hover:bg-orange-500/40 hover:scale-110 transition-all vote-btn fire"
        >
          <Flame className="w-7 h-7" />
        </button>
        <button
          onClick={() => handleVote("liar")}
          className="p-4 rounded-full bg-purple-500/20 backdrop-blur-xl text-purple-400 hover:bg-purple-500/40 hover:scale-110 transition-all vote-btn liar"
        >
          <Pin className="w-7 h-7" />
        </button>
        <button
          onClick={() => handleVote("trash")}
          className="p-4 rounded-full bg-zinc-700/50 backdrop-blur-xl text-zinc-400 hover:bg-zinc-600/50 hover:scale-110 transition-all vote-btn trash"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      {/* Fire Percentage */}
      <div className="absolute right-4 bottom-8">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-white font-bold text-sm">{firePercentage}%</span>
        </div>
      </div>

      {/* Bottom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-violet-400 transition-colors"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={toggleMute}
                className="text-white hover:text-violet-400 transition-colors"
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}