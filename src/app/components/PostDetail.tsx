import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Share2, Bookmark, MapPin } from 'lucide-react';
import { mockPosts } from '../data/mockPosts';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => p.id === id);
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [showHotspots, setShowHotspots] = useState(true);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#78716c]">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-[#e7e5e4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="p-2 -ml-2 hover:bg-[#f5f5f4] rounded-full transition-colors">
            <ArrowLeft size={20} className="text-[#1c1917]" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#f5f5f4] rounded-full transition-colors">
              <Share2 size={18} className="text-[#78716c]" />
            </button>
            <button className="p-2 hover:bg-[#f5f5f4] rounded-full transition-colors">
              <Bookmark size={18} className="text-[#78716c]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative" onClick={() => setShowHotspots(!showHotspots)}>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-auto max-h-[60vh] object-cover"
          />

          {showHotspots && post.materials.map((material, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
              className="absolute group"
              style={{ left: `${material.x}%`, top: `${material.y}%` }}
            >
              <div className="relative">
                <div className="w-3 h-3 bg-white rounded-full border-2 border-[#1c1917] cursor-pointer" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-[#1c1917] text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-xl">
                    <p className="font-medium">{material.name}</p>
                    {material.source && (
                      <p className="text-[#a8a29e] mt-0.5">{material.source}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl tracking-tight mb-2">{post.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-[#78716c]">Interior Designer</p>
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => setIsLiked(!isLiked)}
              className="p-3 rounded-full bg-[#f5f5f4] hover:bg-[#e7e5e4] transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                size={22}
                className={`transition-colors ${
                  isLiked
                    ? 'fill-[#ef4444] stroke-[#ef4444]'
                    : 'stroke-[#78716c]'
                }`}
              />
            </motion.button>
          </div>

          <p className="text-[#44403c] leading-relaxed mb-8 max-w-2xl">
            {post.description}
          </p>

          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-widest text-[#78716c] mb-4">
              Materials & Sources
            </h2>
            <div className="grid gap-3">
              {post.materials.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#fafaf9] rounded-lg border border-[#e7e5e4]"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-[#78716c]" />
                    <div>
                      <p className="text-sm font-medium">{material.name}</p>
                      {material.source && (
                        <p className="text-xs text-[#78716c] mt-0.5">
                          {material.source}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.category.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 text-xs bg-white border border-[#e7e5e4] rounded-full text-[#78716c]"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="border-t border-[#e7e5e4] pt-6">
            <p className="text-sm text-[#a8a29e]">
              {post.likes} people liked this
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
