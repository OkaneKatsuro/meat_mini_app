'use client';

import { useEffect, useState } from 'react';

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setWebApp(tg);

      // Инициализация WebApp
      tg.ready();
      tg.expand();

      // Применяем тему Telegram
      if (tg.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      }

      setIsReady(true);
    }
  }, []);

  return {
    webApp,
    isReady,
    user: webApp?.initDataUnsafe?.user,
    colorScheme: webApp?.colorScheme,
    platform: webApp?.platform,
  };
}

export function useTelegramBackButton(onClick?: () => void) {
  const { webApp, isReady } = useTelegramWebApp();

  useEffect(() => {
    if (!webApp || !isReady) return;

    if (onClick) {
      webApp.BackButton.onClick(onClick);
      webApp.BackButton.show();

      return () => {
        webApp.BackButton.offClick(onClick);
        webApp.BackButton.hide();
      };
    }
  }, [webApp, isReady, onClick]);
}

export function useTelegramMainButton(
  text: string,
  onClick?: () => void,
  options?: {
    color?: string;
    textColor?: string;
    isActive?: boolean;
  }
) {
  const { webApp, isReady } = useTelegramWebApp();

  useEffect(() => {
    if (!webApp || !isReady) return;

    webApp.MainButton.setText(text);

    if (options?.color) webApp.MainButton.color = options.color;
    if (options?.textColor) webApp.MainButton.textColor = options.textColor;

    if (options?.isActive !== false) {
      webApp.MainButton.enable();
    } else {
      webApp.MainButton.disable();
    }

    if (onClick) {
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();

      return () => {
        webApp.MainButton.offClick(onClick);
        webApp.MainButton.hide();
      };
    }
  }, [webApp, isReady, text, onClick, options]);
}
