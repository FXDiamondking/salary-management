import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Background3D } from '../Background3D/Background3D';
import { Sun, Moon, BarChart3, Users2, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <div className={`min-h-screen font-['Inter',system-ui,sans-serif] transition-colors duration-300 ${dark ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Ambient background layers */}
      <div className="mesh-gradient" />
      <Background3D />

      {/* Glassmorphic header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">
              Salary Manager
            </h1>
          </a>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <nav className="flex gap-1 p-1 rounded-xl bg-slate-100/50 dark:bg-white/5 backdrop-blur-sm">
              <a
                href="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  path === '/'
                    ? 'nav-active shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </a>
              <a
                href="/employees"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  path === '/employees'
                    ? 'nav-active shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Users2 className="w-4 h-4" />
                Directory
              </a>
            </nav>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="ml-2 p-2 rounded-xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
