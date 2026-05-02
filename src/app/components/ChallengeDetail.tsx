import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Users,
  AlertCircle,
  Lightbulb,
  Upload,
  BookOpen,
  Video,
  Package,
  FileText,
  Lock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { mockChallenges, userProgress } from '../data/mockChallenges';

export function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const challenge = mockChallenges.find((c) => c.id === id);
  const progress = id ? userProgress[id] : undefined;

  const [showHints, setShowHints] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState(progress?.hintsUnlocked || 0);
  const [activeTab, setActiveTab] = useState<'brief' | 'submissions'>('brief');

  useEffect(() => {
    if (id && progress) {
      const lastPosition = progress.scrollPosition || 0;
      window.scrollTo({ top: lastPosition, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (id && progress) {
        progress.scrollPosition = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id, progress]);

  const unlockHint = (level: number) => {
    setUnlockedHints(level);
    if (progress) {
      progress.hintsUnlocked = level;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText size={18} />;
      case 'video':
        return <Video size={18} />;
      case 'material':
        return <Package size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#78716c]">Challenge not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20 md:pb-8">
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-[#e7e5e4]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            to="/challenges"
            className="p-2 -ml-2 hover:bg-[#f5f5f4] rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-[#1c1917]" />
          </Link>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-[#1c1917] text-white text-sm rounded-full hover:bg-[#292524] transition-colors"
          >
            Submit Solution
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img
            src={challenge.image}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full border border-white/30 capitalize">
                {challenge.difficulty}
              </span>
              <span className="px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                {challenge.category}
              </span>
            </div>
            <h1 className="text-4xl tracking-tight mb-2">{challenge.title}</h1>
            <div className="flex items-center gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{challenge.submissions} submissions</span>
              </div>
              {challenge.deadline && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>
                    Ends{' '}
                    {new Date(challenge.deadline).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {progress && progress.status === 'in_progress' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">You're working on this</p>
              <p className="text-xs text-blue-700">
                Last accessed{' '}
                {new Date(progress.lastAccessed).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setShowResources(!showResources)}
            className="bg-white rounded-xl p-6 border-2 border-[#e7e5e4] hover:border-[#1c1917] transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-[#fafaf9] rounded-lg group-hover:bg-[#1c1917] group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                {challenge.resources.length} items
              </span>
            </div>
            <h3 className="font-medium mb-1">Learning Resources</h3>
            <p className="text-xs text-[#78716c]">Articles, videos, and materials</p>
          </button>

          <button
            onClick={() => setShowHints(!showHints)}
            className="bg-white rounded-xl p-6 border-2 border-[#e7e5e4] hover:border-[#1c1917] transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-[#fafaf9] rounded-lg group-hover:bg-[#1c1917] group-hover:text-white transition-colors">
                <Lightbulb size={24} />
              </div>
              <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                {unlockedHints}/{challenge.hints.length} unlocked
              </span>
            </div>
            <h3 className="font-medium mb-1">Get Hints</h3>
            <p className="text-xs text-[#78716c]">Unlock progressive guidance</p>
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-gradient-to-br from-[#1c1917] to-[#44403c] rounded-xl p-6 border-2 border-[#1c1917] hover:shadow-lg transition-all text-left group text-white"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-white/10 rounded-lg">
                <Upload size={24} />
              </div>
            </div>
            <h3 className="font-medium mb-1">Submit Solution</h3>
            <p className="text-xs text-white/70">Share your design approach</p>
          </button>
        </div>

        <AnimatePresence>
          {showResources && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
                <h3 className="font-medium mb-4">Learning Resources</h3>
                <div className="grid gap-3">
                  {challenge.resources.map((resource, index) => (
                    <motion.a
                      key={index}
                      href={resource.url}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-[#fafaf9] rounded-lg hover:bg-[#f5f5f4] transition-colors group"
                    >
                      {resource.thumbnail && (
                        <img
                          src={resource.thumbnail}
                          alt={resource.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#78716c]">{getResourceIcon(resource.type)}</span>
                          <h4 className="text-sm font-medium group-hover:text-[#1c1917] transition-colors">
                            {resource.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#78716c] capitalize">{resource.type}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-xl p-6 border border-[#e7e5e4]">
                <h3 className="font-medium mb-4">Progressive Hints</h3>
                <div className="space-y-3">
                  {challenge.hints.map((hint, index) => {
                    const isUnlocked = index < unlockedHints;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 ${
                          isUnlocked
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-[#fafaf9] border-[#e7e5e4]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isUnlocked ? (
                            <CheckCircle2 size={20} className="text-amber-600 mt-0.5" />
                          ) : (
                            <Lock size={20} className="text-[#a8a29e] mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs text-[#78716c] mb-2">Hint {index + 1}</p>
                            {isUnlocked ? (
                              <p className="text-sm text-amber-900">{hint.text}</p>
                            ) : (
                              <button
                                onClick={() => unlockHint(index + 1)}
                                className="text-sm text-[#1c1917] hover:underline"
                              >
                                Click to unlock hint {index + 1}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-xl overflow-hidden border border-[#e7e5e4]">
          <div className="border-b border-[#e7e5e4]">
            <div className="flex">
              <button
                onClick={() => setActiveTab('brief')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'brief'
                    ? 'bg-white text-[#1c1917] border-b-2 border-[#1c1917]'
                    : 'bg-[#fafaf9] text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                Challenge Brief
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'submissions'
                    ? 'bg-white text-[#1c1917] border-b-2 border-[#1c1917]'
                    : 'bg-[#fafaf9] text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                Community Solutions ({challenge.submissions})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'brief' ? (
              <div>
                <h3 className="text-lg font-medium mb-4">Brief</h3>
                <p className="text-[#44403c] leading-relaxed mb-6">{challenge.brief}</p>

                <h4 className="text-sm font-medium mb-3 uppercase tracking-wide text-[#78716c]">
                  Constraints
                </h4>
                <ul className="space-y-2 mb-6">
                  {challenge.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[#44403c]">
                      <span className="text-[#78716c] mt-1">•</span>
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[#78716c] text-center py-8">
                  Community submissions will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl tracking-tight">Submit Your Solution</h3>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="p-2 hover:bg-[#f5f5f4] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-[#78716c] mb-6">
                You can submit multiple solutions to showcase different design approaches. Each
                submission will be visible to the community.
              </p>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  navigate('/compose', { state: { challengeId: id } });
                }}
                className="w-full py-3 bg-[#1c1917] text-white rounded-xl hover:bg-[#292524] transition-colors"
              >
                Go to Composer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
