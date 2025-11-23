import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ChatBot from './components/ChatBot';
import { User } from './types';
import * as AuthService from './services/auth';

interface ProtectedRouteProps {
  user: User | null;
  children?: React.ReactNode;
}

// Protected Route Component
const ProtectedRoute = ({ children, user }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/portfolio-login" replace />;
  }
  return <>{children}</>;
};

// Color Palettes (RGB Values)
const PALETTES = {
  green: {
    50: '240 253 244',
    100: '220 252 231',
    200: '187 247 208',
    300: '134 239 172',
    400: '74 222 128',
    500: '34 197 94',
    600: '22 163 74',
    700: '21 128 61',
    800: '22 101 52',
    900: '20 83 45',
  },
  blue: {
    50: '239 246 255',
    100: '219 234 254',
    200: '191 219 254',
    300: '147 197 253',
    400: '96 165 250',
    500: '59 130 246',
    600: '37 99 235',
    700: '29 78 216',
    800: '30 64 175',
    900: '30 58 138',
  },
  purple: {
    50: '250 245 255',
    100: '243 232 255',
    200: '233 213 255',
    300: '216 180 254',
    400: '192 132 252',
    500: '168 85 247',
    600: '147 51 234',
    700: '126 34 206',
    800: '107 33 168',
    900: '88 28 135',
  },
  orange: {
    50: '255 247 237',
    100: '255 237 213',
    200: '254 215 170',
    300: '253 186 116',
    400: '251 146 60',
    500: '249 115 22',
    600: '234 88 12',
    700: '194 65 12',
    800: '154 52 18',
    900: '124 45 18',
  }
};

export type ColorTheme = keyof typeof PALETTES;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Theme State (Dark/Light)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light';
    }
    return 'dark';
  });

  // Color Theme State
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('colorTheme') as ColorTheme) || 'green';
  });

  useEffect(() => {
    // Check for existing session
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Apply Light/Dark theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply Color Theme Variables
  useEffect(() => {
    const palette = PALETTES[colorTheme];
    const root = document.documentElement;
    
    Object.entries(palette).forEach(([shade, value]) => {
      root.style.setProperty(`--android-${shade}`, value as string);
    });
    
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white transition-colors duration-300">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans selection:bg-android-500 selection:text-white transition-colors duration-300">
        <Navbar 
          user={user} 
          setUser={setUser} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          colorTheme={colorTheme}
          setColorTheme={setColorTheme}
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/portfolio-login" 
            element={user ? <Navigate to="/admin" /> : <Login setUser={setUser} />} 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user}>
                <Admin user={user!} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Floating AI Chatbot */}
        <ChatBot />
      </div>
    </Router>
  );
};

export default App;