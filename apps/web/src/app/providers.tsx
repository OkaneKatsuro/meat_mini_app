'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { TelegramProvider } from '@/components/TelegramProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Apply Telegram theme colors
      const theme = tg.themeParams;
      if (theme.bg_color) {
        document.documentElement.style.setProperty('--background', theme.bg_color);
      }
      if (theme.text_color) {
        document.documentElement.style.setProperty('--foreground', theme.text_color);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>{children}</TelegramProvider>
    </QueryClientProvider>
  );
}
