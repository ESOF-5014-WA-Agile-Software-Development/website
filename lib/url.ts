
export const Urls = {
    auth: {
        getName: (id:number) => `/api/users/${id}`,
        checkUserExists: (name:string) => `/api/exists/users/${name}`,
        sendEmailCaptcha: () => `/api/verify/email`,
        signInMetaMask: () => `/api/sign-in/metamask`,
        signUpMetaMask: () => `/api/sign-up/metamask`,
        getMetaMaskNonce: (address:string|null) => `/api/metamask/${address}/nonce`
    },
    bs: {
        getOssToken: () => `/api/bs/v1/oss/token`,
        createNFT: () => `/api/bs/v1/nfts`,
        getNFTS: () => `/api/bs/v1/nfts`,
        getConsoleNFTS: () => `/api/bs/v1/console/nfts`,
        updateConsoleNFTS: (nft:number) => `/api/bs/v1/console/nfts/${nft}`,
        retryNFTSPreProcess: (nft:number) => `/api/bs/v1/nfts/${nft}/action`,
        mintNFT: (nft:number) => `/api/bs/v1/nfts/${nft}/mint`,
        getEditions: (nft:number) => `/api/bs/v1/nfts/${nft}/editions`,
        getMarketArts: (current:number, page_size:number) => `/api/bs/v1/market/arts?current=${current}&page_size=${page_size}`,
        GetEditionByToken: (token:string) => `/api/bs/v1/tokens/${token}`
    }
}

export function GetSuffix(filename: string) {
    const pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos !== -1) {
        suffix = filename.substring(pos)
    }
    return suffix
}

export function hashFnv32a(str:string, asString:boolean, seed:any) {
    let i, l, val = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        val ^= str.charCodeAt(i);
        val += (val << 1) + (val << 4) + (val << 7) + (val << 8) + (val << 24);
    }
    if( asString ){
        return ("0000000" + (val >>> 0).toString(16)).substr(-8);
    }
    return val >>> 0;
}

export function Hash(str:string) {
    let i, l, val = 0x811c9dc5;

    for (i = 0, l = str.length; i < l; i++) {
        val ^= str.charCodeAt(i);
        val += (val << 1) + (val << 4) + (val << 7) + (val << 8) + (val << 24);
    }
    return ("0000000" + (val >>> 0).toString(16)).substr(-8);
}
