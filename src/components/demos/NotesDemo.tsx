import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Save, X, Database, Loader2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
}

export const NotesDemo = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch notes');
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const createNote = async () => {
    if (!newTitle.trim()) return;

    const { error } = await supabase
      .from('notes')
      .insert({ title: newTitle, content: newContent, user_id: user?.id });

    if (error) {
      toast.error('Failed to create note');
    } else {
      toast.success('Note created!');
      setNewTitle('');
      setNewContent('');
      fetchNotes();
    }
  };

  const updateNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .update({ title: editTitle, content: editContent })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update note');
    } else {
      toast.success('Note updated!');
      setEditingId(null);
      fetchNotes();
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete note');
    } else {
      toast.success('Note deleted!');
      fetchNotes();
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content || '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Database CRUD
        </CardTitle>
        <CardDescription>
          Create, read, update, and delete notes with RLS protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Form */}
        <div className="space-y-2 p-4 rounded-lg bg-muted/50">
          <Input
            placeholder="Note title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            placeholder="Note content..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={2}
          />
          <Button onClick={createNote} size="sm" className="gradient-bg">
            <Plus className="h-4 w-4 mr-2" /> Add Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notes yet. Create your first one!
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg border bg-card animate-fade-in"
              >
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateNote(note.id)}>
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{note.title}</h4>
                      {note.content && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {note.content}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing(note)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
