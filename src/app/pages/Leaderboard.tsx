import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardEntry } from '../data/mockData';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trophy, Medal, Award, TrendingUp, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Leaderboard() {
  const { user, deleteUserAccount } = useAuth();
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: LeaderboardEntry[] = [];
      let rank = 1;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        data.push({
          id: doc.id,
          rank,
          username: userData.username || 'Anonymous',
          points: userData.points || 0,
          level: userData.level || 1,
          questionsCompleted: userData.questionsCompleted || 0,
        });
        rank++;
      });
      setLeaderboardData(data);
      setLoading(false);
    }, (error: any) => {
      console.error("Leaderboard error:", error);
      toast.error(`Failed to load leaderboard: ${error.message || error}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Find user's rank
  const userRank = leaderboardData.findIndex((entry) => entry.username === user?.username) + 1;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (rank === 3) return <Medal className="text-orange-600" size={24} />;
    return <span className="text-gray-500 font-bold text-lg">{rank}</span>;
  };

  const isSuperAdmin = user?.username?.toLowerCase() === 'pmonisha0629' || user?.email?.toLowerCase().includes('pmonisha0629');

  const handleDeleteUser = async (userId: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        await deleteUserAccount(userId);
        toast.success(`User ${username} deleted successfully`);
      } catch (error) {
        console.error("Delete user error:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'default';
    if (rank <= 3) return 'secondary';
    return 'outline';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Trophy size={64} className="text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <p className="text-gray-600">Compete with the best Lean programmers worldwide</p>
        </div>

        {/* User's Rank Card */}
        {userRank > 0 && (
          <Card className="border-2 border-blue-500 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Your Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getRankIcon(userRank)}
                  </div>
                  <div>
                    <p className="font-bold text-xl">{user?.username}</p>
                    <p className="text-sm text-gray-600">Level {user?.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{user?.points}</p>
                  <p className="text-sm text-gray-600">points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Tabs */}
        <Card>
          <CardHeader>
            <Tabs defaultValue={timeFilter} onValueChange={setTimeFilter}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all-time">All Time</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
                <TabsTrigger value="weekly">This Week</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                <p className="text-gray-500 font-medium">Fetching top performers...</p>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found in the leaderboard yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg transition-colors ${
                      entry.username === user?.username
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 sm:w-12 h-8 sm:h-12 flex items-center justify-center flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarFallback
                        className={`text-white ${
                          entry.rank === 1
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                            : entry.rank === 2
                            ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                            : entry.rank === 3
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                            : 'bg-gradient-to-br from-blue-500 to-purple-500'
                        }`}
                      >
                        {entry.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <p className="font-bold text-sm sm:text-base truncate">{entry.username}</p>
                        {entry.username === user?.username && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                        {entry.rank <= 3 && (
                          <Badge variant={getRankBadgeVariant(entry.rank)} className="text-xs">
                            Top {entry.rank}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <span>Level {entry.level}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{entry.questionsCompleted} completed</span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0 ml-2 flex items-center gap-4">
                      <div>
                        <p className="text-lg sm:text-2xl font-bold text-blue-600">{entry.points.toLocaleString()}</p>
                        <p className="text-xs sm:text-sm text-gray-600">points</p>
                      </div>
                      
                      {isSuperAdmin && entry.username !== user?.username && (
                        <button
                          onClick={() => handleDeleteUser(entry.id, entry.username)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="text-green-500" size={20} />
                Top Scorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{leaderboardData[0]?.username || 'N/A'}</p>
              <p className="text-gray-600">{leaderboardData[0]?.points.toLocaleString() || 0} points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="text-purple-500" size={20} />
                Most Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{leaderboardData[0]?.username || 'N/A'}</p>
              <p className="text-gray-600">{leaderboardData[0]?.questionsCompleted || 0} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Rank #{userRank || 'N/A'}</p>
              <p className="text-gray-600">{user?.points || 0} points</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}