import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  avatar?: string;
  level: number;
  questionsCompleted: number;
  questionsUploaded: number;
  savedQuestions?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  toggleSaveQuestion: (questionId: string) => Promise<boolean | undefined>;
  deleteUserAccount: (userId: string) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = { id: firebaseUser.uid, ...userDoc.data() } as User;
            setUser(userData);
            
            // Request notification permission and save token if granted
            import('../../firebase').then(async ({ requestNotificationPermission }) => {
              const token = await requestNotificationPermission();
              if (token) {
                // Update the user's document with the new FCM token
                await updateDoc(doc(db, 'users', firebaseUser.uid), {
                  fcmToken: token
                });
              }
            });
            
          } else {
            // Document doesn't exist. This can happen if signup was interrupted.
            // We'll create a basic profile so the user isn't stuck.
            const basicUser: User = {
              id: firebaseUser.uid,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              points: 0,
              level: 1,
              questionsCompleted: 0,
              questionsUploaded: 0,
              savedQuestions: [],
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              username: basicUser.username,
              email: basicUser.email,
              points: basicUser.points,
              level: basicUser.level,
              questionsCompleted: basicUser.questionsCompleted,
              questionsUploaded: basicUser.questionsUploaded,
              savedQuestions: basicUser.savedQuestions,
            });
            
            setUser(basicUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Real login with Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (username: string, email: string, password: string) => {
    // Real signup with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create the new user object
    const newUser: User = {
      id: userCredential.user.uid,
      username,
      email,
      points: 0,
      level: 1,
      questionsCompleted: 0,
      questionsUploaded: 0,
      savedQuestions: [],
    };
    
    // Save to Firestore 'users' collection
    await setDoc(doc(db, 'users', newUser.id), {
      username: newUser.username,
      email: newUser.email,
      points: newUser.points,
      level: newUser.level,
      questionsCompleted: newUser.questionsCompleted,
      questionsUploaded: newUser.questionsUploaded,
      savedQuestions: newUser.savedQuestions,
    });
    
    setUser(newUser);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, updates);
        setUser({ ...user, ...updates });
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    }
  };

  const toggleSaveQuestion = async (questionId: string) => {
    if (!user) return;
    
    const isSaved = user.savedQuestions?.includes(questionId);
    const newSaved = isSaved 
      ? user.savedQuestions?.filter(id => id !== questionId) 
      : [...(user.savedQuestions || []), questionId];
      
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { savedQuestions: newSaved });
      setUser({ ...user, savedQuestions: newSaved });
      return !isSaved; // Returns true if saved, false if unsaved
    } catch (error) {
      console.error("Error toggling save:", error);
      throw error;
    }
  };

  const deleteUserAccount = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      await deleteDoc(doc(db, 'questions', questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateUser, 
      toggleSaveQuestion,
      deleteUserAccount,
      deleteQuestion
    }}>
      {/* We don't render children until the initial auth check is done to prevent flickering */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
