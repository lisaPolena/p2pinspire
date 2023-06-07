import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { AppStateProvider } from '@/components/general/AppStateContext';
import { SessionProvider } from "next-auth/react";
import '@/styles/globals.css'
import customTheme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

export default function App({ Component, pageProps }: AppProps) {

  const { chains, publicClient } = configureChains(
    [polygonMumbai],
    [
      alchemyProvider({ apiKey: '2qNZE4vHDxHv7f_2vcF1WrGtOa-ALKJW' }),
      publicProvider()
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: 'Web3Pinterest',
    projectId: '875210f269badbd4a01da1fab3ee5fde',
    chains
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Web3Pinterest',
  });

  return (
    <AppStateProvider>
      <WagmiConfig config={wagmiConfig}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider chains={chains}>
              <ChakraProvider theme={customTheme}>
                <Component {...pageProps} />
              </ChakraProvider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>

        </SessionProvider>
      </WagmiConfig>
    </AppStateProvider>

  );
}
