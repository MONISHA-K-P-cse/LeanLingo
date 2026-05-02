import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Trophy, Target, CheckCircle2, Upload, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const levelProgress = ((user?.questionsCompleted || 0) % 10) * 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
        <p className="text-gray-600 text-lg">Ready to master some Lean proofs today?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold text-blue-600">{user?.points}</p>
              </div>
              <Trophy className="text-yellow-500" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Level</p>
                <p className="text-2xl font-bold text-purple-600">{user?.level}</p>
              </div>
              <Target className="text-purple-500" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{user?.questionsCompleted}</p>
              </div>
              <CheckCircle2 className="text-green-500" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Uploaded</p>
                <p className="text-2xl font-bold text-orange-600">{user?.questionsUploaded}</p>
              </div>
              <Upload className="text-orange-500" size={40} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Level {user?.level} Progress</CardTitle>
              <CardDescription>
                {10 - ((user?.questionsCompleted || 0) % 10)} more questions to reach Level {(user?.level || 0) + 1}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {(user?.questionsCompleted || 0) % 10}/10
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={levelProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/questions')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={24} />
                  Browse Questions
                </CardTitle>
                <CardDescription className="mt-2">
                  Explore and solve Lean mathematical proofs
                </CardDescription>
              </div>
              <ArrowRight className="text-gray-400" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Start solving problems and earn points to level up!
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/upload')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="text-orange-600" size={24} />
                  Upload Question
                </CardTitle>
                <CardDescription className="mt-2">
                  Share your own Lean problems with the community
                </CardDescription>
              </div>
              <ArrowRight className="text-gray-400" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Earn +25 bonus points for each question you upload!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">Top 15%</p>
                <p className="text-sm text-gray-600 mt-1">Among all users</p>
              </div>
              <Trophy className="text-yellow-500" size={48} />
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/leaderboard')}
            >
              View Leaderboard
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">92%</p>
                <p className="text-sm text-gray-600 mt-1">Problems solved correctly</p>
              </div>
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <div className="mt-4">
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">+350</p>
                <p className="text-sm text-gray-600 mt-1">Points this week</p>
              </div>
              <TrendingUp className="text-purple-500" size={48} />
            </div>
            <p className="text-sm text-green-600 mt-4">↑ 25% from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}