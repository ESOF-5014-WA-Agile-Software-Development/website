import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";

import { Card, Row, Col, Form, Input, Button, Typography, message, InputRef } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

import { EllipsisMiddle } from "@/components/ellipsis";
import AgileLayout from "@/components/layout";
import { Urls } from "@/lib/url";
import { useAppSelector } from "@/store/hooks";
import { ConnectSite, Sign } from "@/lib/mm";
import { IsUserLogin } from "@/lib/user";

import styles from '@/styles/signup.module.css';


function SignUpMetaMask(props: any) {
  const { notify } = props;

  const ether = useAppSelector((state) => state.ether);
  const router = useRouter();
  const [form] = Form.useForm();
  const [captchaDisabled, setCaptchaDisabled] = useState(false);
  const [time, setTime] = useState(60);
  const [captchaContent, setCaptchaContent] = useState('send captcha');
  // const [nameExists, setNameExists] = useState(false);
  // const [emailExists, setEmailExists] = useState(false);
  let ti = time;
  let timeChange: any;
  const clock = () => {
    if (ti > 0) {
      //当ti>0时执行更新方法 
      ti = ti - 1;
      setTime(ti);
      setCaptchaContent(ti + 's then resend')
    } else {
      //当ti=0时执行终止循环方法
      setCaptchaDisabled(false)
      setTime(60);
      setCaptchaContent('send captcha')
      clearInterval(timeChange);
    }
  }

  // auto focus
  const inputNameRef = useRef<InputRef | null>(null);
  useEffect(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  }, [inputNameRef]);

  const onSendCaptcha = async () => {
    const name = form.getFieldValue("name");
    const metamask = form.getFieldValue("metamask");
    const email = form.getFieldValue("email");

    if (!name) {
      message.error("Please enter your name ");
      return;
    }
    if (!email) {
      message.error("Please enter your email address");
      return;
    }
    setCaptchaDisabled(true);
    //每隔一秒执行一次clock方法   
    timeChange = setInterval(clock, 1000);

    try {
      const res = await axios.post(Urls.auth.sendEmailCaptcha(), {
        metamask: metamask,
        name: name,
        email: email,
      });
      await res.data;
      notify.success("Send email success", "");
    } catch (err: any) {
      if (
        err &&
        err.response &&
        err.response.status === 400 &&
        err.response.data &&
        err.response.data.length > 0
      ) {
        notify.error("Send email failed", err.response.data[0].msg);
        setCaptchaDisabled(false);
        clearInterval(timeChange)
        return;
      }
      notify.error("Send email failed", err.toString());
      return;
    } finally {
      // setCaptchaDisabled(false);
    }


  };

  const onCheck = async () => {
    try {
      await form.validateFields();
    } catch (err) {
      console.error(err);
      return;
    }

    let result = "";
    try {
      result = await Sign(
        ether.account,
        "Agile uses this cryptographic signature to verify that you are the owner of this address."
      );
    } catch (e: any) {
      if (e.code && e.code === 4001) {
        return;
      } else {
        notify.error("MetaMask Sign Failed", e.toString());
        return;
      }
    }

    const name = form.getFieldValue("name");
    const email = form.getFieldValue("email");
    const metamask = form.getFieldValue("metamask");
    const captcha = form.getFieldValue("captcha");

    try {
      const res = await axios.post(Urls.auth.signUpMetaMask(), {
        metamask: metamask,
        sign: result,
        name: name,
        email: email,
        captcha: captcha,
      });
      await res.data;
      notify.success("Sign up success", "");
      setTimeout(function () {
        router.push("/sign-in").then();
      }, 1000);
    } catch (err: any) {
      if (
        err &&
        err.response &&
        err.response.status === 400 &&
        err.response.data &&
        err.response.data.length > 0
      ) {
        notify.error("Sign up failed", err.response.data[0].msg);
        return;
      }
      notify.error("Sign up failed", err.toString());
      return;
    } finally {
    }
  };

  const [userInputDisabled, setUserInputDisabled] = useState(false);
  const onNameInputBlur = async () => {
    const userName = form.getFieldValue("name");
    if (!userName) {
      return;
    }
    const nameInputError = form.getFieldError("name");
    if (nameInputError.length > 0) {
      return;
    }

    setUserInputDisabled(true);
    try {
      const res = await axios.get(Urls.auth.checkUserExists(userName));
      const data = await res.data;
      if (data.exists) {
        form.setFields([{ name: "name", errors: ["name exists"] }]);
      }
    } catch (err) {
        console.error(err);
    } finally {
      setUserInputDisabled(false);
    }
  };

  return (
    <Card title="Create your account" className={styles['sign-up']}>
      <Form
        form={form}
        name="meta-mask-sign-up"
        initialValues={{
          metamask: ether.account,
        }}
      >
        <Form.Item
          name="metamask"
          rules={[{ required: true, message: "please connect to MetaMask" }]}
        >
          <Row gutter={7} justify="center" align="middle">
            <Col span={3}>
              <Image src="/images/metamask.png" height={30} width={30} alt="" />
            </Col>
            <Col span={21}>
              <Typography.Text type="secondary" strong>
                <EllipsisMiddle suffixCount={14} width="100%">
                  {ether.account}
                </EllipsisMiddle>
              </Typography.Text>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="name"
          rules={[
            { required: true, message: "please input your name" },
            {
              pattern: new RegExp(
                `^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$`
              ),
              message: "_ - words numbers",
            },
          ]}
        >
          <Input
            ref={inputNameRef}
            placeholder="Enter your name"
            onBlur={onNameInputBlur}
            disabled={userInputDisabled}
            prefix={<UserOutlined className="site-form-item-icon" />}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "The input is not valid Email!" },
            { required: true, message: "Please input your Email!" },
          ]}
        >
          <Input
            placeholder="Enter your email"
            prefix={<MailOutlined className="site-form-item-icon" />}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="captcha"
          rules={[
            { required: true, message: "please input the captcha you got!" },
          ]}
          extra="We must make sure that your are a human."
        >
          <Row gutter={7} align="middle">
            <Col xs={14}>
              <Input placeholder="captcha" size="large" type="number" />
            </Col>
            <Col xs={10}>
              <Button
                size="large"
                style={{ width: "100%", textAlign: 'center', padding: 0 }}
                onClick={onSendCaptcha}
                disabled={captchaDisabled}>{captchaContent}</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Row gutter={7}>
            <Col xs={12}>
              <Button size="large" href="/" block>
                Cancel
              </Button>
            </Col>
            <Col xs={12}>
              <Button type="primary" onClick={onCheck} size="large" block>
                Submit
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Card>
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

function MetaMaskConnect(props: any) {
  const { notify, connecting, setConnecting } = props;

  function connectMetaMask() {
    setConnecting(true);
    const accountsChanged = function () { };
    const userRejectedCallback = function () {
      setConnecting(false);
    };
    const errorCallback = function (code: any) {
      notify.error("Connect Error!", "error code: " + code.toString());
      setConnecting(false);
    };
    const end = function () {
      setConnecting(false);
    };
    ConnectSite(accountsChanged, userRejectedCallback, errorCallback, end);
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

function Content(props: any) {
  const ether = useAppSelector((state) => state.ether);
  const [connecting, setConnecting] = useState(false);

  if (!ether.selectedWalletExists) {
    return <MetaMaskHelp {...props} />;
  } else if (!ether.account || connecting) {
    return (
      <MetaMaskConnect
        {...props}
        connecting={connecting}
        setConnecting={setConnecting}
      />
    );
  } else {
    return <SignUpMetaMask {...props} />;
  }
}

function Page(props: any) {
  const router = useRouter();
  const { user } = props;

  useEffect(() => {
    if (IsUserLogin(user)) {
      router
        .push("/")
        .then(function () { })
        .catch(function () { });
    }
  }, [user, router]);

  if (IsUserLogin(user)) {
    return (
      <>
        <Head>
          <title>Sign Up Agile / Agile</title>
          <meta name="description" content="Sign Up Agile by MetaMask." />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          You are logged in, will redirect you to home...
        </Row>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Sign Up Agile / Agile</title>
          <meta name="description" content="Sign Up Agile by MetaMask." />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Row justify="space-around" align="middle" style={{ height: "100%" }}>
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
