import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Clock, Users, Trophy, TrendingUp } from 'lucide-react';
import { mockChallenges, userProgress } from '../data/mockChallenges';

export function Challenges() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (challengeId: string) => {
    const progress = userProgress[challengeId];
    if (!progress) return null;

    const statusConfig = {
      in_progress: { text: 'In Progress', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      submitted: { text: 'Submitted', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      completed: { text: 'Completed', color: 'bg-green-50 text-green-700 border-green-200' },
    };

    const config = statusConfig[progress.status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl tracking-tight mb-2">Design Challenges</h1>
          <p className="text-sm text-[#78716c]">
            Test your skills, learn new techniques, and get feedback from the community
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${
                filter === f
                  ? 'bg-[#1c1917] text-white'
                  : 'bg-white text-[#78716c] hover:bg-[#f5f5f4] border border-[#e7e5e4]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/challenge/${challenge.id}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={challenge.image}
                    alt={challenge.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full border backdrop-blur-sm ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    {getStatusBadge(challenge.id)}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg tracking-tight mb-2 group-hover:text-[#78716c] transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-[#78716c] mb-4 line-clamp-2 leading-relaxed">
                    {challenge.brief}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#a8a29e] mb-4">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{challenge.submissions}</span>
                    </div>
                    {challenge.deadline && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          {new Date(challenge.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Trophy size={14} />
                      <span>{challenge.resources.length} resources</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {challenge.constraints.slice(0, 2).map((constraint, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-[#fafaf9] rounded text-[#78716c]"
                      >
                        {constraint}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-[#1c1917] to-[#44403c] rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl tracking-tight mb-2">Your Progress</h2>
              <p className="text-white/70 text-sm">Keep challenging yourself</p>
            </div>
            <TrendingUp size={32} className="text-white/30" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-light mb-1">12</p>
              <p className="text-white/70 text-sm">Challenges Completed</p>
            </div>
            <div>
              <p className="text-3xl font-light mb-1">3</p>
              <p className="text-white/70 text-sm">In Progress</p>
            </div>
            <div>
              <p className="text-3xl font-light mb-1">847</p>
              <p className="text-white/70 text-sm">Community Votes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
