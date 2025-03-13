import { ethers } from "ethers";


export const IsMetaMaskExists = () : boolean => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        return true
    }
    return false
}

export const MetaMaskProvider: () => ethers.providers.Web3Provider = function () {
    return new ethers.providers.Web3Provider(window.ethereum)
}

// note: https://docs.metamask.io/guide/ethereum-provider.html#ethereum-isconnected
export const IsMetaMaskReady = () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
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
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        window.ethereum.on('connect', onConnect);
        window.ethereum.on('disconnect', onDisconnect);
        window.ethereum.on('accountsChanged', onAccountsChanged);
        window.ethereum.on('chainChanged', onChainChanged);
        window.ethereum.on('message', onMessage);
    }
}

export const MetaMaskSelectedAddress = () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        return window.ethereum.selectedAddress
    }
    return null
}

export const ConnectSite = (accountsChanged: any, userRejectedCallback: any, errorCallback: any, end: any) => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
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
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        const result = await window.ethereum.request({
            method: 'personal_sign',
            params: [account, payload]
        })
        return result
    }
    return null
}
