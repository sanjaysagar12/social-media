'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadImage from "@/components/UploadImage";
import { 
  Calendar, 
  FileText, 
  ImageIcon, 
  Clock, 
  Plus,
  ArrowLeft,
  Sparkles,
  Users,
  Target
} from 'lucide-react';

export default function CreateStepPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    startDate: '',
    endDate: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      thumbnail: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        alert('Please login first');
        return;
      }

  const response = await fetch('http://localhost:3000/api/step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail,
          startDate: formData.startDate,
          endDate: formData.endDate,
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Step created successfully!');
        setFormData({
          title: '',
          description: '',
          thumbnail: '',
          startDate: '',
          endDate: ''
        });
      } else {
        alert(`Error: ${result.message || 'Failed to create step'}`);
      }
    } catch (error) {
      console.error('Error creating step:', error);
      alert('Failed to create step');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="absolute left-4 top-8 flex items-center gap-2 text-gray-600 hover:bg-gray-100 border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Create New Step</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Bring your community together with an actionable Step
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step Title */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      <Label htmlFor="title" className="text-gray-900 font-semibold">Step Title *</Label>
                    </div>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter an exciting step title..."
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <Label htmlFor="description" className="text-gray-900 font-semibold">Description</Label>
                    </div>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your step in detail. What makes it special?"
                      rows={6}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* prize removed (backend no longer supports prize) */}

                  {/* Step Thumbnail */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                      <Label className="text-gray-900 font-semibold">Step Thumbnail</Label>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <UploadImage 
                        onImageUploaded={handleImageUploaded}
                        currentImage={formData.thumbnail}
                      />
                      {formData.thumbnail && (
                        <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
                          <Sparkles className="w-4 h-4" />
                          Image uploaded successfully!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <Label className="text-gray-900 font-semibold">Step Schedule *</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-gray-600 text-sm">Start Date & Time</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-gray-600 text-sm">End Date & Time</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      disabled={isLoading || !formData.title || !formData.startDate || !formData.endDate}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Step...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Plus className="w-5 h-5" />
                          Create Step
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            {formData.title && (
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-gray-900">Preview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="text-gray-900 font-semibold text-lg line-clamp-2">{formData.title}</h3>
                    {formData.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">{formData.description}</p>
                    )}
                    {/* prize removed from preview (backend no longer supports prize) */}
                    {formData.startDate && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(formData.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}