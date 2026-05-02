import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Plus, Tag, Save } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface MaterialNote {
  id: string;
  name: string;
  source: string;
  x: number;
  y: number;
}

interface DraftState {
  title: string;
  description: string;
  selectedImage: string | null;
  materials: MaterialNote[];
  challengeId?: string;
}

export function Compose() {
  const navigate = useNavigate();
  const location = useLocation();
  const challengeId = (location.state as any)?.challengeId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [materials, setMaterials] = useState<MaterialNote[]>([]);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', source: '' });
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem('composerDraft');
    if (savedDraft) {
      const draft: DraftState = JSON.parse(savedDraft);
      setTitle(draft.title);
      setDescription(draft.description);
      setSelectedImage(draft.selectedImage);
      setMaterials(draft.materials);
    }
  }, []);

  const saveDraft = () => {
    const draft: DraftState = {
      title,
      description,
      selectedImage,
      materials,
      challengeId,
    };
    localStorage.setItem('composerDraft', JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  useEffect(() => {
    const autoSave = setInterval(() => {
      if (title || description || selectedImage || materials.length > 0) {
        saveDraft();
      }
    }, 30000);
    return () => clearInterval(autoSave);
  }, [title, description, selectedImage, materials]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMaterial = () => {
    if (newMaterial.name) {
      setMaterials([
        ...materials,
        {
          id: Date.now().toString(),
          ...newMaterial,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        },
      ]);
      setNewMaterial({ name: '', source: '' });
      setIsAddingMaterial(false);
    }
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handlePublish = () => {
    localStorage.removeItem('composerDraft');
    if (challengeId) {
      navigate(`/challenge/${challengeId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl tracking-tight mb-2">
                {challengeId ? 'Submit Challenge Solution' : 'New Post'}
              </h1>
              <p className="text-sm text-[#78716c]">
                {challengeId
                  ? 'Share your design approach for this challenge'
                  : 'Share your latest project or inspiration'}
              </p>
            </div>
            <button
              onClick={saveDraft}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#78716c] hover:text-[#1c1917] transition-colors"
            >
              <Save size={16} />
              <span>{draftSaved ? 'Saved' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {!selectedImage ? (
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="block aspect-[4/3] bg-white rounded-xl border-2 border-dashed border-[#e7e5e4] hover:border-[#1c1917] cursor-pointer transition-colors group"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <div className="h-full flex flex-col items-center justify-center gap-3 text-[#78716c] group-hover:text-[#1c1917] transition-colors">
                <Upload size={32} />
                <div className="text-center">
                  <p className="text-sm font-medium">Upload an image</p>
                  <p className="text-xs mt-1">or drag and drop</p>
                </div>
              </div>
            </motion.label>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <img
                src={selectedImage}
                alt="Upload preview"
                className="w-full h-auto"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <X size={18} />
              </button>

              {materials.map((material) => (
                <motion.div
                  key={material.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute group"
                  style={{ left: `${material.x}%`, top: `${material.y}%` }}
                >
                  <div className="relative">
                    <button
                      onClick={() => removeMaterial(material.id)}
                      className="w-4 h-4 bg-[#1c1917] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 z-10"
                    >
                      <X size={10} />
                    </button>
                    <div className="w-3 h-3 bg-white rounded-full border-2 border-[#1c1917]" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-[#1c1917] text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-xl">
                        <p className="font-medium">{material.name}</p>
                        {material.source && (
                          <p className="text-[#a8a29e] mt-0.5">{material.source}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm text-[#78716c] mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a title"
                className="w-full px-4 py-3 bg-[#fafaf9] border border-[#e7e5e4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c1917] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-[#78716c] mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your design choices"
                rows={4}
                className="w-full px-4 py-3 bg-[#fafaf9] border border-[#e7e5e4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c1917] focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Materials & Sources</h3>
              <button
                onClick={() => setIsAddingMaterial(!isAddingMaterial)}
                className="p-2 hover:bg-[#f5f5f4] rounded-full transition-colors"
              >
                <Plus size={18} className="text-[#78716c]" />
              </button>
            </div>

            {isAddingMaterial && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 mb-4 pb-4 border-b border-[#e7e5e4]"
              >
                <input
                  type="text"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  placeholder="Material name"
                  className="w-full px-3 py-2 bg-[#fafaf9] border border-[#e7e5e4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c1917] focus:border-transparent"
                />
                <input
                  type="text"
                  value={newMaterial.source}
                  onChange={(e) => setNewMaterial({ ...newMaterial, source: e.target.value })}
                  placeholder="Source (optional)"
                  className="w-full px-3 py-2 bg-[#fafaf9] border border-[#e7e5e4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c1917] focus:border-transparent"
                />
                <button
                  onClick={addMaterial}
                  className="w-full py-2 bg-[#1c1917] text-white rounded-lg text-sm hover:bg-[#292524] transition-colors"
                >
                  Add Material
                </button>
              </motion.div>
            )}

            <div className="space-y-2">
              {materials.length === 0 ? (
                <p className="text-xs text-[#a8a29e] text-center py-4">
                  No materials added yet
                </p>
              ) : (
                materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center gap-2 p-3 bg-[#fafaf9] rounded-lg"
                  >
                    <Tag size={14} className="text-[#78716c]" />
                    <div className="flex-1">
                      <p className="text-sm">{material.name}</p>
                      {material.source && (
                        <p className="text-xs text-[#78716c]">{material.source}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <motion.button
            onClick={handlePublish}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-[#1c1917] text-white rounded-xl font-medium hover:bg-[#292524] transition-colors shadow-sm"
          >
            Publish
          </motion.button>
        </div>
      </div>
    </div>
  );
}
