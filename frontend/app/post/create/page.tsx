'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UploadImage from '@/components/UploadImage';
import { ArrowLeft, Plus, ImageIcon } from 'lucide-react';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUploaded = (url: string) => {
    setImage(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Please enter content for the post');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login first');
        return;
      }

      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          image: image || undefined,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Post created');
        setContent('');
        setImage('');
      } else {
        alert(result.message || 'Failed to create post');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] relative overflow-hidden py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-white/5 backdrop-blur-md border border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E94042] rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-white">Create Post</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-white">Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Share something..."
                />
              </div>

              <div>
                <Label className="text-white">Image (optional)</Label>
                <UploadImage onImageUploaded={handleImageUploaded} currentImage={image} />
                {image && (
                  <div className="mt-2 text-sm text-green-400">Image ready</div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => history.back()} className="text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" className="bg-[#E94042] hover:bg-[#E94042]/90" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
