import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Book, Calendar, Edit, Search, X, Trash2 } from 'lucide-react';
import { StoryForm } from './StoryForm';

interface Story {
  id: string;
  title: string;
  content: string;
  tags: string[];
  notes?: string;
  created_at: string;
}

interface DeleteConfirmationProps {
  story: Story;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmation({ story, onConfirm, onCancel }: DeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Story</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete "{story.title}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDeleteStory = async (story: Story) => {
    setDeleteLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error: deleteError } = await supabase
        .from('stories')
        .delete()
        .eq('id', story.id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setStories(prevStories => prevStories.filter(s => s.id !== story.id));
      setFilteredStories(prevStories => prevStories.filter(s => s.id !== story.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story');
    } finally {
      setDeleteLoading(false);
      setStoryToDelete(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-8">
        <Book className="h-12 w-12 mx-auto text-blue-400 mb-4" />
        <p className="text-gray-600">No stories yet. Click "New Story" to start writing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {storyToDelete && (
        <DeleteConfirmation
          story={storyToDelete}
          onConfirm={() => handleDeleteStory(storyToDelete)}
          onCancel={() => setStoryToDelete(null)}
        />
      )}

      {editingStory && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-900">Edit Story</h2>
            <button
              onClick={() => setEditingStory(null)}
              className="text-gray-600 hover:text-blue-800 transition-colors"
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
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
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
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {filteredStories.map((story) => (
                <div key={story.id} className="bg-white rounded-lg shadow-md p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-blue-900">{story.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingStory(story)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edit story"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setStoryToDelete(story)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete story"
                        disabled={deleteLoading}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{story.content}</p>
                  {story.tags && story.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap">
                      {story.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-50 text-blue-800 text-sm px-2 py-1 rounded-full mr-2 mb-2"
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