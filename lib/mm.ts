import { ethers } from "ethers";


export const IsMetaMaskExists = () : boolean => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // @ts-ignore
        return true
    }
    return false
}

export const MetaMaskProvider: () => ethers.providers.Web3Provider = function () {
    // @ts-ignore
    return new ethers.providers.Web3Provider(window.ethereum)
}

// note: https://docs.metamask.io/guide/ethereum-provider.html#ethereum-isconnected
export const IsMetaMaskReady = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // @ts-ignore
        return window.ethereum.isConnected()
    }
    return false
}

export const OnMetaMaskEvents = (
    onConnect: any,
    onDisconnect: any,
    onAccountsChanged: any,
    onChainChanged: any,
    onMessage: any) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // @ts-ignore
        window.ethereum.on('connect', onConnect);
        // @ts-ignore
        window.ethereum.on('disconnect', onDisconnect);
        // @ts-ignore
        window.ethereum.on('accountsChanged', onAccountsChanged);
        // @ts-ignore
        window.ethereum.on('chainChanged', onChainChanged);
        // @ts-ignore
        window.ethereum.on('message', onMessage);
    }
}

export const MetaMaskSelectedAddress = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // @ts-ignore
        return window.ethereum.selectedAddress
    }
    return null
}

export const ConnectSite = (accountsChanged: any, userRejectedCallback: any, errorCallback: any, end: any) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // @ts-ignore
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(accountsChanged)
            .catch((err: { code: number }) => {
                if (err.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    userRejectedCallback()
                } else {
                    errorCallback(err.code)
                }
            })
            .finally(end);
    }
}

export const Sign = async (account: string|null, payload: any) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // @ts-ignore
        const result = await window.ethereum.request({
            method: 'personal_sign',
            params: [account, payload]
        })
        return result
    }
    return null
}
