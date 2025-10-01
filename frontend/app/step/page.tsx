'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_CONFIG, getApiUrl } from '@/lib/api';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Clock, 
  User
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  creator: {
    id: string;
    name?: string;
    email: string;
  };
  _count: {
    participants: number;
    posts: number;
  };
}

export default function StepsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Please login first');
        return;
      }

  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STEPS), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setEvents(result.data);
      } else {
        setError(result.message || 'Failed to fetch steps');
      }
    } catch (error) {
      console.error('Error fetching steps:', error);
      setError('Failed to fetch steps');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepClick = (stepId: string) => {
    router.push(`/step/${stepId}`);
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading steps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Steps</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={fetchSteps}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">All Steps</h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover and participate in exciting steps from the community
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex justify-center">
            <div className="text-sm text-gray-500 bg-white border border-gray-200 px-6 py-3 rounded-xl font-medium shadow-sm">
              <span className="text-blue-600 font-semibold">{events.length}</span> steps found
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-12 max-w-md mx-auto">
              <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <p className="text-gray-900 text-xl font-semibold mb-2">No steps found</p>
              <p className="text-gray-500 mb-6">Check back later for new steps!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((step) => (
              <Card
                key={step.id}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
                onClick={() => handleStepClick(step.id)}
              >
                {/* Step Image */}
                {step.thumbnail ? (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={step.thumbnail}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        step.isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {step.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-gray-400" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        step.isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {step.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </CardTitle>
                  {step.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Step Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Start:</span>
                      <span>{formatDate(step.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">End:</span>
                      <span>{formatDate(step.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Creator:</span>
                      <span>{step.creator.name || step.creator.email}</span>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{step._count?.participants || 0}</div>
                          <div className="text-xs text-gray-500">Participants</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{step._count?.posts || 0}</div>
                          <div className="text-xs text-gray-500">Posts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}