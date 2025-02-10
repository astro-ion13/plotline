import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Save, Wand2 } from 'lucide-react';
import { TextAnalysis } from './TextAnalysis';
import { StickyNotes } from './StickyNotes';

interface Story {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface StoryFormProps {
  onSuccess?: () => void;
  story?: Story;
  mode?: 'create' | 'edit';
}

interface AIEnhancement {
  readability: string;
  grammar: string;
  emotional: string;
}

export function StoryForm({ onSuccess, story, mode = 'create' }: StoryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIEnhancement | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [storyId, setStoryId] = useState<string | null>(null);

  useEffect(() => {
    if (story && mode === 'edit') {
      setTitle(story.title);
      setContent(story.content);
      setTags(story.tags.join(', '));
      setStoryId(story.id);
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
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      let supabaseError;
      let newStoryId;

      if (mode === 'edit' && story) {
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', story.id)
          .eq('user_id', user.id);
        supabaseError = error;
        newStoryId = story.id;
      } else {
        const { data, error } = await supabase
          .from('stories')
          .insert([storyData])
          .select()
          .single();
        supabaseError = error;
        newStoryId = data?.id;
      }

      if (supabaseError) throw supabaseError;

      if (mode === 'create') {
        setTitle('');
        setContent('');
        setTags('');
      }

      setStoryId(newStoryId);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${mode} story`);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceStory = async () => {
    setIsEnhancing(true);
    setError(null);
    setShowAnalysis(true);
    
    try {
      // Simulated AI response for now - replace with actual AI integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAiSuggestions({
        readability: "Consider breaking the longer paragraphs into smaller ones for better readability. Try using more active voice constructions.",
        grammar: "The text appears grammatically sound. Consider varying sentence structure for more engaging flow.",
        emotional: "The emotional impact could be enhanced by adding more sensory details and showing character reactions rather than telling them."
      });
    } catch (err) {
      setError('Failed to enhance story. Please try again later.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-blue-100">
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Enter your story title"
          />
        </div>

        <div className="relative">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Story Text *
          </label>
          <textarea
            id="content"
            required
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setShowAnalysis(false);
            }}
            rows={6}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Write your story here..."
          />
          {content.length > 0 && (
            <div className="absolute top-0 right-0 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
              </button>
              <button
                type="button"
                onClick={handleEnhanceStory}
                disabled={isEnhancing}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                <Wand2 className="h-4 w-4" />
                Enhance Story
              </button>
            </div>
          )}
        </div>

        {showAnalysis && content && (
          <div className="border border-blue-100 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Text Analysis</h3>
            <TextAnalysis text={content} />
          </div>
        )}

        {isEnhancing && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Analyzing your story...</span>
          </div>
        )}

        {aiSuggestions && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-medium text-blue-900">AI Suggestions</h3>
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium text-blue-800">Readability</h4>
                <p className="text-sm text-gray-700">{aiSuggestions.readability}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">Grammar & Structure</h4>
                <p className="text-sm text-gray-700">{aiSuggestions.grammar}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">Emotional Impact</h4>
                <p className="text-sm text-gray-700">{aiSuggestions.emotional}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Enter tags separated by commas"
          />
          <p className="mt-1 text-sm text-gray-500">Optional: Separate tags with commas</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
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

      {storyId && (
        <StickyNotes storyId={storyId} />
      )}
    </div>
  );
}