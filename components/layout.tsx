import axios from "axios";
import React, {useState, useEffect, useCallback} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

import {Layout, Avatar, Dropdown, notification, Image, MenuProps} from "antd";

import {useAppDispatch} from "@/store/hooks";
import {
    WalletType, selectWallet, setSelectedWalletExists, setProviderReady, setChainID, setChainName, setAccount
} from "@/store/ether";
import {IsMetaMaskExists, MetaMaskProvider, IsMetaMaskReady, OnMetaMaskEvents} from "@/lib/mm";
import {User, EmptyUserState, GetUser, IsUserLogin, Logout} from "@/lib/user";

import styles from "@/styles/layout.module.css";


const {Header, Content} = Layout;

notification.config({
    placement: "topRight",
    duration: 4.5,
    rtl: false,
    top: 76,
});

const AgileHeader = (props: any) => {
    const router = useRouter();
    const {user, setUser, userLoading} = props;

    const handleLogoClick = useCallback(() => router.push("/"), [router]);

    const onClick: MenuProps['onClick'] = async ({key}) => {
        if (key === "1") {
            console.info(`Click on item Profile`);
        } else if (key === "2") {
            Logout();
            setUser(EmptyUserState);
            await router.push("/sign-in");
        }
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Profile'
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Logout'
        }
    ];

    const LoadingOrSignIn = () => {
        return userLoading ?
            <div style={{display: "flex", justifyContent: "center", width: "40px", marginLeft: "30px"}}>
            </div>
            :
            <div style={{display: "flex", alignItems: "center", gap: "12px", marginLeft: "30px"}}>
                <Link className="header-nav" href="/sign-up">Sign Up</Link>
                <Link className="header-nav" href="/sign-in">Sign In</Link>
            </div>;
    }

    return (
        <Header style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Image
                preview={false}
                src="/images/favicon.png"
                alt="CoHome LOGO"
                height={45}
                style={{display: "block", cursor: "pointer"}}
                onClick={handleLogoClick}
            />

            <div style={{display: "flex", alignItems: "center"}}>
                <div style={{display: "flex", gap: "3px"}}>
                    <Link className="header-nav" href="/about">About</Link>
                </div>
                {
                    IsUserLogin(user) ?
                        <div style={{display: "flex", justifyContent: "center", width: "40px", marginLeft: "30px"}}>
                            <Dropdown menu={{items, onClick}} trigger={["click"]}>
                                <Avatar
                                    size={35}
                                    gap={3}
                                    style={{
                                        backgroundColor: "#87d068",
                                        verticalAlign: "middle",
                                        cursor: "pointer",
                                    }}
                                >
                                    {user.info ? user.info.name[0] : ""}
                                </Avatar>
                            </Dropdown>
                        </div>
                        :
                        <LoadingOrSignIn/>
                }
            </div>
        </Header>
    );
};

const Context = React.createContext({name: "notification"});
const notify = (api: any) => {
    return {
        open: (title: any, desc: any) => {
            api.open({
                message: title,
                description: <Context.Consumer>{() => `${desc}`}</Context.Consumer>,
            });
        },
        info: (title: any, desc: any) => {
            api.info({
                message: title,
                description: <Context.Consumer>{() => `${desc}`}</Context.Consumer>,
            });
        },
        success: (title: any, desc: any) => {
            api.success({
                message: title,
                description: <Context.Consumer>{() => `${desc}`}</Context.Consumer>,
            });
        },
        warning: (title: any, desc: any) => {
            api.warning({
                message: title,
                description: <Context.Consumer>{() => `${desc}`}</Context.Consumer>,
            });
        },
        error: (title: any, desc: any) => {
            api.error({
                message: title,
                description: <Context.Consumer>{() => `${desc}`}</Context.Consumer>,
            });
        },
    };
};

interface ConnectInfo {
    chainId: string;
}

const onMetaMaskConnect = (dispatch: any) => {
    return (connectInfo: ConnectInfo) => {
        console.log("[metamask] connect event: ", connectInfo);
        loadMetaMaskStates(dispatch)().then();
    };
};

const onMetaMaskDisconnect = (dispatch: any) => {
    return (error: any) => {
        // ProviderRpcError
        console.log("[metamask] on disconnect: ", error);
        loadMetaMaskStates(dispatch)().then();
    };
};

const onMetaMaskAccountsChanged = (dispatch: any) => {
    return (accounts: Array<string>) => {
        console.log("[metamask] on accounts Changed: ", accounts);
        loadMetaMaskStates(dispatch)().then();
    };
};

const onMetaMaskChainChanged = (dispatch: any) => {
    return (chainId: string) => {
        console.log("[metamask] on chain Changed: ", chainId);
        loadMetaMaskStates(dispatch)().then();
    };
};

const onMetaMaskMessage = () => {
    return (message: any) => {
        // ProviderMessage
        console.log("[metamask] on message: ", message);
        // TODO no need to loadMetaMaskStates(dispatch)().then()?
    };
};

const loadMetaMaskStates = (dispatch: any) => {
    return async () => {
        const exists = IsMetaMaskExists();
        if (exists) {
            dispatch(setSelectedWalletExists(true));
            const ready = IsMetaMaskReady();
            dispatch(setProviderReady(ready));
            const p = MetaMaskProvider();
            const n = await p.getNetwork();
            dispatch(setChainID(n.chainId));
            dispatch(setChainName(n.name));
            const accounts = await p.listAccounts();
            let account = null;
            if (accounts.length > 0) {
                account = accounts[0];
            }
            dispatch(setAccount(account));
            console.log(
                `[metamask] exists: ${exists}, ready: ${ready},`,
                `chainID: ${n.chainId}, chainName: ${n.name}, account: ${account}`
            );
        } else {
            dispatch(setSelectedWalletExists(false));
            dispatch(setProviderReady(false));
            dispatch(setChainID(null));
            dispatch(setChainName(null));
            dispatch(setAccount(null));
            console.log(
                `[metamask] exists: ${false}, ready: ${false},`,
                `chainID: ${null}, chainName: ${null}, account: ${null}`
            );
        }
    };
};

function AgileLayout(Component: any) {
    return function WrapWithAgileLayout(props: any) {
        const router = useRouter();

        const dispatch = useAppDispatch();

        // ether
        const [wallet] = useState(WalletType.MetaMask); // TODO actually WalletType.NotSet
        useEffect(() => {
            (async () => {
                // TODO try catch
                dispatch(selectWallet(wallet));
                if (wallet === WalletType.MetaMask) {
                    await loadMetaMaskStates(dispatch)();
                    OnMetaMaskEvents(
                        onMetaMaskConnect(dispatch),
                        onMetaMaskDisconnect(dispatch),
                        onMetaMaskAccountsChanged(dispatch),
                        onMetaMaskChainChanged(dispatch),
                        onMetaMaskMessage()
                    );
                } else {
                    // TODO support other wallets
                    dispatch(setSelectedWalletExists(false));
                    dispatch(setProviderReady(false));
                    dispatch(setChainID(null));
                    dispatch(setChainName(null));
                    dispatch(setAccount(null));
                }
            })();
        }, [dispatch, wallet]);

        // auth
        const [user, setUser] = useState<User>(EmptyUserState);
        const [userGetLoading, setUserGetLoading] = useState(true);
        useEffect(() => {
            const u = GetUser();
            setUser(u);
            setUserGetLoading(false);

            if (router && router.pathname === '/') {
                if (!IsUserLogin(u)) {
                    router.push("/sign-in").then();
                }
            }
        }, [router]);

        // notification
        const [api, contextHolder] = notification.useNotification();

        // axios
        useEffect(() => {
            // config axios
            const redirect = async () => {
                await router.push("/sign-in");
            };
            axios.interceptors.response.use(
                (response) => response,
                (error) => {
                    const {status} = error.response;
                    if (status === 401) {
                        Logout();
                        redirect().then(() => {
                        });
                        // TODO return?
                    } else if (status === 403) {
                        notify(api).error("no permission", status);
                        // TODO return?
                    }
                    return Promise.reject(error);
                }
            );
        }, [api, router]);

        function AgileContent() {
            if (!userGetLoading && IsUserLogin(user)) {
                return <Content>
                    <Component
                        {...props}
                        user={user}
                        setUser={setUser}
                        notify={notify(api)}
                    />
                </Content>
            } else {
                if (router && router.pathname !== '/') {
                    return <Content>
                        <Component
                            {...props}
                            user={user}
                            setUser={setUser}
                            notify={notify(api)}
                        />
                    </Content>
                }
            }
            return <></>;
        }

        return (
            <Context.Provider value={{name: "notification"}}>
                {contextHolder}
                <div className={styles.layoutHome}>
                    <Layout>
                        <AgileHeader
                            user={user}
                            setUser={setUser}
                            userLoading={userGetLoading}
                        />
                        <AgileContent/>
                    </Layout>
                </div>
            </Context.Provider>
        );
    };
}

export default AgileLayout;
