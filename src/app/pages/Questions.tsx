import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Question } from '../data/mockData';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter, Lock, Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function Questions() {
  const navigate = useNavigate();
  const { user, toggleSaveQuestion, deleteQuestion } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const currentLevel = user?.level || 1;
  const questionsCompleted = user?.questionsCompleted || 0;
  const questionsInCurrentLevel = questionsCompleted % 10;
  const isCurrentLevelComplete = questionsInCurrentLevel === 0 && questionsCompleted > 0;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let querySnapshot = await getDocs(collection(db, 'questions'));
        
        // Automatic migration if empty
        if (querySnapshot.empty) {
          console.log("No questions found in Firestore. Migrating mock questions...");
          const { mockQuestions } = await import('../data/mockData');
          for (const q of mockQuestions) {
            await addDoc(collection(db, 'questions'), q);
          }
          // Refetch after migration
          querySnapshot = await getDocs(collection(db, 'questions'));
        }

        const fetchedQuestions: Question[] = [];
        querySnapshot.forEach((doc) => {
          fetchedQuestions.push({ id: doc.id, ...doc.data() } as Question);
        });
        setQuestions(fetchedQuestions);
      } catch (error: any) {
        console.error("Error fetching questions:", error);
        toast.error(`Failed to load questions: ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleToggleSave = async (e: React.MouseEvent, questionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to save questions');
      return;
    }

    try {
      const saved = await toggleSaveQuestion(questionId);
      if (saved) {
        toast.success('Question saved to your profile');
      } else {
        toast.info('Question removed from your profile');
      }
    } catch (error) {
      toast.error('Failed to save question');
    }
  };

  const isSuperAdmin = user?.username?.toLowerCase() === 'pmonisha0629' || user?.email?.toLowerCase().includes('pmonisha0629');

  const handleDeleteQuestion = async (e: React.MouseEvent, questionId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete the question "${title}"?`)) {
      try {
        await deleteQuestion(questionId);
        setQuestions(questions.filter(q => q.id !== questionId));
        toast.success('Question deleted successfully');
      } catch (error) {
        toast.error('Failed to delete question');
      }
    }
  };

  // Determine if a question is locked based on user level
  const isQuestionLocked = (questionLevel: number) => {
    if (questionLevel <= currentLevel) return false;
    // Lock next level questions if current level is not fully complete (need 10 questions)
    if (questionLevel === currentLevel + 1 && questionsInCurrentLevel < 10) return true;
    return questionLevel > currentLevel + 1;
  };

  // Map difficulty to level requirement (simplified)
  const getDifficultyLevel = (difficulty: string) => {
    if (difficulty === 'Beginner') return 1;
    if (difficulty === 'Intermediate') return 3;
    return 5;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Level Progress Alert */}
      {questionsInCurrentLevel > 0 && questionsInCurrentLevel < 10 && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900">
                  Complete {10 - questionsInCurrentLevel} more question{10 - questionsInCurrentLevel > 1 ? 's' : ''} to unlock Level {currentLevel + 1}!
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Progress: {questionsInCurrentLevel}/10 questions completed
                </p>
              </div>
              <div className="text-4xl">🔓</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search questions by title, description, or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Available Questions</h2>
          <p className="text-gray-500">{filteredQuestions.length} questions</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Loading questions...</p>
            </CardContent>
          </Card>
        ) : filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No questions found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((question) => {
              const questionLevel = getDifficultyLevel(question.difficulty);
              const locked = isQuestionLocked(questionLevel);
              
              return (
                <Card 
                  key={question.id} 
                  className={`transition-shadow ${locked ? 'opacity-60' : 'hover:shadow-lg cursor-pointer'}`}
                  onClick={() => !locked && navigate(`/question/${question.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="flex items-center gap-2">
                            {question.title}
                            {locked && <Lock size={18} className="text-gray-400" />}
                          </CardTitle>
                          <Badge
                            variant={
                              question.difficulty === 'Beginner'
                                ? 'default'
                                : question.difficulty === 'Intermediate'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {question.difficulty}
                          </Badge>
                          {locked && (
                            <Badge variant="outline" className="bg-gray-100">
                              Level {questionLevel}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {locked 
                            ? `🔒 Complete Level ${currentLevel} to unlock this question (${10 - questionsInCurrentLevel} questions remaining)`
                            : question.description
                          }
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">+{question.points}</div>
                          <div className="text-sm text-gray-500">points</div>
                        </div>
                        {!locked && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full transition-colors ${
                              user?.savedQuestions?.includes(question.id)
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                            onClick={(e) => handleToggleSave(e, question.id)}
                          >
                            {user?.savedQuestions?.includes(question.id) ? (
                              <BookmarkCheck size={20} fill="currentColor" />
                            ) : (
                              <Bookmark size={20} />
                            )}
                          </Button>
                        )}
                        {isSuperAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => handleDeleteQuestion(e, question.id, question.title)}
                          >
                            <Trash2 size={20} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {!locked && (
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 ml-auto">
                          {question.completions.toLocaleString()} completions
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}