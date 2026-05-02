import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Settings, Grid, Bookmark } from 'lucide-react';
import { mockPosts } from '../data/mockPosts';

const moodHighlights = [
  {
    id: '1',
    title: 'brutalist',
    image: 'https://images.unsplash.com/photo-1557226217-bf0da2478e6c?w=300&h=300&fit=crop',
    count: 12,
  },
  {
    id: '2',
    title: 'velvets',
    image: 'https://images.unsplash.com/photo-1597075418805-0e98dd819c0e?w=300&h=300&fit=crop',
    count: 24,
  },
  {
    id: '3',
    title: 'neutrals',
    image: 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?w=300&h=300&fit=crop',
    count: 18,
  },
  {
    id: '4',
    title: 'plants',
    image: 'https://images.unsplash.com/photo-1588296401836-21d1fbcafd5b?w=300&h=300&fit=crop',
    count: 8,
  },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const userPosts = mockPosts.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#78716c] to-[#1c1917]" />
            <div>
              <h1 className="text-2xl tracking-tight mb-1">Studio Name</h1>
              <p className="text-sm text-[#78716c] mb-3">
                Interior Designer & Set Stylist
              </p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-medium">127</span>
                  <span className="text-[#78716c] ml-1">posts</span>
                </div>
                <div>
                  <span className="font-medium">2.4k</span>
                  <span className="text-[#78716c] ml-1">followers</span>
                </div>
                <div>
                  <span className="font-medium">892</span>
                  <span className="text-[#78716c] ml-1">following</span>
                </div>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-white rounded-full transition-colors">
            <Settings size={20} className="text-[#78716c]" />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-sm text-[#44403c] leading-relaxed max-w-xl mb-6">
            Exploring the intersection of minimalism and warmth. Based in Copenhagen.
            Available for collaborations.
          </p>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#78716c] mb-3">
              Mood Collections
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {moodHighlights.map((highlight) => (
                <motion.div
                  key={highlight.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#e7e5e4] mb-2">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#44403c]">{highlight.title}</p>
                    <p className="text-xs text-[#a8a29e]">{highlight.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-[#e7e5e4] mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-[#1c1917] text-[#1c1917]'
                  : 'border-transparent text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              <Grid size={16} />
              <span className="text-sm">Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-[#1c1917] text-[#1c1917]'
                  : 'border-transparent text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              <Bookmark size={16} />
              <span className="text-sm">Saved</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {userPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/post/${post.id}`}
                className="group block aspect-square bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
