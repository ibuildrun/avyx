import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  init,
  miniApp,
  themeParams,
  viewport,
  backButton,
  mainButton,
  cloudStorage,
  initData,
  retrieveLaunchParams,
  type User as TelegramUser,
} from '@tma.js/sdk-react';

interface TelegramContextType {
  isReady: boolean;
  isTelegram: boolean;
  user: TelegramUser | null;
  initDataRaw: string | null;
  themeParams: {
    bgColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    secondaryBgColor: string;
  };
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  cloudGet: (key: string) => Promise<string | null>;
  cloudSet: (key: string, value: string) => Promise<void>;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initDataRaw, setInitDataRaw] = useState<string | null>(null);
  const [theme, setTheme] = useState({
    bgColor: '#FDFCFB',
    textColor: '#2D3436',
    buttonColor: '#FF7F50',
    buttonTextColor: '#FFFFFF',
    secondaryBgColor: '#F5F5F5',
  });

  useEffect(() => {
    const initTelegram = async () => {
      try {
        // Check if running in Telegram
        const isTg = typeof window !== 'undefined' && 
          (window as any).Telegram?.WebApp !== undefined;
        
        setIsTelegram(isTg);

        if (isTg) {
          // Initialize TMA SDK
          init();
          
          // Get launch params including initDataRaw
          try {
            const launchParams = retrieveLaunchParams();
            if (launchParams.initDataRaw && typeof launchParams.initDataRaw === 'string') {
              setInitDataRaw(launchParams.initDataRaw);
            }
          } catch (e) {
            console.warn('Could not retrieve launch params:', e);
          }
          
          // Mount components
          if (miniApp.mount.isAvailable()) {
            miniApp.mount();
            miniApp.ready();
            
            // Set custom header and background colors
            const webApp = (window as any).Telegram?.WebApp;
            if (webApp) {
              // Set header color (top bar)
              if (webApp.setHeaderColor) {
                webApp.setHeaderColor('#FDFCFB');
              }
              // Set background color
              if (webApp.setBackgroundColor) {
                webApp.setBackgroundColor('#FDFCFB');
              }
            }
          }
          
          if (viewport.mount.isAvailable()) {
            viewport.mount();
            viewport.expand();
          }

          if (themeParams.mount.isAvailable()) {
            themeParams.mount();
            setTheme({
              bgColor: themeParams.bgColor() || '#FDFCFB',
              textColor: themeParams.textColor() || '#2D3436',
              buttonColor: themeParams.buttonColor() || '#FF7F50',
              buttonTextColor: themeParams.buttonTextColor() || '#FFFFFF',
              secondaryBgColor: themeParams.secondaryBgColor() || '#F5F5F5',
            });
          }

          if (backButton.mount.isAvailable()) {
            backButton.mount();
          }

          if (mainButton.mount.isAvailable()) {
            mainButton.mount();
          }

          // Get user data
          if (initData.user) {
            setUser(initData.user() as TelegramUser);
          }
        }

        setIsReady(true);
      } catch (error) {
        console.warn('Telegram SDK init failed, running in browser mode:', error);
        setIsReady(true);
      }
    };

    initTelegram();
  }, []);

  const showMainButton = (text: string, onClick: () => void) => {
    if (isTelegram && mainButton.setParams.isAvailable()) {
      mainButton.setParams({ text, isVisible: true });
      mainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (isTelegram && mainButton.setParams.isAvailable()) {
      mainButton.setParams({ isVisible: false });
    }
  };

  const showBackButton = (onClick: () => void) => {
    if (isTelegram && backButton.show.isAvailable()) {
      backButton.show();
      backButton.onClick(onClick);
    }
  };

  const hideBackButton = () => {
    if (isTelegram && backButton.hide.isAvailable()) {
      backButton.hide();
    }
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    if (isTelegram && miniApp.isSupported()) {
      try {
        if (type === 'success' || type === 'error') {
          (window as any).Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
        } else {
          (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(type);
        }
      } catch {
        // Haptic not available
      }
    }
  };

  const cloudGet = async (key: string): Promise<string | null> => {
    if (isTelegram && cloudStorage.getItem.isAvailable()) {
      try {
        return await cloudStorage.getItem(key);
      } catch {
        return localStorage.getItem(key);
      }
    }
    return localStorage.getItem(key);
  };

  const cloudSet = async (key: string, value: string): Promise<void> => {
    if (isTelegram && cloudStorage.setItem.isAvailable()) {
      try {
        await cloudStorage.setItem(key, value);
        return;
      } catch {
        localStorage.setItem(key, value);
      }
    }
    localStorage.setItem(key, value);
  };

  const expand = () => {
    if (isTelegram && viewport.expand.isAvailable()) {
      viewport.expand();
    }
  };

  const setHeaderColor = (color: string) => {
    if (isTelegram) {
      const webApp = (window as any).Telegram?.WebApp;
      if (webApp?.setHeaderColor) {
        webApp.setHeaderColor(color);
      }
    }
  };

  const setBackgroundColor = (color: string) => {
    if (isTelegram) {
      const webApp = (window as any).Telegram?.WebApp;
      if (webApp?.setBackgroundColor) {
        webApp.setBackgroundColor(color);
      }
    }
  };

  return (
    <TelegramContext.Provider
      value={{
        isReady,
        isTelegram,
        user,
        initDataRaw,
        themeParams: theme,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
        hapticFeedback,
        cloudGet,
        cloudSet,
        expand,
        setHeaderColor,
        setBackgroundColor,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export default TelegramProvider;
