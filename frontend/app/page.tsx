'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  Users,
  ArrowRight,
  Target,
  Globe,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Award,
  Linkedin,
  Twitter,
  Mail,
  ChevronRight,
  Building2,
  Leaf,
  Shield,
  Zap,
  FileText,
  Play,
  Quote
} from 'lucide-react';
import { API_CONFIG, getApiUrl } from '@/lib/api';
import ImageCarousel from "@/components/ui/ImageCarousel";
import { Star, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Add Post/Step interfaces (copy from explore page)
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
  images?: string[];
  upvotes: number;
  createdAt: string;
  author: User;
  step?: Step;
  comments: Comment[];
  isUpvotedByUser?: boolean;
  _count: {
    comments: number;
    userUpvotes: number;
  };
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication on mount
    setIsAuthenticated(!!localStorage.getItem('access_token'));
  }, []);

  // Fetch recent posts (reuse explore endpoint)
  useEffect(() => {
    const fetchRecent = async () => {
      setRecentLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const endpoint = token ? API_CONFIG.ENDPOINTS.EXPLORE : API_CONFIG.ENDPOINTS.ANY_EXPLORE;
        const response = await fetch(getApiUrl(endpoint), { method: 'GET', headers });
        const result = await response.json();
        if (response.ok && Array.isArray(result.data)) {
          setRecentPosts(result.data.slice(0, 6)); // Show only latest 6
        } else {
          setRecentPosts([]);
        }
      } catch {
        setRecentPosts([]);
      } finally {
        setRecentLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const stats = [
    { label: 'Active Participants', value: '10,000+', change: '+23%', icon: Users },
    { label: 'Sustainability Projects', value: '250+', change: '+18%', icon: Target },
    { label: 'Carbon Offset (tons)', value: '5,000+', change: '+45%', icon: Leaf },
    { label: 'Partner Organizations', value: '50+', change: '+12%', icon: Building2 }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time dashboards and comprehensive reporting tools to measure your environmental impact with precision.',
      color: 'emerald'
    },
    {
      icon: Shield,
      title: 'Verified Impact',
      description: 'All initiatives are third-party verified and certified to ensure authentic environmental contributions.',
      color: 'blue'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connect with 50+ partner organizations and thousands of sustainability leaders worldwide.',
      color: 'teal'
    },
    {
      icon: Zap,
      title: 'Scalable Platform',
      description: 'Enterprise-grade infrastructure that scales from individual actions to corporate ESG programs.',
      color: 'amber'
    }
  ];

  const team = [
    {
      name: 'Sarah Mitchell',
      role: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400',
      bio: '15+ years in environmental policy. Former advisor to UN Climate Initiative.',
      credentials: 'MBA Harvard, MSc Environmental Science',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400',
      bio: 'Led engineering teams at Tesla and Google X. 20+ patents in clean tech.',
      credentials: 'PhD Computer Science, MIT',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Dr. Amara Okafor',
      role: 'Head of Sustainability',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400',
      bio: 'UN Climate Advisory Board member. Published researcher in carbon markets.',
      credentials: 'PhD Environmental Science, Oxford',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'James Rodriguez',
      role: 'Chief Operations Officer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400',
      bio: 'Scaled operations for Fortune 500 ESG programs. Ex-McKinsey Partner.',
      credentials: 'MBA Stanford, BA Economics',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const initiatives = [
    {
      title: 'Enterprise Solutions',
      description: 'Comprehensive ESG management platform for corporations committed to net-zero targets',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
      metrics: '150+ Companies',
      tags: ['Carbon Tracking', 'ESG Reporting', 'Supply Chain']
    },
    {
      title: 'Community Programs',
      description: 'Grassroots initiatives empowering local communities to drive environmental change',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800',
      metrics: '80+ Cities',
      tags: ['Local Action', 'Education', 'Engagement']
    },
    {
      title: 'Research & Innovation',
      description: 'Developing cutting-edge sustainability tracking and carbon verification systems',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800',
      metrics: '25+ Projects',
      tags: ['AI/ML', 'Blockchain', 'IoT Sensors']
    }
  ];

  const testimonials = [
    {
      quote: "The platform has transformed how we approach corporate sustainability. The data-driven insights are invaluable.",
      author: "Jennifer Walsh",
      role: "VP of Sustainability",
      company: "TechCorp Global",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"
    },
    {
      quote: "Finally, a solution that bridges the gap between individual action and measurable environmental impact.",
      author: "David Park",
      role: "Sustainability Director",
      company: "Green Industries Inc.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
    }
  ];

  const partners = [
    'TechCorp', 'GreenEnergy', 'EcoSystems', 'Future Labs', 'CleanTech', 'Sustainable Co'
  ];

  // Mocked recent posts/steps (replace with API data as needed)
  const recent = [
    {
      id: '1',
      type: 'post',
      user: {
        name: 'Alice Green',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      content: 'Just completed a zero-waste challenge! 🌱',
      images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600'],
      createdAt: '2h ago'
    },
    {
      id: '2',
      type: 'step',
      step: {
        title: 'Plant 10 Trees',
        verified: true
      },
      user: {
        name: 'Eco Warriors',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      content: 'Join our community step to plant trees in your city!',
      images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=600'],
      createdAt: '4h ago'
    },
    {
      id: '3',
      type: 'post',
      user: {
        name: 'Lucas Smith',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      content: 'Bike to work week was a success 🚴‍♂️',
      images: [],
      createdAt: '6h ago'
    }
  ];

  // Helper for time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-lg'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">Small Step</div>
                <div className="text-xs text-gray-500">for Earth</div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/explore" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Platform</a>
              <a href="#initiatives" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Solutions</a>
              <a href="#team" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Team</a>
              <a href="#impact" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Impact</a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Resources</a>
              {/* Auth/Explore/Profile Buttons */}
              {isAuthenticated ? (
                <>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => router.push('/profile')}
                  >
                    Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-gray-300"
                    onClick={() => router.push('/auth/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => router.push('/auth/login')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-emerald-100/80 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                <Award className="w-4 h-4" />
                <span>Trusted by 50+ Global Organizations</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Sustainable
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    Impact at Scale
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Enterprise-grade platform for measuring, managing, and maximizing environmental impact. 
                  From carbon tracking to ESG reporting, we provide the infrastructure for climate action.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                  Schedule a Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-emerald-500 h-14 px-8 text-base font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Video
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-300"></div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">10,000+ Users</div>
                  <div className="text-gray-600">Making an impact daily</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200"
                  alt="Analytics Dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-2xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">45%</div>
                    <div className="text-sm text-gray-600">Carbon Reduced</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white p-5 rounded-xl shadow-2xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">250+</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Trusted by Leading Organizations</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-50">
            {partners.map((partner, i) => (
              <div key={i} className="text-center text-xl font-bold text-gray-400">{partner}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Impact by Numbers</h2>
            <p className="text-xl text-emerald-100">Real-time metrics showcasing our global environmental impact</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <Icon className="w-12 h-12 text-white/80 mb-4" />
                  <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-emerald-100 mb-3 font-medium">{stat.label}</div>
                  <div className="inline-flex items-center text-white/90 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change} YoY
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for Climate Action
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed for enterprises, communities, and individuals committed to measurable environmental impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                    <Button variant="link" className="px-0 text-emerald-600 font-semibold">
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section id="initiatives" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target className="w-4 h-4" />
              <span>Our Solutions</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tailored Programs for Every Scale
            </h2>
            <p className="text-xl text-gray-600">
              From enterprise ESG management to community grassroots initiatives
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={initiative.image}
                    alt={initiative.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                      {initiative.metrics}
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {initiative.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{initiative.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {initiative.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                    Explore Program <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600">See what our partners say about working with us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-emerald-600 mb-4" />
                  <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-4">
                    <img src={testimonial.image} alt={testimonial.author} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-emerald-600 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Users className="w-4 h-4" />
              <span>Our Leadership</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600">
              Decades of combined expertise in technology, sustainability, and global impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-200 mb-2">{member.role}</p>
                    <p className="text-xs text-gray-300 mb-4">{member.credentials}</p>
                    
                    <div className="flex items-center space-x-2">
                      <a href={member.linkedin} className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href={member.twitter} className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href="#" className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts & Steps Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-blue-50" id="recent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Calendar className="w-4 h-4" />
              <span>Recent Posts & Steps</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">See What’s New</h2>
            <p className="text-lg text-gray-600">Latest actions and steps from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No recent posts found.
              </div>
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 group overflow-hidden">
                  <div className="relative">
                    {post.images && post.images.length > 0 ? (
                      <ImageCarousel images={post.images} />
                    ) : (
                      <div className="w-full h-56 flex items-center justify-center bg-gray-100 text-gray-400 text-4xl">
                        <Leaf className="w-10 h-10" />
                      </div>
                    )}
                    {post.step ? (
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
                        <CheckCircle className="w-4 h-4" /> Step
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
                        <Users className="w-4 h-4" /> Post
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {post.author.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name || post.author.email}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow">
                          {(post.author.name || post.author.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{post.author.name || post.author.email}</div>
                        <div className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</div>
                      </div>
                    </div>
                    {post.step && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-emerald-700 font-semibold">{post.step.title}</span>
                        {post.step.verified && <Star className="w-4 h-4 text-emerald-500" />}
                      </div>
                    )}
                    <div className="text-gray-700 mb-2">{post.content}</div>
                    <Button
                      variant="outline"
                      className="w-full mt-3 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all flex items-center justify-center"
                      onClick={() =>
                        post.step
                          ? window.location.assign(`/step/${post.step.id}`)
                          : window.location.assign(`/explore`)
                      }
                    >
                      {post.step ? (
                        <>
                          View Step <ExternalLink className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          View Post <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9inVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Drive Real Impact?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join leading organizations in building a sustainable future. Schedule a personalized demo to see how our platform can transform your environmental initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 h-14 text-base font-semibold shadow-xl">
              Schedule Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-emerald-500 h-14 px-10 text-base font-semibold text-black">
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}