'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/AuthGuard";
import {
    ArrowUp,
    MessageCircle,
    Calendar,
    User,
    Star,
    ExternalLink,
    Clock,
    Home,
    Search,
    Compass
} from 'lucide-react';

interface User {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
}

interface Step {
    id: string;
    title: string;
    thumbnail?: string;
    verified: boolean;
    isActive: boolean;
    creator: User;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: User;
    replies?: Comment[];
}

interface Post {
    id: string;
    content: string;
    image?: string;
    upvotes: number;
    createdAt: string;
    author: User;
    step?: Step; // Make step optional since standalone posts don't have one
    comments: Comment[];
    isUpvotedByUser?: boolean;
    _count: {
        comments: number;
        userUpvotes: number;
    };
}

export default function ExplorePage() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // User interaction state
    const [userUpvotes, setUserUpvotes] = useState<{ [key: string]: boolean }>({});
    const [isUpvoting, setIsUpvoting] = useState<{ [key: string]: boolean }>({});

    // Get current user ID from token
    const getCurrentUserId = () => {
        if (typeof window === 'undefined') return null;

        const token = localStorage.getItem('access_token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub;
        } catch {
            return null;
        }
    };

    const currentUserId = getCurrentUserId();

    const fetchExplorePosts = async () => {
        try {
            const token = localStorage.getItem('access_token');

            const headers: { [key: string]: string } = {
                'Content-Type': 'application/json',
            };

            // Only add Authorization header if token exists
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('http://localhost:3000/api/step/explore', {
                method: 'GET',
                headers,
            });
            const result = await response.json();

            if (response.ok) {
                setPosts(result.data);
                console.log(result.data);
                // Initialize upvote state for all posts (only if user is logged in)
                if (token && result.data) {
                    const upvoteState: { [key: string]: boolean } = {};
                    result.data.forEach((post: Post) => {
                        if (post.isUpvotedByUser !== undefined) {
                            upvoteState[post.id] = post.isUpvotedByUser;
                        }
                    });
                    setUserUpvotes(upvoteState);
                }
            } else {
                setError(result.message || 'Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching explore posts:', error);
            setError('Failed to fetch posts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExplorePosts();
    }, []);

    const handleUpvotePost = async (postId: string) => {
        if (!currentUserId) {
            alert('Please login to upvote posts');
            return;
        }

        const isCurrentlyUpvoted = userUpvotes[postId];

        setIsUpvoting(prev => ({ ...prev, [postId]: true }));
        try {
            const token = localStorage.getItem('access_token');

            if (!token) {
                alert('Please login first');
                return;
            }

            const endpoint = isCurrentlyUpvoted ? 'remove-upvote' : 'upvote';
            const response = await fetch(`http://localhost:3000/api/step/post/${postId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                // Update local state
                setUserUpvotes(prev => ({ ...prev, [postId]: !isCurrentlyUpvoted }));
                // Update post count in the posts array
                setPosts(prev => prev.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            _count: {
                                ...post._count,
                                userUpvotes: isCurrentlyUpvoted
                                    ? (post._count?.userUpvotes || 0) - 1
                                    : (post._count?.userUpvotes || 0) + 1
                            }
                        }
                        : post
                ));
            } else {
                alert(`Error: ${result.message || 'Failed to update upvote'}`);
            }
        } catch (error) {
            console.error('Error updating post upvote:', error);
            alert('Failed to update upvote');
        } finally {
            setIsUpvoting(prev => ({ ...prev, [postId]: false }));
        }
    };

    const handlePostClick = (stepId: string) => {
    router.push(`/step/${stepId}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <MessageCircle className="h-12 w-12 mx-auto" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Posts</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button
                        onClick={fetchExplorePosts}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="px-6 py-4">
                    {/* Top Row - Navigation & Actions */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => router.push('/')}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <Home className="w-4 h-4" />
                                <span>Home</span>
                            </Button>
                            
                            <Button
                                onClick={() => router.push('/step')}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Steps</span>
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-500">
                                {posts.length} posts found
                            </div>
                            <Button
                                onClick={fetchExplorePosts}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Refresh</span>
                            </Button>
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Compass className="w-8 h-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
                        </div>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                            Discover amazing content and connect with the community
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 max-w-md mx-auto">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search posts, steps, or users..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Posts Feed */}
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-900 text-lg font-semibold mb-2">No posts found</p>
                            <p className="text-gray-500 text-sm">Check back later for new content from the community!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                {/* Post Header */}
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* Step Info or Standalone Post Indicator */}
                                            {post.step ? (
                                                <>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                            S
                                                        </div>
                                                        <span className="font-semibold text-gray-900">{post.step.title}</span>
                                                        {post.step.verified && (
                                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold">
                                                        P
                                                    </div>
                                                    <span className="font-semibold text-gray-900">Standalone Post</span>
                                                </div>
                                            )}

                                            <span className="text-gray-400">•</span>

                                            {/* Author Info */}
                                            <div className="flex items-center gap-2">
                                                {post.author.avatar ? (
                                                    <img
                                                        src={post.author.avatar}
                                                        alt={post.author.name || 'User'}
                                                        className="w-7 h-7 rounded-full border-2 border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium">
                                                        {(post.author.name || post.author.email || 'U')[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {post.author.name || post.author.email}
                                                </span>
                                            </div>

                                            <span className="text-gray-400">•</span>
                                            <span className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                                        </div>

                                        {/* Step Status or Standalone Indicator */}
                                        <div className="flex items-center gap-2">
                                            {post.step ? (
                                                post.step.isActive ? (
                                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium border border-green-500/30">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full font-medium border border-gray-500/30">
                                                        Inactive
                                                    </span>
                                                )
                                            ) : (
                                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium border border-blue-500/30">
                                                    Standalone
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div
                                    className={`p-6 ${post.step ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                    onClick={post.step ? () => handlePostClick(post.step!.id) : undefined}
                                >
                                    <p className="text-gray-900 mb-4 leading-relaxed text-lg">{post.content}</p>

                                    {post.image && (
                                        <div className="mb-4">
                                            <img
                                                src={post.image}
                                                alt="Post image"
                                                className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Post Actions */}
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                    <div className="flex items-center gap-6">
                                        {/* Upvote Button */}
                                        {currentUserId ? (
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpvotePost(post.id);
                                                }}
                                                disabled={isUpvoting[post.id]}
                                                variant="ghost"
                                                size="sm"
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${userUpvotes[post.id]
                                                        ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 border border-orange-200'
                                                        : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                    }`}
                                            >
                                                {isUpvoting[post.id] ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                                        <span className="text-sm font-medium">{post._count?.userUpvotes || 0}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ArrowUp className={`w-5 h-5 ${userUpvotes[post.id] ? 'fill-current' : ''}`} />
                                                        <span className="text-sm font-semibold">{post._count?.userUpvotes || 0}</span>
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-2 px-4 py-2 text-gray-500 bg-gray-100 rounded-full border border-gray-200">
                                                <ArrowUp className="w-5 h-5" />
                                                <span className="text-sm font-semibold">{post._count?.userUpvotes || 0}</span>
                                            </div>
                                        )}

                                        {/* Comments */}
                                        {post.step ? (
                                            <Button
                                                onClick={() => handlePostClick(post.step!.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all duration-300"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                <span className="text-sm font-semibold">{post._count?.comments || 0}</span>
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-2 px-4 py-2 text-gray-500 bg-gray-100 rounded-full border border-gray-200">
                                                <MessageCircle className="w-5 h-5" />
                                                <span className="text-sm font-semibold">{post._count?.comments || 0}</span>
                                            </div>
                                        )}

                                        {/* View Step or Standalone Indicator */}
                                        {post.step ? (
                                            <Button
                                                onClick={() => handlePostClick(post.step!.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 border border-gray-200 hover:border-blue-200 transition-all duration-300 ml-auto"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                <span className="text-sm font-medium">View Step</span>
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-2 px-4 py-2 text-gray-500 bg-gray-100 rounded-full border border-gray-200 ml-auto">
                                                <MessageCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">Standalone</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Comments Preview */}
                                {post.comments && post.comments.length > 0 && (
                                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                                        <div className="space-y-4">
                                            {post.comments && post.comments.slice(0, 2).map((comment) => (
                                                <div key={comment.id} className="flex items-start gap-3">
                                                    {comment.author.avatar ? (
                                                        <img
                                                            src={comment.author.avatar}
                                                            alt={comment.author.name || 'User'}
                                                            className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                                            {(comment.author.name || comment.author.email || 'U')[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {comment.author.name || comment.author.email}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {formatTimeAgo(comment.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {post.comments && post.comments.length > 2 && post.step && (
                                                <Button
                                                    onClick={() => handlePostClick(post.step!.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto font-medium"
                                                >
                                                    View all {post._count?.comments || 0} comments →
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        </AuthGuard>
    );
}