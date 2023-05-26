import MetamaskProvider from '@/components/general/MetaMaskProvider';
import '@/styles/globals.css'
import customTheme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app'
import Web3 from 'web3';
import { provider } from 'web3-core';


function getLibrary(provider: provider): Web3 {
  return new Web3(provider);
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetamaskProvider>
        <ChakraProvider theme={customTheme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </MetamaskProvider>
    </Web3ReactProvider>
  );
}
