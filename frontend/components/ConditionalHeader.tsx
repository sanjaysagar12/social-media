'use client';

import { usePathname } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const showNavigation = pathname !== '/' && !pathname.startsWith('/auth/');

  if (!showNavigation) {
    return null;
  }

  return <BottomNavigation />;
}