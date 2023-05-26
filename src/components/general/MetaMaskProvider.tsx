import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '@/wallet/connect'
import { useAppState } from './AppStateContext'

function MetamaskProvider({ children }: { children: JSX.Element }): JSX.Element {
    const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()
    const [loaded, setLoaded] = useState(false)
    const { disconnected } = useAppState();

    useEffect(() => {
        if (!disconnected) {
            injected
                .isAuthorized()
                .then((isAuthorized) => {
                    setLoaded(true)
                    if (isAuthorized && !networkActive && !networkError) {
                        activateNetwork(injected)
                    }
                })
                .catch(() => {
                    setLoaded(true)
                })
        }
    }, [activateNetwork, networkActive, networkError, disconnected])
    if (loaded) {
        return children
    }
    return <>Loading</>
}

export default MetamaskProvider