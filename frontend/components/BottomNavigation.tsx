'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Search,
  Plus,
  User,
  Footprints,
  Sparkles
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    { name: 'Steps', href: '/step', icon: Footprints, requiresAuth: true },
    { name: 'Create', href: '/post/create', icon: Plus, requiresAuth: true },
    { name: 'Profile', href: '/profile', icon: User, requiresAuth: true },
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

  if (isLoading) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-center h-16">
          <div className="flex space-x-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-center h-16 px-4">
        <div className="flex items-center justify-around w-full max-w-md">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, item.requiresAuth)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  active
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title={item.name}
              >
                <Icon className={`w-6 h-6 ${active ? 'scale-110' : ''}`} />
                {active && (
                  <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}