import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Auth } from './components/Auth';
import { StoryForm } from './components/StoryForm';
import { StoryList } from './components/StoryList';
import { Resources } from './components/Resources';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { PenSquare, BookOpen } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);
  const [storyListKey, setStoryListKey] = useState(0);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">Storytelling App</h1>
                        <div className="ml-10 flex space-x-4">
                          <Link
                            to="/"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Stories
                          </Link>
                          <Link
                            to="/resources"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            <BookOpen className="h-5 w-5 inline-block mr-1" />
                            Resources
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setShowNewStoryForm(!showNewStoryForm)}
                          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PenSquare className="h-5 w-5 inline-block mr-2" />
                          {showNewStoryForm ? 'Close Form' : 'New Story'}
                        </button>
                        <button
                          onClick={() => supabase.auth.signOut()}
                          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </nav>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  {showNewStoryForm ? (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Story</h2>
                      <StoryForm 
                        onSuccess={() => {
                          setShowNewStoryForm(false);
                          setStoryListKey(prev => prev + 1);
                        }} 
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Stories</h2>
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
              <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">Storytelling App</h1>
                        <div className="ml-10 flex space-x-4">
                          <Link
                            to="/"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Stories
                          </Link>
                          <Link
                            to="/resources"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            <BookOpen className="h-5 w-5 inline-block mr-1" />
                            Resources
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => supabase.auth.signOut()}
                          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </nav>
                <Resources />
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