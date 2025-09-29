'use client';

import { usePathname } from 'next/navigation';
import ModernHeader from '@/components/ModernHeader';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const showHeader = pathname !== '/' && !pathname.startsWith('/auth/') && !pathname.startsWith('/profile/');

  if (!showHeader) {
    return null;
  }

  return <ModernHeader />;
}