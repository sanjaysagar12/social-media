'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from "@/components/AuthGuard";
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
  image?: string;
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
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawData, setWithdrawData] = useState({
    recipientAddress: '',
    amount: '',
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('No token found. Please login.');
        setIsTokenInvalid(true);
        return;
      }

  const response = await fetch('http://localhost:3000/api/user/me', {
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

  const handleWithdraw = async () => {
    if (!userData?.wallet) {
      alert('No wallet found. Please contact support.');
      return;
    }

    if (parseFloat(userData.wallet.balance) <= 0) {
      alert('Insufficient balance to withdraw.');
      return;
    }

    setIsWithdrawing(true);
    try {
      const token = localStorage.getItem('access_token');
      
  const response = await fetch('http://localhost:3000/etherlink/distribute-funds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderAddress: userData.id, // Use user ID instead of wallet address
          recipientAddress: withdrawData.recipientAddress,
          amountInEther: withdrawData.amount,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (result.data?.status === 'confirmed') {
          alert(`✅ Successfully sent ${withdrawData.amount} ETH to ${withdrawData.recipientAddress}\nTransaction Hash: ${result.data.transactionHash}`);
        } else {
          alert(`🕐 Transaction sent! ${withdrawData.amount} ETH to ${withdrawData.recipientAddress}\nTransaction Hash: ${result.data?.transactionHash}\n\nNote: Transaction is pending confirmation. It may take a few minutes to appear on the blockchain.`);
        }
        setShowWithdrawModal(false);
        setWithdrawData({ recipientAddress: '', amount: '' });
        // Refresh profile data to show updated balance
        fetchProfile();
      } else {
        alert(`❌ Error: ${result.message || 'Failed to send funds'}`);
      }
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      alert('Failed to withdraw funds');
    } finally {
      setIsWithdrawing(false);
    }
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
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                    {userData.name?.[0]?.toUpperCase() || userData.email[0].toUpperCase()}
                  </div>
                )}
                {userData.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{userData.name || userData.email}</h1>
                <p className="text-gray-600">{userData.email}</p>
                <div className="flex items-center space-x-4 mt-2">
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
              <div className="flex items-center gap-3">
                {/* Shareable Link */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
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
                <button
                  onClick={() => router.push('/step/my')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  My Steps
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
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

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Wallet Card */}
                  {userData.wallet && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">In-App Wallet</h3>
                            <p className="text-sm text-gray-600">Manage your ETH balance</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowWithdrawModal(true)}
                          disabled={parseFloat(userData.wallet.balance) <= 0}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Send Funds
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-700">Available Balance</span>
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {parseFloat(userData.wallet.balance).toFixed(4)} ETH
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <span className="text-sm text-gray-700">Locked Balance</span>
                          </div>
                          <div className="text-2xl font-bold text-orange-600">
                            {parseFloat(userData.wallet.lockedBalance).toFixed(4)} ETH
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-sm text-gray-600">Total Balance:</span>
                            <span className="text-lg font-bold text-gray-900 ml-2">
                              {(parseFloat(userData.wallet.balance) + parseFloat(userData.wallet.lockedBalance)).toFixed(4)} ETH
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Wallet created</p>
                            <p className="text-xs text-gray-600">{formatDate(userData.wallet.createdAt)}</p>
                          </div>
                        </div>
                        
                        {/* Wallet Address Display */}
                        {userData.walletAddress && (
                          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">Wallet Address:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900 font-mono">
                                {`${userData.walletAddress.slice(0, 6)}...${userData.walletAddress.slice(-4)}`}
                              </span>
                              <button
                                onClick={() => copyToClipboard(userData.walletAddress!)}
                                className="text-gray-500 hover:text-gray-700"
                                title="Copy address"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                            {post.image && (
                              <img
                                src={post.image}
                                alt="Post image"
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              ) : (
                <p className="text-gray-500 text-center py-8">No posts yet</p>
              )}
            </div>
          )}
        </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && userData?.wallet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-96 max-w-[90vw] bg-white border border-gray-200 shadow-xl rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Send Funds</h2>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Available Balance Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Available Balance</span>
                    <span className="text-lg font-bold text-green-600">
                      {parseFloat(userData.wallet.balance).toFixed(4)} ETH
                    </span>
                  </div>
                </div>

                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={withdrawData.recipientAddress}
                    onChange={(e) => setWithdrawData({ ...withdrawData, recipientAddress: e.target.value })}
                    placeholder="0x..."
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (ETH)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      max={parseFloat(userData.wallet.balance)}
                      value={withdrawData.amount}
                      onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                      placeholder="0.0000"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setWithdrawData({ ...withdrawData, amount: userData.wallet?.balance || '0' })}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ This action cannot be undone. Please double-check the recipient address before proceeding.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setWithdrawData({ recipientAddress: '', amount: '' });
                    }}
                    disabled={isWithdrawing}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={
                      isWithdrawing || 
                      !withdrawData.recipientAddress || 
                      !withdrawData.amount ||
                      parseFloat(withdrawData.amount) <= 0 ||
                      parseFloat(withdrawData.amount) > parseFloat(userData.wallet.balance)
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isWithdrawing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Send {withdrawData.amount || '0'} ETH
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AuthGuard>
  );
}
