'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Mail, Wallet, Calendar, Crown, Trophy, User } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  walletAddress?: string;
  createdAt: string;
}

interface StepParticipantsData {
  step: {
    id: string;
    title: string;
    totalParticipants: number;
    isActive?: boolean;
    verified?: boolean;
    winner?: {
      id: string;
      name?: string;
      email?: string;
    };
    creator?: {
      id: string;
      name?: string;
      email?: string;
    };
    endDate?: string;
  };
  participants: User[];
}

export default function StepParticipantsPage() {
  const params = useParams();
  const [data, setData] = useState<StepParticipantsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSelectingWinner, setIsSelectingWinner] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<User | null>(null);

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

  const currentUserId = isMounted ? getCurrentUserId() : null;

  const fetchStepParticipants = async () => {
    if (!currentUserId) {
      setError('Please login to view step participants');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
  const response = await fetch(`http://localhost:3000/api/step/${params.id}/participants`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch step participants');
      }
    } catch (error) {
      console.error('Error fetching step participants:', error);
      setError('Failed to fetch step participants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (params.id && isMounted) {
      fetchStepParticipants();
    }
  }, [params.id, isMounted]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-96 text-center bg-white border border-gray-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatShortAddress = (address?: string) => {
    if (!address) return null;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleSelectWinner = (participant: User) => {
    setSelectedWinner(participant);
    setShowWinnerModal(true);
  };

  const confirmWinnerSelection = async () => {
    if (!selectedWinner || !data) return;

    setIsSelectingWinner(true);
    try {
      const token = localStorage.getItem('access_token');
      
  const response = await fetch(`http://localhost:3000/api/step/${params.id}/select-winner`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          winnerId: selectedWinner.id
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`${selectedWinner.name || 'Participant'} has been selected as the winner! Prize distributed to their wallet.`);
        setShowWinnerModal(false);
        setSelectedWinner(null);
        // Refresh the data to show updated winner status
        fetchStepParticipants();
      } else {
        alert(`Error: ${result.message || 'Failed to select winner'}`);
      }
    } catch (error) {
      console.error('Error selecting winner:', error);
      alert('Failed to select winner');
    } finally {
      setIsSelectingWinner(false);
    }
  };

  const canSelectWinner = () => {
    console.log('Checking if user can select winner...');
    console.log({ data, currentUserId });
    if (!data || !currentUserId) return false;
    console.log(data.step.creator?.id)
    const isHost = data.step.creator?.id === currentUserId;
    const hasWinner = !!data.step.winner;
    const eventEnded = data.step.endDate ? new Date() > new Date(data.step.endDate) : false;
    const isVerified = data.step.verified;
    const isActive = data.step.isActive;
    console.log(isHost , !hasWinner , isVerified , isActive);
    return isHost && !hasWinner && isVerified && isActive;
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-96 text-center bg-white border border-gray-200 shadow-lg">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-semibold mb-4 text-gray-900">Authentication Required</h1>
            <p className="text-gray-600 mb-4">Please login to view step participants</p>
            <Button 
              onClick={() => window.location.href = '/auth/login'}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-96 text-center bg-white border border-gray-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading participants...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-96 text-center bg-white border border-gray-200 shadow-lg">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-semibold mb-4 text-red-600">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Link href="/explore">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Explore
                </Button>
              </Link>
              <Button 
                onClick={fetchStepParticipants}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href={`/step/${params.id}`}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Step
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Participants</h1>
                <p className="text-sm text-gray-600">{data.step.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-gray-900 font-medium">{data.step.totalParticipants} Participants</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Winner Selection Info */}
        {canSelectWinner() && (
          <Card className="mb-6 bg-yellow-50 border border-yellow-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-800">Select Winner</h3>
              </div>
              <p className="text-gray-700 text-sm">
                The step has ended and is ready for winner selection. Click "Select Winner" on any participant card to choose the winner and distribute the prize.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Winner Announcement */}
        {data.step.winner && (
          <Card className="mb-6 bg-green-50 border border-green-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Winner Announced</h3>
              </div>
              <p className="text-gray-700 text-sm">
                🎉 <strong>{data.step.winner.name || 'Anonymous User'}</strong> has won this step! The prize has been distributed to their wallet.
              </p>
            </CardContent>
          </Card>
        )}
        {(!data.participants || data.participants.length === 0) ? (
          <Card className="w-full text-center bg-white border border-gray-200 shadow-lg">
            <CardContent className="pt-12 pb-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Participants Yet</h2>
              <p className="text-gray-600 mb-6">This step doesn't have any participants yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.participants && data.participants.map((participant) => (
              <Card key={participant.id} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name || 'Participant'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {participant.name || 'Anonymous User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Joined {formatDate(participant.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info (only visible to step host) */}
                  {participant.email && (
                    <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{participant.email}</span>
                    </div>
                  )}

                  {/* Wallet Address (only visible to step host) */}
                  {participant.walletAddress && (
                    <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
                      <Wallet className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 font-mono">
                        {formatShortAddress(participant.walletAddress)}
                      </span>
                    </div>
                  )}

                  {/* Join Date */}
                  <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Member since {formatDate(participant.createdAt)}
                    </span>
                  </div>

                  {/* Winner Selection Button - Only show for hosts */}
                  {canSelectWinner() && (
                    <Button
                      onClick={() => handleSelectWinner(participant)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Select as Winner
                    </Button>
                  )}

                  {/* Winner Badge */}
                  {data.step.winner?.id === participant.id && (
                    <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-semibold">🎉 Winner!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Winner Selection Modal */}
      {showWinnerModal && selectedWinner && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Card className="w-96 max-w-[90vw] bg-white border border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-600" />
                Confirm Winner Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  {selectedWinner.avatar ? (
                    <img
                      src={selectedWinner.avatar}
                      alt={selectedWinner.name || 'Participant'}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedWinner.name || 'Anonymous User'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Are you sure you want to select this participant as the winner?
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ This action cannot be undone. The prize will be immediately transferred to the winner's wallet and the step will be closed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowWinnerModal(false);
                    setSelectedWinner(null);
                  }}
                  disabled={isSelectingWinner}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmWinnerSelection}
                  disabled={isSelectingWinner}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {isSelectingWinner ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                      Selecting...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Confirm Winner
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}