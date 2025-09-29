'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CornerDownRight } from 'lucide-react';

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
    <div className="mb-3">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">u/{comment.author.name || comment.author.email}</span>
          <span className="text-xs text-gray-400">{formatShortDate(comment.createdAt)}</span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>

        <div className="flex items-center space-x-1 text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
            className="h-6 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            <CornerDownRight className="w-3 h-3 mr-1" />
            <span className="text-xs">Reply</span>
          </Button>
        </div>

        {/* Reply Form */}
        {showReplyForm[comment.id] && canParticipate && level < maxLevel && (
          <div className="mt-3 ml-4 border-l-2 border-gray-200 pl-3">
            <div className="flex space-x-2">
              <Textarea
                value={commentContent[comment.id] || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                placeholder="Write a reply..."
                className="flex-1 min-h-[50px] resize-none text-sm"
                disabled={isCreatingComment[comment.id]}
              />
              <div className="flex flex-col space-y-1">
                <Button
                  onClick={() => handleCreateReply(comment.id)}
                  disabled={!commentContent[comment.id]?.trim() || isCreatingComment[comment.id]}
                  size="sm"
                  className="h-7 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs"
                >
                  {isCreatingComment[comment.id] ? '...' : 'Reply'}
                </Button>
                <Button
                  onClick={() => handleCancelComment(comment.id, 'reply')}
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
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
          <div className="mt-3 ml-4 border-l-2 border-gray-200 pl-3 space-y-3">
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