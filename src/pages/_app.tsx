import { AppStateProvider } from '@/components/general/AppStateContext';
import MetamaskProvider from '@/components/general/MetaMaskProvider';
import '@/styles/globals.css'
import customTheme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from "@web3-react/core";

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {

  const { chains, publicClient } = configureChains(
    [polygon, polygonMumbai],
    [
      alchemyProvider({ apiKey: '2qNZE4vHDxHv7f_2vcF1WrGtOa-ALKJW' }),
      publicProvider()
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: '875210f269badbd4a01da1fab3ee5fde',
    chains
  });
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })

  return (
    <AppStateProvider>
      {/* <Web3ReactProvider getLibrary={(provider) => new Web3Provider(provider)}> */}
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <ChakraProvider theme={customTheme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
      {/* </Web3ReactProvider> */}
    </AppStateProvider>

  );
}
