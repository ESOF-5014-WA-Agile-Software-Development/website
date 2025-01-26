import Head from "next/head";
import React, { useEffect, useState } from "react";
import NoSSR from '@mpth/react-no-ssr';
import { Row, Col, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

import AgileLayout from "../_layout";
import { GetUser, IsUserLogin } from "../../lib/user";
import { useAppSelector } from "../../store/hooks";
import { ConnectSite, Sign } from "../../lib/mm";
import { Urls } from "../../lib/url";

function MetaMaskLoading() {
  return (
    <Row justify="center" align="middle">
      <div
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingOutlined style={{ fontSize: "70px" }} />
      </div>
    </Row>
  );
}

function MetaMaskLogin(props: any) {
  const { setUser, notify } = props;
  const [loading, setLoading] = useState(false);
  const ether = useAppSelector((state) => state.ether);

  const loginMetaMask = async () => {
    setLoading(true);

    let data;
    try {
      let res = await axios.get(Urls.auth.getMetaMaskNonce(ether.account));
      data = await res.data;
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.status === 400 &&
        err.response.data &&
        err.response.data.length > 0 &&
        err.response.data[0].msg === "record not found"
      ) {
        notify.error("", "Please sign up your address first");
        return;
      }
      notify.error("Get nonce failed", "please try again");
      return;
    } finally {
      setLoading(false);
    }

    let result;
    try {
      let msg = `Agile is signing the nonce: ${data.nonce} for login.`;
      result = await Sign(ether.account, msg);
    } catch (e) {
      if (e.code && e.code === 4001) {
        return;
      } else {
        notify.error("MetaMask Sign Failed", e.toString());
        return;
      }
    } finally {
      setLoading(false);
    }

    try {
      let r = await axios.post(Urls.auth.signInMetaMask(), {
        metamask: ether.account,
        sign: result,
      });
      let response = await r.data;
      localStorage.setItem("user", JSON.stringify(response));
      setUser(GetUser());
    } catch (err) {
      notify.error("Login error", err.toString());
      return;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <MetaMaskLoading />;
  } else {
    return (
      <div>
        <Row justify="center" align="middle">
          <Image src="/images/metamask.png" height={70} width={70} alt="" />
        </Row>
        <br />
        <Row justify="center" align="middle">
          <Button type="primary" onClick={loginMetaMask} disabled={loading}>
            Login MetaMask
          </Button>
        </Row>
      </div>
    );
  }
}

function MetaMaskConnect(props: any) {
  const { notify, connecting, setConnecting } = props;

  function connectMetaMask() {
    setConnecting(true);
    const accountsChanged = function () {};
    const rejectedCallback = function () {
      setConnecting(false);
    };
    const errorCallback = function (code: any) {
      notify.error("Connect Error!", "error code: " + code.toString());
      setConnecting(false);
    };
    const end = function () {
      setConnecting(false);
    };
    ConnectSite(accountsChanged, rejectedCallback, errorCallback, end);
  }

  return (
    <div>
      <Row justify="center" align="middle">
        <Image src="/images/metamask.png" height={70} width={70} alt="" />
      </Row>
      <br />
      <Row justify="center" align="middle">
        <Button
          type="primary"
          onClick={connectMetaMask}
          disabled={connecting}
          danger
        >
          Connect MetaMask
        </Button>
      </Row>
    </div>
  );
}

function MetaMaskHelp() {
  return (
    <div>
      <Row justify="center" align="middle">
        <Image src="/images/metamask.png" height={70} width={70} alt="" />
      </Row>
      <br />
      <Row justify="center" align="middle">
        <Button
          type="primary"
          onClick={() => {
            window.open("https://metamask.io/download.html", "_blank");
          }}
          danger
        >
          Install MetaMask
        </Button>
      </Row>
    </div>
  );
}

function Content(props: any) {
  const etherState = useAppSelector((state) => state.ether);
  const [connecting, setConnecting] = useState(false);

  if (!etherState.selectedWalletExists) {
    return <MetaMaskHelp {...props} />;
  } else if (!etherState.account || connecting) {
    return (
      <MetaMaskConnect
        {...props}
        connecting={connecting}
        setConnecting={setConnecting}
      />
    );
  } else {
    return <MetaMaskLogin {...props} />;
  }
}

function Page(props: any) {
  const router = useRouter();
  const { user } = props;

  useEffect(() => {
    if (IsUserLogin(user)) {
      router
        .push("/")
        .then(function () {})
        .catch(function () {});
    }
  }, [user, router]);

  if (IsUserLogin(user)) {
    return (
      <NoSSR>
        <Head>
          <title>Sign In Agile / Agile</title>
          <meta name="description" content="Sign In Agile by MetaMask." />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          You are logged in, will redirect you to home...
        </Row>
      </NoSSR>
    );
  } else {
    return (
      <NoSSR>
        <Head>
          <title>Sign In Agile / Agile</title>
          <meta name="description" content="Sign In Agile by MetaMask." />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Row justify="space-around" align="middle" style={{ height: "100%" }}>
          <Col xs={22} sm={14} md={12} lg={9} xl={8} xxl={5}>
            <Content {...props} />
          </Col>
        </Row>
      </NoSSR>
    );
  }
}

export default AgileLayout(Page);
