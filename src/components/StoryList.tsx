import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Book, Calendar, Edit, Search, X } from 'lucide-react';
import { StoryForm } from './StoryForm';

interface Story {
  id: string;
  title: string;
  content: string;
  tags: string[];
  notes?: string;
  created_at: string;
}

export function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStories(stories);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = stories.filter(story => 
      story.title.toLowerCase().includes(query) ||
      story.content.toLowerCase().includes(query) ||
      story.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (story.notes && story.notes.toLowerCase().includes(query))
    );
    setFilteredStories(filtered);
  }, [searchQuery, stories]);

  const fetchStories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: supabaseError } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setStories(data || []);
      setFilteredStories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        {error}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-8">
        <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No stories yet. Click "New Story" to start writing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {editingStory && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Edit Story</h2>
            <button
              onClick={() => setEditingStory(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
          <StoryForm
            mode="edit"
            story={editingStory}
            onSuccess={() => {
              setEditingStory(null);
              fetchStories();
            }}
          />
        </div>
      )}

      {!editingStory && (
        <>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories by title, content, tags, or notes..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {filteredStories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No stories found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredStories.map((story) => (
                <div key={story.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{story.title}</h3>
                    <button
                      onClick={() => setEditingStory(story)}
                      className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                      title="Edit story"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{story.content}</p>
                  {story.tags && story.tags.length > 0 && (
                    <div className="mb-4">
                      {story.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full mr-2 mb-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {story.notes && (
                    <p className="text-sm text-gray-500 italic mb-4">{story.notes}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(story.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}