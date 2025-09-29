'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Users,
  Plus,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  MessageCircle,
  Sparkles,
  Heart,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export default function ModernHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Decode token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAuthenticated(true);

        // Fetch user profile
        const response = await fetch('http://localhost:3000/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Token might be invalid, clear it
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home, requiresAuth: false },
    { name: 'Explore', href: '/explore', icon: Search, requiresAuth: true },
    { name: 'Create Post', href: '/post/create', icon: Plus, requiresAuth: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    router.push(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Small Step for Earth
              </span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg'
        : 'bg-white/80 backdrop-blur-sm'
    }`} suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Small Step for Earth
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.requiresAuth)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">

            {/* Notifications - Only show when authenticated */}
            {isAuthenticated && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            )}

            {/* User Menu or Auth Buttons */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/profile')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <User className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/auth/login')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/auth/login')}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavigation(item.href, item.requiresAuth);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 w-full text-left ${
                      active
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              {/* Mobile Auth Section */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        router.push('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-gray-900"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        router.push('/auth/login');
                        setIsMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-gray-900"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        router.push('/auth/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}