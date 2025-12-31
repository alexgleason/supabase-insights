import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Trash2, FileImage, Loader2, HardDrive } from 'lucide-react';

interface UploadedFile {
  name: string;
  url: string;
}

export const StorageDemo = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    if (!user) return;

    const { data, error } = await supabase.storage
      .from('uploads')
      .list(user.id, { limit: 20 });

    if (error) {
      console.error('Error fetching files:', error);
    } else if (data) {
      const fileUrls = data.map((file) => ({
        name: file.name,
        url: supabase.storage
          .from('uploads')
          .getPublicUrl(`${user.id}/${file.name}`).data.publicUrl,
      }));
      setFiles(fileUrls);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchFiles();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file);

    if (error) {
      toast.error('Failed to upload file');
    } else {
      toast.success('File uploaded!');
      fetchFiles();
    }

    setUploading(false);
    e.target.value = '';
  };

  const deleteFile = async (fileName: string) => {
    if (!user) return;

    const { error } = await supabase.storage
      .from('uploads')
      .remove([`${user.id}/${fileName}`]);

    if (error) {
      toast.error('Failed to delete file');
    } else {
      toast.success('File deleted!');
      fetchFiles();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-primary" />
          File Storage
        </CardTitle>
        <CardDescription>
          Upload and manage files with secure bucket storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button */}
        <div className="flex items-center gap-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button asChild disabled={uploading} className="gradient-bg">
              <span>
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Image
              </span>
            </Button>
          </label>
          <span className="text-sm text-muted-foreground">Max 5MB</span>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : files.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <FileImage className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.name}
                className="relative group rounded-lg overflow-hidden border bg-card animate-scale-in"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-24 object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteFile(file.name)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <p className="text-xs truncate p-1.5 bg-card/90">
                  {file.name.split('-').slice(1).join('-')}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
