'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommentComponent from "@/components/ui/CommentComponent";
import { 
  ArrowUp, 
  MessageCircle 
} from 'lucide-react';

interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
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
  comments: Comment[];
  isUpvotedByUser?: boolean;
  _count: {
    comments: number;
    userUpvotes: number;
  };
}

interface PostItemProps {
  post: Post;
  userUpvotes: { [key: string]: boolean };
  isUpvoting: { [key: string]: boolean };
  handleUpvotePost: (postId: string) => void;
  currentUserId: string | null;
  formatShortDate: (dateString: string) => string;
  showCommentForm: { [key: string]: boolean };
  setShowCommentForm: (value: React.SetStateAction<{ [key: string]: boolean }>) => void;
  commentContent: { [key: string]: string };
  setCommentContent: (value: React.SetStateAction<{ [key: string]: string }>) => void;
  handleCreateComment: (postId: string) => void;
  handleCancelComment: (id: string, type: 'comment' | 'reply') => void;
  isCreatingComment: { [key: string]: boolean };
  showReplyForm: { [key: string]: boolean };
  setShowReplyForm: (value: React.SetStateAction<{ [key: string]: boolean }>) => void;
  handleCreateReply: (commentId: string) => void;
  canParticipate: boolean;
}

export default function PostItem({ 
  post,
  userUpvotes,
  isUpvoting,
  handleUpvotePost,
  currentUserId,
  formatShortDate,
  showCommentForm,
  setShowCommentForm,
  commentContent,
  setCommentContent,
  handleCreateComment,
  handleCancelComment,
  isCreatingComment,
  showReplyForm,
  setShowReplyForm,
  handleCreateReply,
  canParticipate
}: PostItemProps) {
  return (
    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <div className="flex flex-col items-center space-y-1">
            <Button
              variant={userUpvotes[post.id] ? "default" : "ghost"}
              size="sm"
              onClick={() => handleUpvotePost(post.id)}
              disabled={!currentUserId || isUpvoting[post.id]}
              className={userUpvotes[post.id] ? "bg-orange-500 hover:bg-orange-600 text-white" : "text-gray-600 hover:bg-gray-100"}
            >
              {isUpvoting[post.id] ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <ArrowUp className={`w-4 h-4 ${userUpvotes[post.id] ? 'fill-current' : ''}`} />
              )}
            </Button>
            <span className="text-xs font-medium text-gray-600">{post._count?.userUpvotes || 0}</span>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">u/{post.author.name || post.author.email}</span>
              <span className="text-xs text-gray-500">{formatShortDate(post.createdAt)}</span>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
            
            {/* Post Image */}
            {post.image && (
              <div className="mt-3">
                <img 
                  src={post.image} 
                  alt="Post attachment" 
                  className="max-w-md h-auto rounded-lg border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCommentForm(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                className="text-gray-600 hover:bg-gray-100"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {post._count?.comments || 0} Comments
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">Share</Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">Save</Button>
            </div>

            {/* Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                {post.comments && post.comments.map((comment) => (
                  <CommentComponent
                    key={comment.id}
                    comment={comment}
                    formatShortDate={formatShortDate}
                    showReplyForm={showReplyForm}
                    setShowReplyForm={setShowReplyForm}
                    commentContent={commentContent}
                    setCommentContent={setCommentContent}
                    handleCreateReply={handleCreateReply}
                    handleCancelComment={handleCancelComment}
                    isCreatingComment={isCreatingComment}
                    canParticipate={canParticipate}
                  />
                ))}
              </div>
            )}

            {/* Comment Form */}
            {showCommentForm[post.id] && currentUserId && (
              <div className="mt-4 ml-6 border-l-2 border-gray-200 pl-4">
                <div className="flex space-x-2">
                  <textarea
                    value={commentContent[post.id] || ''}
                    onChange={(e) => setCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Write a comment..."
                    rows={2}
                    className="flex-1 p-2 bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => handleCreateComment(post.id)}
                      disabled={!commentContent[post.id]?.trim() || isCreatingComment[post.id]}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isCreatingComment[post.id] ? 'Posting...' : 'Comment'}
                    </Button>
                    <Button
                      onClick={() => handleCancelComment(post.id, 'comment')}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={isCreatingComment[post.id]}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}