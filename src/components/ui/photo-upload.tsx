'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

type PhotoUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
};

export const PhotoUpload = ({ value, onChange, disabled = false }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1 * 1024 * 1024) {
      toast.error('Photo size must be less than 1MB');
      event.target.value = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      event.target.value = '';
      return;
    }

    setIsUploading(true);

    try {
      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-client-photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const { url } = await response.json();
      onChange(url);
      setPreview(url);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
      // Reset preview on error
      setPreview(value || '');
      event.target.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2 flex justify-center">
      <div className="relative">
        <div
          className="h-24 w-24 border border-input rounded-md bg-background flex items-center justify-center cursor-pointer hover:bg-accent transition-colors group relative overflow-hidden"
          onClick={() => document.getElementById('photo-input')?.click()}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Uploaded photo"
              width={96}
              height={96}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <Camera className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        <Input
          id="photo-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </div>
    </div>
  );
};
