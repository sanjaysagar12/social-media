'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import UploadImage from "@/components/UploadImage";
import { Send, X, ImageIcon } from 'lucide-react';

interface PostFormProps {
  postContent: string;
  setPostContent: (content: string) => void;
  postImage: string;
  handleImageUploaded: (imageUrl: string) => void;
  handleCreatePost: () => void;
  handleCancelPost: () => void;
  isCreatingPost: boolean;
}

export default function PostForm({ 
  postContent, 
  setPostContent, 
  postImage, 
  handleImageUploaded, 
  handleCreatePost, 
  handleCancelPost, 
  isCreatingPost 
}: PostFormProps) {

  // Dummy upload function, replace with your actual upload logic
  async function uploadFileAndGetUrl(file: File): Promise<string> {
    // Example: upload to server or cloud, then return the image URL
    // For now, just return a local object URL for preview
    return URL.createObjectURL(file);
  }

  // Handler for UploadImage
  const handleImageSelected = async (file: File) => {
    const url = await uploadFileAndGetUrl(file);
    handleImageUploaded(url);
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share your progress, ideas, or questions..."
              rows={4}
              className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="space-y-2">
              <Label className="text-gray-700">Image (Optional)</Label>
              <UploadImage 
                onImageSelected={handleImageSelected}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  disabled={isCreatingPost}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Add Image</span>
                </Button>
                {isCreatingPost && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePost}
                  disabled={isCreatingPost || !postContent.trim()}
                  className="space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send className="w-4 h-4" />
                  <span>{isCreatingPost ? 'Posting...' : 'Post'}</span>
                </Button>
                <Button
                  onClick={handleCancelPost}
                  variant="outline"
                  disabled={isCreatingPost}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}