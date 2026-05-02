import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = localStorage.getItem('leanlingo_user');
      if (user) {
        navigate('/home');
      } else {
        navigate('/auth');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="relative flex justify-center">
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="relative w-40 h-40 bg-white/20 rounded-3xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-8xl">L</span>
            </div>
          </div>
          <div className="relative w-40 h-40 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-8xl">L</span>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-300 rounded-full border-8 border-white/20"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-bold text-white text-6xl flex items-center justify-center gap-3">
            LEANLINGO
            <Sparkles size={48} className="text-yellow-300" />
          </h1>
          <p className="text-white/90 text-xl">
            Master Mathematical Proofs with Lean
          </p>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}