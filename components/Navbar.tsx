import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LogOut, Shield, User as UserIcon, Sun, Moon, Menu, X, Smartphone, Palette, Code2 } from 'lucide-react';
import * as AuthService from '../services/auth';
import { ColorTheme } from '../App';

interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, setUser, theme, toggleTheme, colorTheme, setColorTheme }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const colors: { id: ColorTheme; label: string; color: string }[] = [
    { id: 'green', label: 'Android Green', color: 'bg-green-500' },
    { id: 'blue', label: 'Ocean Blue', color: 'bg-blue-500' },
    { id: 'purple', label: 'Royal Purple', color: 'bg-purple-500' },
    { id: 'orange', label: 'Sunset Orange', color: 'bg-orange-500' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-android-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-android-500/30 group-hover:scale-110 transition-transform duration-300">
                <Code2 size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white group-hover:text-android-600 dark:group-hover:text-android-400 transition-colors">
                Rabin Adhikari
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-android-600 dark:hover:text-android-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Portfolio
            </Link>
            
            {user && (
              <Link to="/admin" className="text-slate-600 dark:text-slate-300 hover:text-android-600 dark:hover:text-android-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Dashboard
              </Link>
            )}

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            {/* Color Picker */}
            <div className="relative">
              <button 
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Change Theme Color"
              >
                <Palette size={20} />
              </button>
              
              {isColorPickerOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsColorPickerOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20 animate-fade-in">
                    <div className="p-2 space-y-1">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => { setColorTheme(c.id); setIsColorPickerOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            colorTheme === c.id 
                              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full ${c.color} shadow-sm`}></span>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <div className="flex items-center gap-4 ml-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="relative">
                     {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600" />
                     ) : (
                        <div className="w-8 h-8 rounded-full bg-android-100 dark:bg-android-900 flex items-center justify-center text-android-600 dark:text-android-400 border border-slate-200 dark:border-slate-700">
                          <UserIcon size={16} />
                        </div>
                     )}
                     <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
                       {user.role === 'ADMIN' ? <Shield size={12} className="text-android-600" /> : null}
                     </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{user.role.toLowerCase()}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button 
                onClick={() => {
                   const themes: ColorTheme[] = ['green', 'blue', 'purple', 'orange'];
                   const next = themes[(themes.indexOf(colorTheme) + 1) % themes.length];
                   setColorTheme(next);
                }}
                className="p-2 rounded-full text-android-600 dark:text-android-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
              <Palette size={20} />
            </button>
             <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-android-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-android-600 transition-colors"
            >
              Portfolio
            </Link>
            
            {user && (
              <Link 
                to="/admin" 
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-android-600 transition-colors"
              >
                Dashboard
              </Link>
            )}

            {user && (
              <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                <div className="flex items-center px-3 mb-3">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="h-10 w-10 rounded-full" />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-android-100 dark:bg-android-900 flex items-center justify-center text-android-600 dark:text-android-400">
                          {user.role === 'ADMIN' ? <Shield size={16} /> : <UserIcon size={16} />}
                        </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-slate-800 dark:text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-slate-500 dark:text-slate-400 mt-1">@{user.username} • {user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;