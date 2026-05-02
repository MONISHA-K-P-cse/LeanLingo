import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadQuestion() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    points: '',
    code: '',
    solution: '',
    tags: [] as string[],
    hints: [] as { level: number, text: string, unlocked: boolean }[],
    resources: [] as { title: string, url: string, type: string }[],
  });

  const [tagInput, setTagInput] = useState('');
  const [hintInput, setHintInput] = useState('');
  const [resourceData, setResourceData] = useState({ title: '', url: '', type: 'documentation' });

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddHint = () => {
    if (hintInput.trim()) {
      setFormData({
        ...formData,
        hints: [...formData.hints, { level: formData.hints.length + 1, text: hintInput.trim(), unlocked: false }],
      });
      setHintInput('');
    }
  };

  const handleRemoveHint = (index: number) => {
    const newHints = formData.hints.filter((_, i) => i !== index).map((h, i) => ({ ...h, level: i + 1 }));
    setFormData({ ...formData, hints: newHints });
  };

  const handleAddResource = () => {
    if (resourceData.title.trim() && resourceData.url.trim()) {
      setFormData({
        ...formData,
        resources: [...formData.resources, { ...resourceData }],
      });
      setResourceData({ title: '', url: '', type: 'documentation' });
    }
  };

  const handleRemoveResource = (index: number) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.difficulty || !formData.code) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newQuestion = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        points: parseInt(formData.points) || 50,
        code: formData.code,
        solution: formData.solution,
        tags: formData.tags,
        hints: formData.hints,
        resources: formData.resources,
        author: user?.username || 'anonymous',
        completions: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'questions'), newQuestion);
      toast.success('Question uploaded successfully!');
      
      // Update user stats
      if (user) {
        updateUser({
          questionsUploaded: user.questionsUploaded + 1,
          points: user.points + 25, // Bonus points for uploading
        });
      }
      
      navigate('/home');
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <Button variant="ghost" onClick={() => navigate('/home')} className="mb-4 gap-2">
        <ArrowLeft size={18} />
        Back to Home
      </Button>

      <Card shadow="xl">
        <CardHeader className="border-b pb-6">
          <CardTitle className="text-3xl flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Upload size={32} className="text-blue-600" />
            Upload New Question
          </CardTitle>
          <CardDescription>
            Share your Lean problems with the community and earn +25 bonus points!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Question Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Prove the Pythagorean Theorem"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a clear description of what needs to be proven..."
                      className="min-h-[100px]"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">
                        Difficulty Level <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points">Points Reward</Label>
                      <Input
                        id="points"
                        type="number"
                        placeholder="50-200"
                        min="50"
                        max="200"
                        value={formData.points}
                        onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Add a tag (e.g., algebra)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline" size="icon">
                        <Plus size={18} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1 gap-1">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 rounded-full p-0.5">
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">2</span>
                  Lean Proof Code
                </h3>
                <div className="grid grid-cols-1 gap-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="code">Starter Code <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="code"
                      placeholder="theorem example : ... := by\n  sorry"
                      className="font-mono text-sm min-h-[150px] bg-gray-50"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solution">Official Solution</Label>
                    <Textarea
                      id="solution"
                      placeholder="theorem example : ... := by\n  rfl"
                      className="font-mono text-sm min-h-[150px] bg-gray-50"
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Hints and Resources Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">3</span>
                  Learning Support (Optional)
                </h3>
                <div className="grid grid-cols-1 gap-6 pl-10">
                  {/* Hints */}
                  <div className="space-y-3">
                    <Label>Progressive Hints</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a helpful hint..."
                        value={hintInput}
                        onChange={(e) => setHintInput(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddHint} variant="outline">
                        Add Hint
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.hints.map((hint, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <p className="text-sm text-gray-700">
                            <span className="font-bold mr-2 text-amber-700">Hint {hint.level}:</span>
                            {hint.text}
                          </p>
                          <button type="button" onClick={() => handleRemoveHint(i)} className="text-gray-400 hover:text-red-500">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="space-y-3">
                    <Label>Resource Materials</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        placeholder="Title (e.g., Lean Doc)"
                        value={resourceData.title}
                        onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
                        className="sm:col-span-1"
                      />
                      <Input
                        placeholder="URL (https://...)"
                        value={resourceData.url}
                        onChange={(e) => setResourceData({ ...resourceData, url: e.target.value })}
                        className="sm:col-span-1"
                      />
                      <div className="flex gap-2 sm:col-span-1">
                        <Select
                          value={resourceData.type}
                          onValueChange={(value) => setResourceData({ ...resourceData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="documentation">Doc</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="example">Example</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={handleAddResource} variant="outline" size="icon" className="shrink-0">
                          <Plus size={18} />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formData.resources.map((res, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{res.title}</p>
                            <p className="text-xs text-gray-500 truncate">{res.url}</p>
                          </div>
                          <button type="button" onClick={() => handleRemoveResource(i)} className="text-gray-400 hover:text-red-500 ml-2">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t">
              <Button type="submit" className="flex-1 h-12 text-lg gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Upload size={20} />
                Publish Question
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/home')} className="h-12 px-8">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
