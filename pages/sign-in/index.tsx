import axios, {AxiosError} from "axios";
import React, {useEffect, useState} from "react";

import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import {useRouter} from "next/router";

import {Row, Col, Button} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

import AgileLayout from "@/components/layout";
import {useAppSelector} from "@/store/hooks";
import {GetUser, IsUserLogin} from "@/lib/user";
import {ConnectSite, Sign} from "@/lib/mm";
import {Urls} from "@/lib/url";


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
                <LoadingOutlined style={{fontSize: "70px"}}/>
            </div>
        </Row>
    );
}

function MetaMaskLogin(props: any) {
    const {setUser, notify} = props;
    const [loading, setLoading] = useState(false);
    const ether = useAppSelector((state) => state.ether);

    const loginMetaMask = async () => {
        setLoading(true);

        let data;
        try {
            const res = await axios.get(Urls.auth.getMetaMaskNonce(ether.account));
            data = await res.data;
        } catch (err) {
            if (
                err instanceof AxiosError && err.response
                && err.response &&
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
            const msg = `Agile is signing the nonce: ${data.nonce} for login.`;
            result = await Sign(ether.account, msg);
        } catch (e) {
            if (e instanceof Error && "code" in e && (e as any).code === 4001) {
                return;
            } else {
                notify.error("MetaMask Sign Failed", e instanceof Error ? e.message : String(e));
                return;
            }
        } finally {
            setLoading(false);
        }

        try {
            const r = await axios.post(Urls.auth.signInMetaMask(), {
                metamask: ether.account,
                sign: result,
            });
            const response = await r.data;
            localStorage.setItem("user", JSON.stringify(response));
            setUser(GetUser());
        } catch (err) {
            if (err instanceof Error) {
                notify.error("Login error", err.message);
            } else {
                notify.error("Login error", String(err));
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <MetaMaskLoading/>;
    } else {
        return (
            <div>
                <Row justify="center" align="middle">
                    <Image src="/images/metamask.png" height={70} width={70} alt="" priority={true}/>
                </Row>
                <br/>
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
    const {notify, connecting, setConnecting} = props;

    function connectMetaMask() {
        setConnecting(true);
        const accountsChanged = function () {
        };
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
                <Image src="/images/metamask.png" height={70} width={70} alt="" priority={true}/>
            </Row>
            <br/>
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
                <Image src="/images/metamask.png" height={70} width={70} alt="" priority={true}/>
            </Row>
            <br/>
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
    const {user} = props;

    useEffect(() => {
        if (IsUserLogin(user)) {
            router
                .push("/")
                .then(function () {
                })
                .catch(function () {
                });
        }
    }, [user, router]);

    if (IsUserLogin(user)) {
        return (
            <>
                <Head>
                    <title>Sign In Agile / Agile</title>
                    <meta name="description" content="Sign In Agile by MetaMask."/>
                    <link rel="icon" href="/favicon.png"/>
                </Head>
                <Row justify="center" align="middle" style={{height: "100%"}}>
                    You are logged in, will redirect you to home...
                </Row>
            </>
        );
    } else {
        return (
            <>
                <Head>
                    <title>Sign In Agile / Agile</title>
                    <meta name="description" content="Sign In Agile by MetaMask."/>
                </Head>
                <Row justify="space-around" align="middle" style={{height: "100%"}}>
                    <Col xs={22} sm={14} md={12} lg={9} xl={8} xxl={5}>
                        <Content {...props} />
                    </Col>
                </Row>
            </>
        );
    }
}


export default dynamic(() => Promise.resolve(AgileLayout(Page)), {
    ssr: false,
});
