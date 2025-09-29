'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus,
  Users,
  User,
  Star,
  Trophy
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
  winner?: {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
  };
  participants: {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
  }[];
  _count: {
    participants: number;
    posts: number;
    userLikes: number;
  };
}

interface EventSidebarProps {
  event: EventDetail;
  currentUserId: string | null;
  isEventHost: (userId: string) => boolean;
  isUserParticipant: (userId: string) => boolean;
  handleJoinEvent: () => void;
  isJoining: boolean;
  formatShortDate: (dateString: string) => string;
  onVerifyEvent?: () => void;
}

// Simple Badge component
const Badge = ({ className = "", children, ...props }: { className?: string, children: React.ReactNode, [key: string]: any }) => {
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
};

export default function EventSidebar({
  event,
  currentUserId,
  isEventHost,
  isUserParticipant,
  handleJoinEvent,
  isJoining,
  formatShortDate,
  onVerifyEvent
}: EventSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentUserId && (
            <>
              {isEventHost(currentUserId) ? (
                <Button disabled className="w-full bg-gray-400 text-white" size="lg">
                  <User className="w-4 h-4 mr-2" />
                  Step Host
                </Button>
              ) : isUserParticipant(currentUserId) ? (
                <Button disabled className="w-full bg-green-500 text-white" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  Already Joined
                </Button>
              ) : !event.isActive ? (
                <Button disabled className="w-full bg-gray-400 text-white" size="lg">
                  Step Inactive
                </Button>
              ) : (
                <Button 
                  onClick={handleJoinEvent} 
                  disabled={isJoining}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isJoining ? 'Joining...' : 'Join Step'}
                </Button>
              )}
            </>
          )}
          
          <div className="text-xs text-gray-500 text-center">
            Join to participate in discussions and win prizes
          </div>
        </CardContent>
      </Card>

      {/* Event Information */}
      <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            Step Information
            {event.verified && (
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                <Star className="w-4 h-4 mr-1 fill-current" />
                Verified
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.verified && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Verification</span>
                <div className="flex items-center gap-2 text-yellow-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium text-sm">Verified Step</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <span className="flex items-center gap-2 mb-1">
                    <Star className="w-3 h-3 fill-current text-yellow-600" />
                    <span className="font-medium text-yellow-600">Verified Step</span>
                  </span>
                  This step has been verified by the platform administrators for authenticity and quality.
                </p>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Created</span>
            <span className="font-medium text-sm text-gray-900">{formatShortDate(event.createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Participants</span>
            <span className="font-medium text-sm text-gray-900">{event._count?.participants || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Posts</span>
            <span className="font-medium text-sm text-gray-900">{event._count?.posts || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Likes</span>
            <span className="font-medium text-sm text-gray-900">{event._count?.userLikes || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Status</span>
            <Badge className={event.isActive ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-800 border border-gray-200"}>
              {event.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {event.prize && (
            <>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Prize</span>
                  <span className="font-semibold text-gray-900">{event.prize}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Event Host */}
      <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900">Step Host</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            {event.creator.avatar ? (
              <img
                src={event.creator.avatar}
                alt={event.creator.name || 'Host'}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {(event.creator.name || event.creator.email)[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">u/{event.creator.name || event.creator.email}</span>
                {event.verified && (
                  <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Verified Host
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Step Creator
              </div>
            </div>
          </div>
          
          {/* Remove duplicate verification display since it's now in Event Information */}
        </CardContent>
      </Card>

      {/* Recent Participants */}
      {event.participants && event.participants.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/7 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Recent Participants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {event.participants && event.participants.slice(0, 5).map((participant) => (
              <div key={participant.id} className="flex items-center space-x-3">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name || 'Participant'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {(participant.name || participant.email)[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">u/{participant.name || participant.email}</span>
                </div>
              </div>
            ))}
            {event.participants && event.participants.length > 5 && (
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                +{event.participants.length - 5} more participants
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Winner Card */}
      {event.winner && (
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Winner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {event.winner.avatar ? (
                <img
                  src={event.winner.avatar}
                  alt={event.winner.name || 'Winner'}
                  className="w-12 h-12 rounded-full border-2 border-yellow-400"
                />
              ) : (
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {(event.winner.name || event.winner.email)[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <div className="text-gray-900 font-medium">u/{event.winner.name || event.winner.email}</div>
                <div className="text-yellow-600 text-sm">🎉 Step Winner!</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}