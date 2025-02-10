import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Auth } from './components/Auth';
import { StoryForm } from './components/StoryForm';
import { StoryList } from './components/StoryList';
import { Resources } from './components/Resources';
import { Events } from './components/Events';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { PenSquare, BookOpen, Calendar, Menu, X } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);
  const [storyListKey, setStoryListKey] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const Navigation = () => {
    const closeMenu = () => setIsMenuOpen(false);

    return (
      <nav className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <img 
                  src="src/assets/plotline-clear-tight.png" 
                  alt="Plotline Logo" 
                  className="h-8 w-auto"
                />
                <h1 className="text-xl font-bold">Plotline</h1>
              </div>
              <div className="hidden md:flex ml-10 space-x-4">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Stories
                </Link>
                <Link
                  to="/resources"
                  className="text-gray-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <BookOpen className="h-5 w-5 inline-block mr-1" />
                  Resources
                </Link>
                <Link
                  to="/events"
                  className="text-gray-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Calendar className="h-5 w-5 inline-block mr-1" />
                  Events
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {location.pathname === '/' && (
                <button
                  onClick={() => setShowNewStoryForm(!showNewStoryForm)}
                  className="hidden md:flex px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <PenSquare className="h-5 w-5 inline-block mr-2" />
                  {showNewStoryForm ? 'Close Form' : 'New Story'}
                </button>
              )}
              <button
                onClick={() => supabase.auth.signOut()}
                className="hidden md:flex px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-900 hover:bg-blue-50"
              >
                Stories
              </Link>
              <Link
                to="/resources"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-900 hover:bg-blue-50"
              >
                <BookOpen className="h-5 w-5 inline-block mr-2" />
                Resources
              </Link>
              <Link
                to="/events"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-900 hover:bg-blue-50"
              >
                <Calendar className="h-5 w-5 inline-block mr-2" />
                Events
              </Link>
              {location.pathname === '/' && (
                <button
                  onClick={() => {
                    setShowNewStoryForm(!showNewStoryForm);
                    closeMenu();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-900 hover:bg-blue-50"
                >
                  <PenSquare className="h-5 w-5 inline-block mr-2" />
                  {showNewStoryForm ? 'Close Form' : 'New Story'}
                </button>
              )}
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-900 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                <Navigation />
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  {showNewStoryForm ? (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Create New Story</h2>
                      <StoryForm 
                        onSuccess={() => {
                          setShowNewStoryForm(false);
                          setStoryListKey(prev => prev + 1);
                        }} 
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Your Stories</h2>
                      <StoryList key={storyListKey} />
                    </div>
                  )}
                </main>
              </div>
            ) : (
              <Auth />
            )
          }
        />
        <Route
          path="/resources"
          element={
            user ? (
              <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                <Navigation />
                <Resources />
              </div>
            ) : (
              <Auth />
            )
          }
        />
        <Route
          path="/events"
          element={
            user ? (
              <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                <Navigation />
                <Events />
              </div>
            ) : (
              <Auth />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;