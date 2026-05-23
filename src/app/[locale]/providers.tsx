'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, type Locale, lightTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/src/wagmi';
import { NextIntlClientProvider } from 'next-intl';

const queryClient = new QueryClient();

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: Locale;
  messages: Record<string, any>;
}) {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RainbowKitProvider locale={locale} theme={lightTheme({
            borderRadius: 'medium',
            accentColor: '#2C7A5C',
            accentColorForeground: '#e8e4db',
          })}>
            {children}
          </RainbowKitProvider>
        </NextIntlClientProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}