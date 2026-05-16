'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, type Locale, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/src/wagmi';

const queryClient = new QueryClient();

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale={locale} theme={darkTheme({
          borderRadius: 'small',
          accentColor: '#2b2b2b',
          accentColorForeground: '#e8e4db',
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}