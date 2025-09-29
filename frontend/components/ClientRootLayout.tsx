'use client';

import { usePathname } from 'next/navigation';
import ModernHeader from '@/components/ModernHeader';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader = pathname !== '/';

  return (
    <>
      {showHeader && <ModernHeader />}
      <main className={showHeader ? "pt-16 min-h-screen" : "min-h-screen"}>
        {children}
      </main>
    </>
  );
}