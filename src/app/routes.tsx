import { createBrowserRouter, Navigate } from 'react-router';
import SplashScreen from './pages/SplashScreen';
import LoginSignup from './pages/LoginSignup';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './components/Layout';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Question from './pages/Question';
import UploadQuestion from './pages/UploadQuestion';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashScreen />,
  },
  {
    path: '/auth',
    element: <LoginSignup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'questions',
        element: <Questions />,
      },
      {
        path: 'question/:id',
        element: <Question />,
      },
      {
        path: 'upload',
        element: <UploadQuestion />,
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'edit-profile',
        element: <EditProfile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);