import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Layout,
  Row,
  Col,
  Drawer,
  Avatar,
  Dropdown,
  Menu,
  Spin,
  notification,
  Image,
} from "antd";
const { Header, Content } = Layout;
import {
  MenuOutlined,
  DownCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";

import { useAppDispatch } from "../store/hooks";
// ether
import {
  WalletType,
  selectWallet,
  setSelectedWalletExists,
  setProviderReady,
  setChainID,
  setChainName,
  setAccount,
} from "../store/ether";
import {
  IsMetaMaskExists,
  MetaMaskProvider,
  IsMetaMaskReady,
  OnMetaMaskEvents,
} from "../lib/mm";
// auth
import {
  User,
  EmptyUserState,
  GetUser,
  IsUserLogin,
  Logout,
} from "../lib/user";
import styles from "../styles/contentLayout.module.css";

// settings
notification.config({
  placement: "topRight",
  duration: 4.5,
  rtl: false,
  top: 76,
});

const UserSideMenu = (props: any) => {
  const { user, setUser, userLoading } = props;
  const router = useRouter();

  const onLogout = async () => {
    Logout();
    setUser(EmptyUserState);
    await router.push("/");
  };

  const ConsoleEnabled = () => {
    if (
      user &&
      user.info &&
      user.info.email &&
      (user.info.email === "hongkang@hongkang.name")
    ) {
      return (
        <Link href="/console" passHref>
          <p>Console</p>
        </Link>
      );
    } else {
      return <></>;
    }
  };

  if (userLoading) {
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    );
  } else if (!IsUserLogin(user)) {
    return (
      <>
        <Link href="/sign-up/meta-mask" passHref>
          <p>Sign Up</p>
        </Link>
        <Link href="/sign-in" passHref>
          <p>Sign In</p>
        </Link>
      </>
    );
  } else {
    return (
      <>
        <ConsoleEnabled />
        <Link href="/studio" passHref>
          <p>Studio</p>
        </Link>
        <a onClick={onLogout}>Logout</a>
      </>
    );
  }
};

const UserMenu = (props: any) => {
  const { user, setUser, userLoading } = props;
  const router = useRouter();

  const onLogout = async () => {
    Logout();
    setUser(EmptyUserState);
    await router.push("/");
  };

  const ConsoleEnabled = () => {
    if (
      user &&
      user.info &&
      user.info.email &&
      (user.info.email === "hongkang@hongkang.name")
    ) {
      return (
        <>
          <Menu.Item key="console">
            <Link href="/console">Console</Link>
          </Menu.Item>
          <Menu.Divider />
        </>
      );
    } else {
      return <></>;
    }
  };

  const userMenu = (
    <Menu>
      <ConsoleEnabled />
      <Menu.Item key="studio">
        <Link href="/studio">Studio</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={onLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  if (userLoading) {
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    );
  } else if (!IsUserLogin(user)) {
    return (
      <>
        <Link href="/sign-up/meta-mask">
          <a className="header-nav">Sign Up</a>
        </Link>
        <Link href="/sign-in">
          <a className="header-nav">Sign In</a>
        </Link>
      </>
    );
  } else {
    return (
      <Row justify="space-around" align="middle">
        <Col span={8}>
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
        </Col>
        <Col span={4} />
        <Col span={8}>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Avatar
              size={35}
              gap={3}
              style={{
                backgroundColor: "#e4e6eb",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
            >
              <DownCircleOutlined style={{ color: "#1d1f23" }} />
            </Avatar>
          </Dropdown>
        </Col>
      </Row>
    );
  }
};

const AgileHeader = (props: any) => {
  const router = useRouter();
  const [sideMenu, setSideMenu] = useState(false);
  const { user, setUser, userLoading } = props;

  const showSideMenu = () => {
    setSideMenu(true);
  };

  const onSideMenuClose = () => {
    setSideMenu(false);
  };

  return (
    <Header>
      <Row>
        <Col xs={22} sm={22} md={1} lg={1} xl={1} xxl={1}>
          <Image
            preview={false}
            src="/images/favicon.png"
            alt="TODO LOGO"
            height={45}
            style={{ display: "inline-block", cursor: "pointer" }}
            onClick={() => router.push("/")}
          />
        </Col>
        <Col xs={0} sm={0} md={9} lg={10} xl={10} xxl={10} offset={9}>
          <div style={{ float: "right" }}>
            {/* Menu */}
            <Link href="/news">
              <a className="header-nav">News</a>
            </Link>
            <Link href="/market">
              <a className="header-nav">Market</a>
            </Link>
            <Link href="/about">
              <a className="header-nav">About</a>
            </Link>
          </div>
        </Col>
        <Col xs={0} sm={0} md={5} lg={4} xl={4} xxl={4}>
          <div style={{ float: "right" }}>
            <UserMenu user={user} setUser={setUser} userLoading={userLoading} />
          </div>
        </Col>
        <Col xs={1} sm={1} md={0} lg={0} xl={0} xxl={0} />
        <Col xs={1} sm={1} md={0} lg={0} xl={0} xxl={0}>
          <MenuOutlined onClick={showSideMenu} />
        </Col>
      </Row>
      <Drawer
        title="Agile"
        placement="left"
        closable={false}
        onClose={onSideMenuClose}
        visible={sideMenu}
        key="left"
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        {/* Menu */}
        <Link href="/news" passHref>
          <p>News</p>
        </Link>
        <Link href="/market" passHref>
          <p>Market</p>
        </Link>
        <Link href="/about" passHref>
          <p>About</p>
        </Link>
        <UserSideMenu {...props} />
      </Drawer>
    </Header>
  );
};

const Context = React.createContext({ name: "notification" });
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
      setUser(GetUser());
      setUserGetLoading(false);
    }, []);

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
          const { status } = error.response;
          if (status === 401) {
            Logout();
            redirect().then(() => {});
            // TODO return?
          } else if (status === 403) {
            notify(api).error("no permission", status);
            // TODO return?
          }
          return Promise.reject(error);
        }
      );
    }, [api, router]);

    return (
      <Context.Provider value={{ name: "notification" }}>
        {contextHolder}
        <div className={styles.layoutHome}>
          <Layout>
            <AgileHeader
              user={user}
              setUser={setUser}
              userLoading={userGetLoading}
            />
            <Content>
              <Component
                {...props}
                user={user}
                setUser={setUser}
                notify={notify(api)}
              />
            </Content>
          </Layout>
        </div>
      </Context.Provider>
    );
  };
}

export default AgileLayout;
