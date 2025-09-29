'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
  };
  replies?: Comment[];
}

interface CommentProps {
  comment: Comment;
  level?: number;
  formatShortDate: (dateString: string) => string;
  showReplyForm: { [key: string]: boolean };
  setShowReplyForm: (value: React.SetStateAction<{ [key: string]: boolean }>) => void;
  commentContent: { [key: string]: string };
  setCommentContent: (value: React.SetStateAction<{ [key: string]: string }>) => void;
  handleCreateReply: (commentId: string) => void;
  handleCancelComment: (id: string, type: 'comment' | 'reply') => void;
  isCreatingComment: { [key: string]: boolean };
  canParticipate: boolean;
}

export default function CommentComponent({ 
  comment, 
  level = 0, 
  formatShortDate, 
  showReplyForm, 
  setShowReplyForm,
  commentContent,
  setCommentContent,
  handleCreateReply,
  handleCancelComment,
  isCreatingComment,
  canParticipate
}: CommentProps) {
  const maxLevel = 3;

  return (
    <div className="mb-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">u/{comment.author.name || comment.author.email}</span>
          <span className="text-xs text-gray-500">{formatShortDate(comment.createdAt)}</span>
        </div>

        <p className="text-gray-700 leading-relaxed">{comment.content}</p>

        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
            className="text-gray-600 hover:bg-gray-100"
          >
            Reply
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">Share</Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">Report</Button>
        </div>

        {/* Reply Form */}
        {showReplyForm[comment.id] && canParticipate && level < maxLevel && (
          <div className="mt-4 ml-6 border-l-2 border-gray-200 pl-4">
            <div className="flex space-x-2">
              <textarea
                value={commentContent[comment.id] || ''}
                onChange={(e) => setCommentContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1 p-2 bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => handleCreateReply(comment.id)}
                  disabled={!commentContent[comment.id]?.trim() || isCreatingComment[comment.id]}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isCreatingComment[comment.id] ? 'Posting...' : 'Reply'}
                </Button>
                <Button
                  onClick={() => handleCancelComment(comment.id, 'reply')}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isCreatingComment[comment.id]}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && level < maxLevel && (
          <div className="mt-4 ml-6 border-l-2 border-gray-200 pl-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentComponent
                key={reply.id}
                comment={reply}
                level={level + 1}
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
      </div>
    </div>
  );
}