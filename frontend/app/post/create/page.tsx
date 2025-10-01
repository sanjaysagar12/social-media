'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UploadImage from '@/components/UploadImage';
import { ArrowLeft, Plus, ImageIcon, Sparkles } from 'lucide-react';
import { API_CONFIG, getApiUrl } from '@/lib/api';

export default function CreatePostPage() {
  const router = useRouter();
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

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.POSTS), {
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
        alert('Post created successfully!');
        setContent('');
        setImage('');
        // Navigate to explore page
        router.push('/explore');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">Share your thoughts and connect with the community</p>
        </div>

        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content Section */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-lg">What's on your mind?</Label>
                <Textarea
                  value={content}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setContent(e.target.value);
                    }
                  }}
                  rows={5}
                  className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none text-base"
                  placeholder="Share your story, ask a question, or start a discussion..."
                />
                <p className={`text-sm mt-1 ${content.length > 450 ? 'text-orange-600' : content.length > 480 ? 'text-red-600' : 'text-gray-500'}`}>
                  {content.length}/500 characters
                </p>
              </div>

              {/* Image Section */}
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Add an image (optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <UploadImage onImageUploaded={handleImageUploaded} currentImage={image} />
                  {image && (
                    <div className="mt-4">
                      <img
                        src={image}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          console.error('Failed to load image:', image);
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        ✓ Image uploaded successfully
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !content.trim()}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Post...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
