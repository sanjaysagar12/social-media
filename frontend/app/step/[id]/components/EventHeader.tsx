'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Share2, MoreHorizontal } from 'lucide-react';

interface EventHeaderProps {
  isBookmarked: boolean;
  setIsBookmarked: (bookmarked: boolean) => void;
}

export default function EventHeader({ isBookmarked, setIsBookmarked }: EventHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/explore'}
            className="inline-flex items-center space-x-2 text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={isBookmarked ? "bg-blue-500 hover:bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}