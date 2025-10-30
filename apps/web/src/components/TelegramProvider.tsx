'use client';

import { useEffect } from 'react';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { webApp, isReady } = useTelegramWebApp();

  useEffect(() => {
    if (!webApp || !isReady) return;

    // Применяем цвета темы Telegram к body
    if (webApp.themeParams.bg_color) {
      document.body.style.backgroundColor = webApp.themeParams.bg_color;
    }

    // Убираем подтверждение при закрытии
    webApp.disableClosingConfirmation();
  }, [webApp, isReady]);

  return <>{children}</>;
}
