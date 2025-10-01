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
  Target
} from 'lucide-react';
import { API_CONFIG, getApiUrl } from '@/lib/api';

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

  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STEPS), {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Step</h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Bring your community together with an actionable Step
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 border-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Steps
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step Title */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <Label htmlFor="title" className="text-gray-900 font-semibold text-lg">Step Title</Label>
                        <p className="text-gray-500 text-sm">Give your step a compelling title</p>
                      </div>
                    </div>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter an exciting step title..."
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-gray-900 font-semibold text-lg">Description</Label>
                        <p className="text-gray-500 text-sm">Describe what participants will do</p>
                      </div>
                    </div>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your step in detail. What makes it special?"
                      rows={6}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-none text-base"
                    />
                  </div>

                  {/* Step Thumbnail */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <Label className="text-gray-900 font-semibold text-lg">Step Thumbnail</Label>
                        <p className="text-gray-500 text-sm">Add a visual representation (optional)</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                      <UploadImage
                        onImageUploaded={handleImageUploaded}
                        currentImage={formData.thumbnail}
                      />
                      {formData.thumbnail && (
                        <div className="mt-4 flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg">
                          <Sparkles className="w-4 h-4" />
                          Image uploaded successfully!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <Label className="text-gray-900 font-semibold text-lg">Step Schedule</Label>
                        <p className="text-gray-500 text-sm">Set when your step will be active</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="startDate" className="text-gray-700 font-medium">Start Date & Time</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="endDate" className="text-gray-700 font-medium">End Date & Time</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-8 border-t border-gray-200">
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.title || !formData.startDate || !formData.endDate}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-14"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Step...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
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
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Preview Card */}
              {formData.title ? (
                <Card className="bg-white border border-gray-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <CardTitle className="text-gray-900 text-lg">Live Preview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Thumbnail Preview */}
                    {formData.thumbnail && (
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={formData.thumbnail}
                          alt="Step thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Failed to load thumbnail:', formData.thumbnail);
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                          }}
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <h3 className="text-gray-900 font-semibold text-xl leading-tight">{formData.title}</h3>

                      {formData.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{formData.description}</p>
                      )}

                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        {formData.startDate && (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Starts: {new Date(formData.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        )}

                        {formData.endDate && (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Ends: {new Date(formData.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-500 font-medium mb-2">Preview</h3>
                    <p className="text-gray-400 text-sm">Fill out the form to see a live preview</p>
                  </CardContent>
                </Card>
              )}

              {/* Tips Card */}
              <Card className="bg-blue-50 border border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-900 text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Tips for Success
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>• Use clear, actionable language</p>
                    <p>• Set realistic timeframes</p>
                    <p>• Add engaging visuals</p>
                    <p>• Encourage community participation</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}