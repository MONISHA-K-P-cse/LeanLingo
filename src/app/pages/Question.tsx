import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { UserProgress, Question as QuestionType } from '../data/mockData';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Play, CheckCircle, XCircle, Lightbulb, Users, Upload, BookOpen, Lock, ThumbsUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const PROGRESS_KEY = 'leanlingo_question_progress';

export default function Question() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser, deleteQuestion } = useAuth();
  
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);

  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [unlockedHints, setUnlockedHints] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState<'video' | 'article' | 'documentation' | 'example'>('article');

  // Fetch question from Firestore
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'questions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const qData = { id: docSnap.id, ...docSnap.data() } as QuestionType;
          setQuestion(qData);
        } else {
          setQuestion(null);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoadingQuestion(false);
      }
    };
    fetchQuestion();
  }, [id]);

  // Set initial code once question loads
  useEffect(() => {
    if (question && !code) {
      setCode(question.code || '');
    }
  }, [question]);

  // Load saved progress on mount
  useEffect(() => {
    if (id) {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const allProgress: UserProgress[] = JSON.parse(savedProgress);
        const questionProgress = allProgress.find((p) => p.questionId === id);

        if (questionProgress) {
          setCode(questionProgress.code);
          setUnlockedHints(questionProgress.hintsUnlocked);

          // Restore scroll position
          setTimeout(() => {
            window.scrollTo({ top: questionProgress.scrollPosition, behavior: 'smooth' });
          }, 100);

          toast.info('Resumed from where you left off');
        }
      }
    }
  }, [id]);

  // Auto-save progress
  useEffect(() => {
    const saveProgress = () => {
      if (id && code !== question?.code) {
        const savedProgress = localStorage.getItem(PROGRESS_KEY);
        const allProgress: UserProgress[] = savedProgress ? JSON.parse(savedProgress) : [];

        const updatedProgress = allProgress.filter((p) => p.questionId !== id);
        updatedProgress.push({
          questionId: id,
          code,
          scrollPosition: window.scrollY,
          lastAccessed: new Date().toISOString(),
          hintsUnlocked: unlockedHints,
        });

        localStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedProgress));
      }
    };

    const interval = setInterval(saveProgress, 5000);
    window.addEventListener('scroll', saveProgress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', saveProgress);
    };
  }, [id, code, unlockedHints, question]);

  if (loadingQuestion) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert>
          <AlertDescription>Loading question...</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert>
          <AlertDescription>Question not found.</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/home')} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if code contains "sorry" (incomplete)
    if (code.includes('sorry')) {
      setResult('error');
      toast.error('Proof incomplete. Replace "sorry" with a valid proof.');
      setIsRunning(false);
      return;
    }

    // Check against multiple accepted solutions
    const normalizedCode = code.trim().replace(/\s+/g, ' ');
    const isAccepted = question.acceptedSolutions?.some((solution) => {
      const normalizedSolution = solution.trim().replace(/\s+/g, ' ');
      return normalizedCode.includes(normalizedSolution.split('by')[1]?.trim() || '');
    });

    if (isAccepted || normalizedCode.includes('rfl') || normalizedCode.includes('simp') || normalizedCode.includes('induction')) {
      setResult('success');

      if (user) {
        updateUser({
          points: user.points + question.points,
          questionsCompleted: user.questionsCompleted + 1,
          level: Math.floor((user.questionsCompleted + 1) / 10) + 1,
        });
      }

      // Clear saved progress for this question
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const allProgress: UserProgress[] = JSON.parse(savedProgress);
        const updatedProgress = allProgress.filter((p) => p.questionId !== id);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedProgress));
      }

      toast.success(`Proof verified! +${question.points} points`);
    } else {
      setResult('error');
      toast.error('Proof verification failed. Try a different approach or check the hints!');
    }

    setIsRunning(false);
  };

  const handleShowSolution = () => {
    setCode(question.solution);
    toast.info('Solution loaded into editor');
  };

  const unlockHint = (level: number) => {
    setUnlockedHints(level);
    toast.success(`Hint ${level} unlocked!`);
  };

  const handleUploadResource = () => {
    if (!resourceTitle || !resourceUrl) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Resource uploaded! It will be reviewed by moderators.');
    setShowUploadDialog(false);
    setResourceTitle('');
    setResourceUrl('');
  };

  const isSuperAdmin = user?.username?.toLowerCase() === 'pmonisha0629' || user?.email?.toLowerCase().includes('pmonisha0629');

  const handleDeleteQuestion = async () => {
    if (!id || !question) return;
    
    if (window.confirm(`Are you sure you want to delete this question?`)) {
      try {
        await deleteQuestion(id);
        toast.success('Question deleted successfully');
        navigate('/questions');
      } catch (error) {
        toast.error('Failed to delete question');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => navigate('/questions')} className="gap-2">
          <ArrowLeft size={18} />
          Back to Questions
        </Button>
        
        {isSuperAdmin && (
          <Button variant="destructive" size="sm" onClick={handleDeleteQuestion} className="gap-2">
            <Trash2 size={16} />
            Delete Question
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Question Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-2xl">{question.title}</CardTitle>
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
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700">{question.description}</p>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-b">
                <span className="text-gray-600">Points Reward</span>
                <span className="text-2xl font-bold text-blue-600">+{question.points}</span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={16} />
                <span>{question.completions.toLocaleString()} completions</span>
              </div>

              {/* Progressive Hints */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Progressive Hints</h3>
                {question.hints?.map((hint, index) => {
                  const isUnlocked = index < unlockedHints;
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isUnlocked ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isUnlocked ? (
                          <Lightbulb size={16} className="text-amber-600 mt-0.5" />
                        ) : (
                          <Lock size={16} className="text-gray-400 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Hint {index + 1}</p>
                          {isUnlocked ? (
                            <p className="text-sm text-gray-700">{hint.text}</p>
                          ) : (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-blue-600"
                              onClick={() => unlockHint(index + 1)}
                            >
                              Unlock this hint
                            </Button>
                          )}
                        </div>
                        {user?.savedQuestions?.includes(question.id) ? (
                          <BookmarkCheck size={20} fill="currentColor" />
                        ) : (
                          <Bookmark size={20} />
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
                  );
                })}
              </div>

              <Button variant="secondary" className="w-full" onClick={handleShowSolution}>
                View Solution
              </Button>
            </CardContent>
          </Card>

          {/* Learning Resources */}
          {question.resources && question.resources.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Learning Resources</CardTitle>
                  <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Upload size={14} />
                        Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Resource</DialogTitle>
                        <DialogDescription>
                          Share a helpful resource with the community
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="resource-title">Title</Label>
                          <Input
                            id="resource-title"
                            value={resourceTitle}
                            onChange={(e) => setResourceTitle(e.target.value)}
                            placeholder="e.g., Great Lean Tutorial"
                          />
                        </div>
                        <div>
                          <Label htmlFor="resource-url">URL</Label>
                          <Input
                            id="resource-url"
                            value={resourceUrl}
                            onChange={(e) => setResourceUrl(e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="resource-type">Type</Label>
                          <Select value={resourceType} onValueChange={(v: any) => setResourceType(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="article">Article</SelectItem>
                              <SelectItem value="documentation">Documentation</SelectItem>
                              <SelectItem value="example">Example</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleUploadResource} className="w-full">
                          Upload Resource
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {question.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen size={18} className="text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ThumbsUp size={12} />
                            {resource.votes}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
              <CardDescription>
                Write your Lean proof below - multiple valid approaches are accepted!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="editor">
                <TabsList className="mb-4">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm min-h-[400px] bg-gray-50"
                    placeholder="Write your Lean code here..."
                  />

                  {result && (
                    <Alert variant={result === 'success' ? 'default' : 'destructive'}>
                      {result === 'success' ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Proof verified successfully! You earned {question.points} points.
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            Proof verification failed. Try unlocking hints or checking the resources!
                          </AlertDescription>
                        </>
                      )}
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleRunCode}
                      disabled={isRunning || result === 'success'}
                      className="gap-2"
                    >
                      <Play size={18} />
                      {isRunning ? 'Running...' : result === 'success' ? 'Completed' : 'Run Code'}
                    </Button>

                    {result === 'success' && (
                      <Button variant="outline" onClick={() => navigate('/questions')}>
                        Next Question
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documentation" className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <h3>Lean Basics</h3>
                    <p>
                      Lean is a theorem prover and programming language. Here are some common tactics:
                    </p>
                    <ul>
                      <li>
                        <code>rfl</code> - Proves equality by reflexivity
                      </li>
                      <li>
                        <code>simp</code> - Simplifies expressions using simp lemmas
                      </li>
                      <li>
                        <code>induction</code> - Performs mathematical induction
                      </li>
                      <li>
                        <code>intro</code> - Introduces hypotheses
                      </li>
                      <li>
                        <code>apply</code> - Applies a theorem
                      </li>
                      <li>
                        <code>exact</code> - Provides an exact proof term
                      </li>
                    </ul>
                    <h3>Example</h3>
                    <pre className="bg-gray-50 p-4 rounded">
                      {`theorem example : 1 + 1 = 2 := by
  rfl`}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
