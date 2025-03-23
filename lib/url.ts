const API_BASE_URL = process.env.NODE_ENV === "production"
    ? "https://api.hongkang.name"
    : "";

export const Urls = {
    auth: {
        checkUserExists: (name: string): string => `${API_BASE_URL}/api/exists/users/${name}`,
        sendEmailCaptcha: (): string => `${API_BASE_URL}/api/verify/email`,
        signInMetaMask: (): string => `${API_BASE_URL}/api/sign-in/metamask`,
        signUpMetaMask: (): string => `${API_BASE_URL}/api/sign-up/metamask`,
        getMetaMaskNonce: (address: string | null): string => `${API_BASE_URL}/api/metamask/${address}/nonce`,

        getOngoing: (): string => `${API_BASE_URL}/api/me/ongoing`,
        getPrediction: (): string => `${API_BASE_URL}/api/me/prediction/1`
    },
};

export function GetSuffix(filename: string) {
    const pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos !== -1) {
        suffix = filename.substring(pos)
    }
    return suffix
}

export function hashFnv32a(str: string, asString: boolean, seed: any) {
    let i, l, val = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        val ^= str.charCodeAt(i);
        val += (val << 1) + (val << 4) + (val << 7) + (val << 8) + (val << 24);
    }
    if (asString) {
        return ("0000000" + (val >>> 0).toString(16)).substr(-8);
    }
    return val >>> 0;
}

export function Hash(str: string) {
    let i, l, val = 0x811c9dc5;

    for (i = 0, l = str.length; i < l; i++) {
        val ^= str.charCodeAt(i);
        val += (val << 1) + (val << 4) + (val << 7) + (val << 8) + (val << 24);
    }
    return ("0000000" + (val >>> 0).toString(16)).substr(-8);
}
