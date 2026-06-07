import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion } from 'motion/react';
import { Heart, Bell, MessageSquare, Award, Loader2 } from 'lucide-react';
import { requestNotificationPermission, db } from '../../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const MATH_CATEGORIES = ['all', 'algebra', 'logic', 'calculus', 'geometry', 'number theory', 'basics'];

export function Feed() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'questions'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const livePosts: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        livePosts.push({
          id: doc.id,
          ...data,
          // Generate a mathy placeholder image if one isn't provided
          imageUrl: data.imageUrl || `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop`,
          likes: data.likes || 0,
          isLiked: false,
          category: data.tags || ['basics']
        });
      });
      setPosts(livePosts);
      setLoading(false);
    }, (error: any) => {
      console.error("Feed error:", error);
      toast.error(`Failed to load feed: ${error.message || error}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category.some((cat: string) => cat.toLowerCase().includes(selectedCategory.toLowerCase())));

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Logic for liking would go here (updating Firestore)
    alert("Like functionality coming soon!");
  };

  const handleEnableNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token && user) {
      await updateDoc(doc(db, 'users', user.id), {
        fcmToken: token
      });
      alert('Notifications enabled successfully! Token saved to database.');
    } else if (!token) {
      alert('Notification permission denied, blocked by browser, or not supported.');
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="sticky top-16 z-40 bg-[#fafaf9]/95 backdrop-blur-sm border-b border-[#e7e5e4] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {MATH_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm tracking-wide capitalize whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleEnableNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors ml-4 whitespace-nowrap"
          >
            <Bell size={16} />
            <span className="hidden sm:inline">Enable Notifications</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-medium text-lg">Loading community activity...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No activity yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              Be the first to upload a question or start solving proofs!
            </p>
          </div>
        ) : (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}
          >
            <Masonry gutter="1.5rem">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={`/question/${post.id}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          post.difficulty === 'Beginner' ? 'bg-green-500 text-white' :
                          post.difficulty === 'Intermediate' ? 'bg-blue-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {post.difficulty}
                        </span>
                      </div>
                      <motion.button
                        onClick={(e) => handleLike(post.id, e)}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart
                          size={18}
                          className={`transition-colors ${
                            post.isLiked
                              ? 'fill-[#ef4444] stroke-[#ef4444]'
                              : 'stroke-[#78716c]'
                          }`}
                        />
                      </motion.button>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {post.author?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900">
                              {post.author}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {post.points} pts
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                            <MessageSquare size={14} />
                            <span className="text-[10px] font-medium">{post.completions || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 group-hover:text-red-500 transition-colors">
                            <Heart size={14} />
                            <span className="text-[10px] font-medium">{post.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </Masonry>
          </Masonry>
        )}
      </div>
    </div>
  );
}
