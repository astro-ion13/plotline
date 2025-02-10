import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, Loader2 } from 'lucide-react';

interface StickyNote {
  id: string;
  story_id: string;
  content: string;
  color: string;
}

interface StickyNotesProps {
  storyId: string;
}

const COLORS = ['yellow', 'green', 'blue', 'pink', 'purple'];

export function StickyNotes({ storyId }: StickyNotesProps) {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [storyId]);

  const fetchNotes = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('sticky_notes')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sticky notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    try {
      const { data, error: insertError } = await supabase
        .from('sticky_notes')
        .insert([{
          story_id: storyId,
          content: '',
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) {
        setNotes([...notes, data]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add sticky note');
    }
  };

  const updateNote = async (noteId: string, updates: Partial<StickyNote>) => {
    try {
      const { error: updateError } = await supabase
        .from('sticky_notes')
        .update(updates)
        .eq('id', noteId);

      if (updateError) throw updateError;
      
      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, ...updates } : note
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update sticky note');
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('sticky_notes')
        .delete()
        .eq('id', noteId);

      if (deleteError) throw deleteError;
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sticky note');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
      </div>
    );
  }

  const getColorClass = (color: string) => {
    const colorClasses = {
      yellow: 'bg-yellow-100 hover:bg-yellow-200',
      green: 'bg-green-100 hover:bg-green-200',
      blue: 'bg-blue-100 hover:bg-blue-200',
      pink: 'bg-pink-100 hover:bg-pink-200',
      purple: 'bg-purple-100 hover:bg-purple-200'
    };
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.yellow;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Story Notes</h3>
        <button
          onClick={addNote}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-12 bg-blue-50 rounded-lg">
          <p className="text-gray-500">Add your first note to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`${getColorClass(note.color)} rounded-lg shadow-md transition-shadow hover:shadow-lg`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateNote(note.id, { color })}
                        className={`w-4 h-4 rounded-full ${getColorClass(color)} border border-gray-300 transition-transform hover:scale-110`}
                        title={`Change to ${color}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete note"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={note.content}
                  onChange={(e) => updateNote(note.id, { content: e.target.value })}
                  className="w-full bg-transparent border-none resize-none focus:ring-0 p-0 min-h-[120px]"
                  placeholder="Write your note..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}