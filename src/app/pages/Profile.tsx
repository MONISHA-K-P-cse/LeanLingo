import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ArrowLeft,
  Trophy,
  Target,
  CheckCircle2,
  Upload,
  Calendar,
  Award,
  TrendingUp,
  LogOut,
  Settings,
  Bookmark,
  ChevronRight,
  Loader2,
  Trash2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, deleteUserAccount } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) {
    return null;
  }

  const levelProgress = ((user.questionsCompleted || 0) % 10) * 10;
  const nextLevel = user.level + 1;
  const questionsToNextLevel = 10 - (user.questionsCompleted % 10);

  // Mock activity data
  const recentActivity = [
    { id: 1, type: 'completed', title: 'Prove Basic Addition', points: 50, date: '2 days ago' },
    { id: 2, type: 'completed', title: 'Commutativity of Addition', points: 100, date: '3 days ago' },
    { id: 3, type: 'uploaded', title: 'Function Composition', points: 25, date: '5 days ago' },
    { id: 4, type: 'completed', title: 'List Length Properties', points: 120, date: '1 week ago' },
  ];

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first question', earned: true },
    { id: 2, title: 'Problem Solver', description: 'Complete 10 questions', earned: true },
    { id: 3, title: 'Rising Star', description: 'Reach Level 5', earned: true },
    { id: 4, title: 'Contributor', description: 'Upload your first question', earned: true },
    { id: 5, title: 'Expert', description: 'Complete 50 questions', earned: false },
    { id: 6, title: 'Top 10', description: 'Reach top 10 on leaderboard', earned: false },
  ];

  // Fetch saved questions data
  const [savedQuestionsData, setSavedQuestionsData] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!user.savedQuestions || user.savedQuestions.length === 0) {
        setSavedQuestionsData([]);
        return;
      }

      setLoadingSaved(true);
      try {
        const fetched = [];
        for (const id of user.savedQuestions) {
          const docRef = doc(db, 'questions', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            fetched.push({ id: docSnap.id, ...docSnap.data() });
          }
        }
        setSavedQuestionsData(fetched);
      } catch (error) {
        console.error("Error fetching saved questions:", error);
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchSavedQuestions();
  }, [user.savedQuestions]);

  // Admin: Fetch all users
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const isSuperAdmin = user?.username?.toLowerCase() === 'pmonisha0629' || user?.email?.toLowerCase().includes('pmonisha0629');

  useEffect(() => {
    if (isSuperAdmin) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const { collection, getDocs } = await import('firebase/firestore');
          const querySnapshot = await getDocs(collection(db, 'users'));
          const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAllUsers(usersData);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isSuperAdmin]);

  const handleDeleteUser = async (userId: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        await deleteUserAccount(userId);
        setAllUsers(allUsers.filter(u => u.id !== userId));
        toast.success(`User ${username} deleted successfully`);
      } catch (error) {
        console.error("Delete user error:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <Button variant="ghost" onClick={() => navigate('/home')} className="mb-4 gap-2">
        <ArrowLeft size={18} />
        Back to Home
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <CardHeader className="-mt-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="pt-2">
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center">
                  <Target className="text-blue-600 mb-1" size={20} />
                  <span className="text-xs text-blue-700 uppercase font-bold tracking-wider">Level</span>
                  <span className="text-2xl font-bold text-blue-800">{user.level}</span>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100 flex flex-col items-center">
                  <Trophy className="text-yellow-600 mb-1" size={20} />
                  <span className="text-xs text-yellow-700 uppercase font-bold tracking-wider">Points</span>
                  <span className="text-2xl font-bold text-yellow-800">{user.points}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 size={18} />
                    <span className="text-sm">Proofs Solved</span>
                  </div>
                  <span className="font-bold">{user.questionsCompleted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Upload size={18} />
                    <span className="text-sm">Questions Uploaded</span>
                  </div>
                  <span className="font-bold">{user.questionsUploaded}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 justify-center pt-2">
                  <Calendar size={14} />
                  <span>Member since March 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Progress */}
          <Card className="bg-white shadow-sm border-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Level {user.level} Journey</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {user.questionsCompleted % 10}/10 to Level {nextLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={levelProgress} className="h-2 bg-blue-50" />
              <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                <span>Beginner</span>
                <span>Grand Master</span>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Activity and Achievements */}
          <Card className="border-none shadow-sm overflow-hidden">
            <Tabs defaultValue="activity">
              <div className="px-6 pt-6 border-b">
                <TabsList className="bg-transparent h-auto p-0 gap-8">
                  <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-4 px-0 h-auto">
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-4 px-0 h-auto">
                    Saved Proofs
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-4 px-0 h-auto">
                    Achievements
                  </TabsTrigger>
                  {isSuperAdmin && (
                    <TabsTrigger value="users" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-4 px-0 h-auto">
                      User Management
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
              <CardContent className="p-6">
                <TabsContent value="activity" className="space-y-4 mt-0">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                    >
                      <div
                        className={`p-2.5 rounded-full ${
                          activity.type === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {activity.type === 'completed' ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Upload size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{activity.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="bg-white px-2 py-0.5 rounded border">+{activity.points} pts</span>
                          <span>•</span>
                          <span>{activity.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="saved" className="space-y-4 mt-0">
                  {loadingSaved ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="animate-spin text-blue-500" />
                    </div>
                  ) : savedQuestionsData.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">You haven't saved any proofs yet.</p>
                      <Button variant="link" onClick={() => navigate('/questions')}>Browse Questions</Button>
                    </div>
                  ) : (
                    savedQuestionsData.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-blue-50/30 border border-blue-100 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate(`/question/${question.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-full">
                            <Bookmark size={20} fill="currentColor" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{question.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">{question.difficulty}</Badge>
                              <span className="text-[10px] text-gray-500">+{question.points} pts</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="text-blue-300" />
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="achievements" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-0">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        achievement.earned
                          ? 'bg-white border-yellow-200 shadow-sm'
                          : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-full ${
                          achievement.earned
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Award size={24} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {isSuperAdmin && (
                  <TabsContent value="users" className="space-y-4 mt-0">
                    {loadingUsers ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-blue-500" />
                      </div>
                    ) : allUsers.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No other users found.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {allUsers.filter(u => u.id !== user.id).map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {u.username?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-gray-900">{u.username}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteUser(u.id, u.username)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                )}
              </CardContent>
            </Tabs>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="text-blue-600 mx-auto mb-2" size={32} />
                  <p className="text-2xl font-bold text-blue-600">
                    {user.questionsCompleted > 0
                      ? Math.round((user.points / user.questionsCompleted) * 10) / 10
                      : 0}
                  </p>
                  <p className="text-sm text-gray-600">Avg Points/Question</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="text-purple-600 mx-auto mb-2" size={32} />
                  <p className="text-2xl font-bold text-purple-600">
                    {achievements.filter((a) => a.earned).length}/{achievements.length}
                  </p>
                  <p className="text-sm text-gray-600">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logout and Settings Buttons */}
      <div className="flex justify-end mt-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/settings')}
          className="mr-4 gap-2"
        >
          <Settings size={18} />
          Settings
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
}