import { AppStateProvider } from '@/components/general/AppStateContext';
import MetamaskProvider from '@/components/general/MetaMaskProvider';
import '@/styles/globals.css'
import customTheme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app'
import { Web3Provider } from '@ethersproject/providers'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppStateProvider>
      <Web3ReactProvider getLibrary={(provider) => new Web3Provider(provider)}>
        <MetamaskProvider>
          <ChakraProvider theme={customTheme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </MetamaskProvider>
      </Web3ReactProvider>
    </AppStateProvider>

  );
}
