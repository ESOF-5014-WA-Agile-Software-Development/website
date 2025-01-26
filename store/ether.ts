import { createSlice } from '@reduxjs/toolkit'


export enum WalletType {
    NotSet = "not-set",
    MetaMask = "meta-mask"
}

interface EtherState {
    selectedWallet: WalletType,
    selectedWalletExists: boolean,
    providerReady: boolean,
    chainId: string | null,
    chainName: string | null,
    account: string | null
}

const initState: EtherState = {
    selectedWallet: WalletType.NotSet,
    selectedWalletExists: false,
    providerReady: false,
    chainId: null,
    chainName: null,
    account: null
}

export const ether = createSlice({
    name: 'ether',
    initialState: initState,
    reducers: {
        selectWallet: (state, action) => {
            state.selectedWallet = action.payload
        },
        setSelectedWalletExists: (state, action) => {
            state.selectedWalletExists = action.payload
        },
        setProviderReady: (state, action) => {
            state.providerReady = action.payload
        },
        setChainID: (state, action) => {
            state.chainId = action.payload
        },
        setChainName: (state, action) => {
            state.chainName = action.payload
        },
        setAccount: (state, action) => {
            state.account = action.payload
        }
    }
})

export const {
    selectWallet,
    setSelectedWalletExists,
    setProviderReady,
    setChainID,
    setChainName,
    setAccount
} = ether.actions

export default ether.reducer
