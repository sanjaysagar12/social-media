'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from "@/components/AuthGuard";
import ImageCarousel from "@/components/ui/ImageCarousel";
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
  Settings,
  LogOut,
  Home,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Copy
} from 'lucide-react';
import { API_CONFIG, getApiUrl } from '@/lib/api';

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
  prize?: string;
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
  images?: string[]; // Changed from image? to images?
  upvotes: number;
  createdAt: string;
  step: {
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

interface CommentSummary {
  id: string;
  content: string;
  createdAt: string;
  post: {
    id: string;
    content: string;
    step: {
      id: string;
      title: string;
      isActive: boolean;
    };
    author: {
      id: string;
      name: string;
      email: string;
    };
  };
  parent?: {
    id: string;
    author: {
      id: string;
      name: string;
      email: string;
    };
  };
}

interface UpvoteSummary {
  id: string;
  createdAt: string;
  post: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      email: string;
    };
    step: {
      id: string;
      title: string;
      isActive: boolean;
    };
  };
}

interface StepLikeSummary {
  id: string;
  createdAt: string;
  step: {
    id: string;
    title: string;
    thumbnail?: string;
    verified: boolean;
    isActive: boolean;
    creator: {
      id: string;
      name: string;
      email: string;
    };
  };
}

interface UserStats {
  totalStepsHosted: number;
  totalStepsJoined: number;
  totalEventsWon: number;
  totalPosts: number;
  totalComments: number;
  totalUpvotesGiven: number;
  totalEventLikes: number;
  totalUpvotesReceived: number;
}

interface WalletInfo {
  id: string;
  balance: string;
  lockedBalance: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

interface FullUserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  walletAddress?: string;
  createdSteps: StepSummary[];
  joinedSteps: StepSummary[];
  wonEvents: StepSummary[];
  posts: PostSummary[];
  comments: CommentSummary[];
  upvotes: UpvoteSummary[];
  eventLikes: StepLikeSummary[];
  stats: UserStats;
  wallet?: WalletInfo;
}

interface ProfileResponse {
  status: string;
  data: FullUserData;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<FullUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('No token found. Please login.');
        setIsTokenInvalid(true);
        return;
      }

  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        setError('Your session has expired. Please login again.');
        setIsTokenInvalid(true);
        return;
      }

      if (!response.ok) {
        setError(`Failed to fetch profile. Status: ${response.status}`);
        return;
      }

      const data: ProfileResponse = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    localStorage.removeItem('access_token');
    router.push('/auth/login');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/auth/login');
  };

  const handleStepClick = (stepId: string) => {
    router.push(`/step/${stepId}`);
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getShareableLink = () => {
    if (!userData?.email) return '';
    // Extract username from email (everything before @)
    const username = userData.email.split('@')[0];
    console.log('User email:', userData.email);
    console.log('Extracted username:', username);
    console.log('Shareable link:', `${window.location.origin}/profile/${username}`);
    return `${window.location.origin}/profile/${username}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 shadow-lg rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 shadow-lg rounded-lg p-8 max-w-md">
          <div className="mb-6">
            <User className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-semibold mb-2">Authentication Error</p>
            <p className="text-gray-600">{error}</p>
          </div>
          {isTokenInvalid ? (
            <button 
              onClick={handleLogin} 
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Go to Login
            </button>
          ) : (
            <button 
              onClick={fetchProfile} 
              className="w-full px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center">
        <p className="text-gray-300">No user data found.</p>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile-friendly Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Profile Image */}
              <div className="relative">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                    {userData.name?.[0]?.toUpperCase() || userData.email[0].toUpperCase()}
                  </div>
                )}
                {userData.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{userData.name || userData.email}</h1>
                <p className="text-gray-600">{userData.email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    userData.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {userData.role}
                  </span>
                  <span className="text-sm text-gray-500">
                    Joined {formatDate(userData.createdAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Shareable Link - Hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-600">Share:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 font-mono">
                      {getShareableLink().replace(window.location.origin + '/', '')}
                    </span>
                    <button
                      onClick={() => copyToClipboard(getShareableLink())}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy shareable link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span className="sm:hidden">Home</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="sm:hidden">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-friendly Navigation Tabs */}
        <div className="bg-white border-b overflow-x-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'steps', label: 'Steps', icon: Calendar },
                { id: 'posts', label: 'Posts', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

        {/* Mobile-friendly Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Stats - Full width on mobile */}
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
                        <Heart className="h-5 w-5 text-red-500" />
                        <span className="text-sm text-gray-600">Upvotes Given</span>
                      </div>
                      <span className="font-semibold">{userData.stats.totalUpvotesGiven}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ArrowUp className="h-5 w-5 text-pink-500" />
                        <span className="text-sm text-gray-600">Upvotes Received</span>
                      </div>
                      <span className="font-semibold">{userData.stats.totalUpvotesReceived}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity - Full width on mobile */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  

                  {/* Recent Steps */}
                  {userData.createdSteps.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Steps Created</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userData.createdSteps.slice(0, 4).map((step) => (
                          <div key={step.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-3">
                              {step.thumbnail && (
                                <img
                                  src={step.thumbnail}
                                  alt={step.title}
                                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900 truncate">{step.title}</h4>
                                  {step.verified && <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />}
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                  {formatDate(step.createdAt)} • {step._count.participants} participants
                                </p>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <span>{step._count.posts} posts</span>
                                  <span>{step._count.userLikes} likes</span>
                                </div>
                              </div>
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
                          <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <p className="text-gray-900 text-sm mb-3 line-clamp-2">{post.content}</p>
                            {post.images && post.images.length > 0 && (
                              <div className="mb-3">
                                <ImageCarousel images={post.images} />
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center space-x-1">
                                  <Heart className="w-3 h-3" />
                                  <span>{post._count.userUpvotes}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>{post._count.comments}</span>
                                </span>
                              </div>
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            {post.step && (
                              <div className="mt-2 text-xs text-gray-600">
                                Posted in: <span className="font-medium">{post.step.title}</span>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {userData.createdSteps.map((step) => (
                      <div key={step.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStepClick(step.id)}>
                        {step.thumbnail && (
                          <img
                            src={step.thumbnail}
                            alt={step.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                            {step.verified && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{step.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <span>{step._count.participants} participants</span>
                            <span>{step._count.posts} posts</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              step.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {step.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(step.createdAt)}</span>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {userData.joinedSteps.map((step) => (
                      <div key={step.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStepClick(step.id)}>
                        {step.thumbnail && (
                          <img
                            src={step.thumbnail}
                            alt={step.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                            {step.verified && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{step.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <span>{step._count.participants} participants</span>
                            <span>{step._count.posts} posts</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              step.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {step.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(step.createdAt)}</span>
                          </div>
                          {step.creator && (
                            <div className="mt-2 text-xs text-gray-500">
                              Created by {step.creator.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Update grid layouts for better mobile display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {userData.posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <p className="text-gray-900 mb-4">{post.content}</p>
                    {post.images && post.images.length > 0 && (
                      <div className="mb-4">
                        <ImageCarousel images={post.images} />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post._count.userUpvotes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post._count.comments}</span>
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
            </div>
          )}
        </div>
    </div>
    </AuthGuard>
  );
}
