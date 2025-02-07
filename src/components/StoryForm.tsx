import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Save } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  tags: string[];
  notes?: string;
}

interface StoryFormProps {
  onSuccess?: () => void;
  story?: Story;
  mode?: 'create' | 'edit';
}

export function StoryForm({ onSuccess, story, mode = 'create' }: StoryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (story && mode === 'edit') {
      setTitle(story.title);
      setContent(story.content);
      setTags(story.tags.join(', '));
      setNotes(story.notes || '');
    }
  }, [story, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const storyData = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        notes,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      let supabaseError;

      if (mode === 'edit' && story) {
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', story.id)
          .eq('user_id', user.id);
        supabaseError = error;
      } else {
        const { error } = await supabase
          .from('stories')
          .insert([storyData]);
        supabaseError = error;
      }

      if (supabaseError) throw supabaseError;

      if (mode === 'create') {
        setTitle('');
        setContent('');
        setTags('');
        setNotes('');
      }
      
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${mode} story`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter your story title"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Story Text *
        </label>
        <textarea
          id="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Write your story here..."
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter tags separated by commas"
        />
        <p className="mt-1 text-sm text-gray-500">Optional: Separate tags with commas</p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Add any additional notes here..."
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              {mode === 'edit' ? 'Update Story' : 'Save Story'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}