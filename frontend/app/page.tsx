'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Star,
  Zap,
  Globe,
  Trophy,
  Heart,
  CheckCircle,
  Plus
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  verified: boolean;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  creator: {
    id: string;
    name?: string;
    email: string;
  };
  _count: {
    participants: number;
    posts: number;
  };
}

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/step', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Take first 3 active steps as featured
        setFeaturedEvents((data.data || []).filter((step: Step) => step.isActive).slice(0, 3));
      } else {
        console.error('Failed to fetch steps');
      }
    } catch (error) {
      console.error('Error fetching steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const features = [
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Contribute to worldwide sustainability goals through collective action',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with eco-conscious individuals and organizations worldwide',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Zap,
      title: 'Track Your Impact',
      description: 'Monitor your environmental contributions and earn recognition',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Heart,
      title: 'Sustainable Living',
      description: 'Learn and share tips for reducing your carbon footprint',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const stats = [
    { label: 'Active Challenges', value: '50+', icon: Target },
    { label: 'Earth Champions', value: '1000+', icon: Users },
    { label: 'Impact Points Earned', value: '25K', icon: Trophy },
    { label: 'Communities', value: '10+', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Small Steps for a Sustainable Future</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-green-800 bg-clip-text text-transparent">
                  Small Steps
                </span>
                <br />
                <span className="text-gray-900">for Earth</span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
                Join a global community of environmental champions. Take meaningful actions, participate in sustainability challenges,
                earn rewards, and contribute to a greener planet, one small step at a time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push(isAuthenticated ? '/explore' : '/auth/login')}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {isAuthenticated ? 'Explore Challenges' : 'Join the Movement'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                onClick={() => router.push(isAuthenticated ? '/post/create' : '/auth/login')}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-green-500 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Share Your Impact
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Small Step for Earth?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join a movement that combines technology, community, and environmental action to create lasting positive change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Steps Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Challenges
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover trending sustainability challenges and join the community in making a positive environmental impact.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((step) => (
                <Card
                  key={step.id}
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:-translate-y-2"
                  onClick={() => router.push(`/step/${step.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      {step.thumbnail ? (
                        <img
                          src={step.thumbnail}
                          alt={step.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                          <Target className="w-12 h-12 text-white" />
                        </div>
                      )}
                      {step.verified && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      {step.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{step.description}</p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{step._count.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(step.startDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          by {step.creator.name || step.creator.email}
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Join Step
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Challenges Yet</h3>
              <p className="text-gray-600 mb-6">Be the first to create a sustainability challenge!</p>
              <Button
                onClick={() => router.push('/step/create')}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Create First Challenge
              </Button>
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              onClick={() => router.push('/explore')}
              variant="outline"
              size="lg"
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
            >
              View All Challenges
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-green-100">
                Join thousands of environmental champions taking small steps towards a sustainable future.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push(isAuthenticated ? '/post/create' : '/auth/login')}
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-xl"
              >
                {isAuthenticated ? 'Share Your Story' : 'Join the Movement'}
              </Button>

              <Button
                onClick={() => router.push('/explore')}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
              >
                Explore Challenges
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
