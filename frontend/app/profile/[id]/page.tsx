'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  User,
  Calendar,
  Trophy,
  Users,
  FileText,
  MessageCircle,
  ArrowUp,
  Heart,
  Star,
  ExternalLink,
  Home,
  AlertCircle
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface StepSummary {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  verified: boolean;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  creator?: UserProfile;
  _count: {
    participants: number;
    posts: number;
    userLikes: number;
  };
}

interface PostSummary {
  id: string;
  content: string;
  image?: string;
  upvotes: number;
  createdAt: string;
  step?: {
    id: string;
    title: string;
    thumbnail?: string;
    verified: boolean;
    isActive: boolean;
  };
  _count: {
    comments: number;
    userUpvotes: number;
  };
}

interface UserStats {
  totalStepsHosted: number;
  totalStepsJoined: number;
  totalPosts: number;
  totalComments: number;
  totalUpvotesGiven: number;
  totalStepLikes: number;
  totalUpvotesReceived: number;
}

interface FullUserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  createdSteps: StepSummary[];
  joinedSteps: StepSummary[];
  posts: PostSummary[];
  stats: UserStats;
}

interface ProfileResponse {
  status: string;
  data: FullUserData;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [userData, setUserData] = useState<FullUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const data: ProfileResponse = await response.json();
      setUserData(data.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'steps', label: 'Steps', icon: Calendar },
    { id: 'posts', label: 'Posts', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={userData.avatar || '/default-avatar.png'}
                alt={userData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {userData.isActive && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {userData.role}
                </span>
                <span className="text-sm text-gray-500">
                  Joined {formatDate(userData.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-gray-600">Steps Hosted</span>
                    </div>
                    <span className="font-semibold">{userData.stats.totalStepsHosted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-600">Steps Joined</span>
                    </div>
                    <span className="font-semibold">{userData.stats.totalStepsJoined}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <span className="text-sm text-gray-600">Posts</span>
                    </div>
                    <span className="font-semibold">{userData.stats.totalPosts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-orange-500" />
                      <span className="text-sm text-gray-600">Comments</span>
                    </div>
                    <span className="font-semibold">{userData.stats.totalComments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ArrowUp className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-gray-600">Upvotes Given</span>
                    </div>
                    <span className="font-semibold">{userData.stats.totalUpvotesGiven}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-pink-500" />
                      <span className="text-sm text-gray-600">Upvotes Received</span>
                    </div>
                    <span className="font-semibold">{userData.stats.totalUpvotesReceived}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Recent Steps */}
                {userData.createdSteps.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Steps</h3>
                    <div className="space-y-4">
                      {userData.createdSteps.slice(0, 3).map((step) => (
                        <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                          {step.thumbnail && (
                            <img
                              src={step.thumbnail}
                              alt={step.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{step.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{step._count.participants} participants</span>
                              <span>{step._count.posts} posts</span>
                              <span>{step._count.userLikes} likes</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              step.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {step.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Posts */}
                {userData.posts.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {userData.posts.slice(0, 3).map((post) => (
                        <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <p className="text-gray-900 mb-2">{post.content}</p>
                          {post.image && (
                            <img
                              src={post.image}
                              alt="Post image"
                              className="w-full h-48 object-cover rounded-lg mb-2"
                            />
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span>{post.upvotes} upvotes</span>
                              <span>{post._count.comments} comments</span>
                            </div>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          {post.step && (
                            <div className="mt-2 text-xs text-gray-500">
                              Posted in: {post.step.title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-6">
            {/* Created Steps */}
            {userData.createdSteps.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Steps Created</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.createdSteps.map((step) => (
                    <div key={step.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {step.thumbnail && (
                        <img
                          src={step.thumbnail}
                          alt={step.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{step.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{step._count.participants} participants</span>
                          <span>{step._count.posts} posts</span>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            step.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {step.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Joined Steps */}
            {userData.joinedSteps.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Steps Joined</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.joinedSteps.map((step) => (
                    <div key={step.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {step.thumbnail && (
                        <img
                          src={step.thumbnail}
                          alt={step.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{step.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{step._count.participants} participants</span>
                          <span>{step._count.posts} posts</span>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            step.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {step.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts</h3>
            {userData.posts.length > 0 ? (
              <div className="space-y-6">
                {userData.posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <p className="text-gray-900 mb-4">{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post image"
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <ArrowUp className="h-4 w-4" />
                          <span>{post.upvotes} upvotes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post._count.comments} comments</span>
                        </span>
                      </div>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    {post.step && (
                      <div className="mt-3 text-sm text-gray-600">
                        Posted in step: <span className="font-medium">{post.step.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No posts yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
