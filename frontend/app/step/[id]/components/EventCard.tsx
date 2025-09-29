'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  MessageCircle, 
  Trophy, 
  Heart, 
  Star,
  User,
  Plus,
  Clock
} from 'lucide-react';

interface EventDetail {
  id: string;
  title: string;
  description?: string;
  prize?: string;
  thumbnail?: string;
  verified: boolean;
  likes: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  creator: {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
  };
  _count: {
    participants: number;
    posts: number;
    userLikes: number;
  };
}

interface EventCardProps {
  event: EventDetail;
  userLikes: { [key: string]: boolean };
  isLiking: { [key: string]: boolean };
  currentUserId: string | null;
  isUserParticipant: (userId: string) => boolean;
  isEventHost: (userId: string) => boolean;
  handleLikeEvent: () => void;
  handleJoinEvent: () => void;
  isJoining: boolean;
  formatDate: (dateString: string) => string;
  formatShortDate: (dateString: string) => string;
}

// Simple Badge component
const SimpleBadge = ({ className = "", children, ...props }: { className?: string, children: React.ReactNode, [key: string]: any }) => {
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
};

export default function EventCard({ 
  event, 
  userLikes, 
  isLiking, 
  currentUserId, 
  isUserParticipant, 
  isEventHost, 
  handleLikeEvent, 
  handleJoinEvent, 
  isJoining, 
  formatDate, 
  formatShortDate 
}: EventCardProps) {
  return (
    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-0">
      {/* Event Image */}
      {event.thumbnail && (
        <div className="relative h-64 sm:h-80">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/400/250';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <SimpleBadge className="absolute top-4 right-4 bg-blue-500 text-white">
            Step
          </SimpleBadge>
          {event.verified && (
            <SimpleBadge className="absolute top-4 left-4 bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Verified
            </SimpleBadge>
          )}
        </div>
      )}

      <CardContent className="p-6 space-y-6">
        {/* Event Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {event.creator.avatar ? (
              <img
                src={event.creator.avatar}
                alt={event.creator.name || 'Host'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-[#E94042] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {(event.creator.name || event.creator.email)[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">r/Steps</span>
                {event.verified && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <span>Posted by u/{event.creator.name || event.creator.email}</span>
                <span>•</span>
                <span>{formatShortDate(event.createdAt)}</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center gap-3">
            {event.title}
            {event.verified && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-medium rounded-full shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                <span>Verified Step</span>
              </div>
            )}
          </h1>
          {event.description && (
            <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Date</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">{formatDate(event.createdAt)}</div>
          </Card>

          <Card className="p-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Attendees</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {event._count?.participants || 0}
            </div>
          </Card>

          <Card className="p-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Posts</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">{event._count?.posts || 0}</div>
          </Card>

          {event.prize && (
            <Card className="p-4 bg-blue-50 border border-blue-200 text-blue-900">
              <div className="flex items-center space-x-2 text-blue-700 mb-2">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Prize</span>
              </div>
              <div className="text-sm font-semibold">{event.prize}</div>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="space-x-2 text-gray-600 hover:bg-gray-100">
              <MessageCircle className="w-4 h-4" />
              <span>{event._count?.posts || 0}</span>
            </Button>

            <Button 
              variant="ghost"
              size="sm"
              onClick={handleLikeEvent}
              disabled={isLiking[event.id]}
              className={`space-x-2 ${
                userLikes[event.id] 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${userLikes[event.id] ? 'fill-current' : ''}`} />
              <span>{event._count?.userLikes || 0}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            {currentUserId && (
              <>
                {isEventHost(currentUserId) ? (
                  <Button disabled className="bg-gray-400 text-white" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Step Host
                  </Button>
                ) : isUserParticipant(currentUserId) ? (
                  <Button disabled className="bg-green-500 text-white" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Joined
                  </Button>
                ) : !event.isActive ? (
                  <Button disabled className="bg-gray-400 text-white" size="sm">
                    Step Inactive
                  </Button>
                ) : new Date() > new Date(event.endDate) ? (
                  <Button disabled className="bg-gray-400 text-white" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Step Ended
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJoinEvent}
                    disabled={isJoining}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isJoining ? 'Joining...' : 'Join Step'}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}