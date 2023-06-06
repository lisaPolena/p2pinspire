import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import WalletConnect from "@walletconnect/web3-provider";

export const injected = new InjectedConnector({
    supportedChainIds: [80001, 137],
});

export const walletconnect = new WalletConnectConnector({
    rpc: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL,
    chainId: 137,
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    supportedChainIds: [80001, 137],
})

export const providerOptions = {
    binancechainwallet: {
        package: true,
    },
    walletconnect: {
        package: WalletConnect, // required
        options: {
            rpcUrl: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL,
            chainId: 137,
            qrcode: true,
            bridge: "https://bridge.walletconnect.org",
        }
    },
};

