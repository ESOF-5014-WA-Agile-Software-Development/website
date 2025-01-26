import Head from "next/head";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { utils } from "ethers";
import Link from "next/link";

import NoSSR from '@mpth/react-no-ssr';

import { Row, Col, Card, Image, Descriptions, Typography } from "antd";
import AgileLayout from "../_layout";
import { MarketArt } from "../../lib/type";
import { Footer } from "../../components/footer";
import styles from "../../styles/market.module.css";
import { StateTag } from "./[token]";

const { Title } = Typography;

const ArtistImage = ({ arts, one, two, three, RowOne, RowTwo }: any) => {
  return (
    <>
      {/* 一个 */}
      <Row
        gutter={[10, 10]}
        style={{
          fontWeight: "bolder",
          padding: "0 1rem",
          paddingBottom: "64px",
        }}
      >
        {arts.map((item: any) => {
          return (
            <Col
              key={item.e_token}
              xs={24}
              sm={24}
              md={0}
              lg={0}
              xl={0}
              xxl={0}
              style={{
                fontWeight: "bolder",
                backgroundColor: "#FAFBFC",
                margin: "0.3rem 0",
              }}
            >
              <SmallImage item={item} />
            </Col>
          );
        })}
      </Row>
      {/* 二个 */}
      <Row
        gutter={[10, 10]}
        style={{
          fontWeight: "bolder",
          padding: "0 10px",
          paddingBottom: "64px",
        }}
      >
        <Col xs={0} sm={0} md={12} lg={12} xl={0} xxl={0}>
          {RowOne.map((item: any, index: any) => {
            return <SmallImage item={item} key={index} />;
          })}
        </Col>
        <Col xs={0} sm={0} md={12} lg={12} xl={0} xxl={0}>
          {RowTwo.map((item: any, index: any) => {
            return <SmallImage item={item} key={index} />;
          })}
        </Col>
        {/* {arts.map((item: any) => {
          return (
            <Col
              key={item.e_token}
              xs={0}
              sm={0}
              md={12}
              lg={12}
              xl={0}
              xxl={0}
              style={{ backgroundColor: "#FAFBFC", margin: "1rem 0" }}
            >
              <SmallImage item={item} />
            </Col>
          );
        })} */}
      </Row>
      {/* 三个 */}
      <Row
        gutter={[18, 18]}
        style={{
          fontWeight: "bolder",
          padding: "0 10px",
          paddingBottom: "64px",
        }}
      >
        <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={8}>
          {one.map((item: any, index: any) => {
            return <SmallImage item={item} key={index} />;
          })}
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={8}>
          {two.map((item: any, index: any) => {
            return <SmallImage item={item} key={index} />;
          })}
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={8}>
          {three.map((item: any, index: any) => {
            return <SmallImage item={item} key={index} />;
          })}
        </Col>
      </Row>
    </>
  );
};

const SmallImage = ({ item }: any) => {
  let currentPrice = `${utils.formatEther(item.e_bid_price.toString())} ETH`
  if (item.e_state === "buyer_settle") {
    currentPrice = `${utils.formatEther(item.e_fixed_price.toString())} ETH`
  }

  const image = (item: MarketArt) => {
    if (item.n_mime_type === "video/mp4") {
      return (
        <Image
          src={`${item.n_oss_url}?x-oss-process=video/snapshot,t_7000,f_png,m_fast`}
          alt=""
          onClick={() => {
            router.push(`/market/${item.e_token}`).then();
          }}
          style={{ cursor: "pointer" }}
          preview={false}
          fallback="data:image/png;base64,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"
        />
      );
    } else {
      return (
        <Image
          src={`${item.n_oss_url}`}
          alt=""
          onClick={() => {
            router.push(`/market/${item.e_token}`).then();
          }}
          style={{ cursor: "pointer" }}
          preview={false}
          fallback="data:image/png;base64,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"
        />
      );
    }
  };

  return (
    <div className={styles.market}>
      <Card cover={image(item)} style={{ padding: "0", margin: '10px 0' }} bordered={false}>
        <Row justify="space-between" style={{ borderBottom: "solid 1px #ccc" }}>
          <Col
            span={12}
            style={{
              lineHeight: "34px",
              fontWeight: 500,
              fontSize: 24,
              fontFamily: "Montserrat",
            }}
          >
            <Descriptions.Item label="Title">{item.n_title}</Descriptions.Item>
          </Col>
          <Col
            span={12}
            style={{
              lineHeight: "34px",
              fontWeight: 500,
              display: "flex",
              justifyContent: "end",
              fontSize: 14,
            }}
          >
            <StateTag edition={item} />
          </Col>
          <Col
            span={12}
            style={{
              lineHeight: "30px",
              fontWeight: "bold",
              fontSize: 14,
              color: "#ccc",
            }}
          >
            <Descriptions.Item label="Artist Name">
              {item.n_user_name}
            </Descriptions.Item>
          </Col>
        </Row>
        <Row justify="end" className="price">
          <Col span={24} className="pri">
            {
              item.e_state === "seller_settle" ||
                item.e_state === "buyer_settle" ?
                <span>Deal Price:&nbsp;</span> : <span>Current Price:&nbsp;</span>
            }
            {currentPrice}
          </Col>
          <Col span={24} className="pri">
            Base Price:&nbsp;
            {`${utils.formatEther(item.e_opening_bid.toString())} ETH`}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const TitleContent = () => {
  return (
    <>
      Collect Agile
      <br />
      Enjoy Agile
    </>
  );
};

function Page(props: any) {
  const title = "Market / Agile";
  const description = "TODO";
  const { user, notify } = props;
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [arts, setArts] = useState<Array<MarketArt>>([]);

  let RowOne: any = [];
  let RowTwo: any = [];
  arts.map((item: any, index: any) => {
    if (index % 2 === 0) {
      RowOne.push(item)
    } else if (index % 2 === 1) {
      RowTwo.push(item)
    }
  })

  let one: any = [];
  let two: any = [];
  let three: any = []
  arts.map((item: any, index: any) => {
    if (index % 3 === 0) {
      one.push(item)
    } else if (index % 3 === 1) {
      two.push(item)
    } else {
      three.push(item)
    }
  })

  useEffect(() => {
    try {
      (async () => {
          /*
        let editions = await axios.get(
          Urls.bs.getMarketArts(current, pageSize)
        );
        if (editions.status !== 200) {
          notify.error("Get NTFS error!", "code: " + editions.status);
          return;
        }
        let nfts = await editions.data;
        */
          let nfts = {
              total: 0,
              arts: []
          }
        setTotal(nfts.total);
        if (!nfts.arts || !Array.isArray(nfts.arts)) {
          setArts([]);
        } else {
          setArts(nfts.arts);
        }
      })();
    } catch (e) {
      notify.error("Get Editions error!", "code: " + e);
    }
  }, [current, notify, pageSize]);


  return (
    <NoSSR>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className={styles.marketBox}>
        <Card style={{ marginTop: "14px", minHeight: "100%" }} bordered={false}>
          <Row>
            <Col xs={0} sm={0} md={0} lg={0} xl={24} xxl={24}>
              <div style={{ padding: "100px 0" }}>
                <Title
                  level={2}
                  style={{
                    fontFamily: "Montserrat",
                    color: "#ebebeb",
                    textAlign: "center",
                    fontSize: 50,
                  }}
                >
                  <TitleContent />
                </Title>
              </div>
            </Col>
            <Col xs={0} sm={0} md={24} lg={24} xl={0} xxl={0}>
              <div style={{ padding: "50px 0" }}>
                <Title
                  level={2}
                  style={{
                    fontFamily: "Montserrat",
                    color: "#ebebeb",
                    textAlign: "center",
                    fontSize: 40,
                  }}
                >
                  <TitleContent />
                </Title>
              </div>
            </Col>
            <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
              <div style={{ padding: "30px 0", fontSize: 30 }}>
                <Title
                  level={2}
                  style={{
                    fontFamily: "Montserrat",
                    color: "#ebebeb",
                    textAlign: "center",
                    fontSize: 30,
                  }}
                >
                  <TitleContent />
                </Title>
              </div>
            </Col>
          </Row>
          <ArtistImage arts={arts} one={one} two={two} three={three} RowOne={RowOne} RowTwo={RowTwo} />
        </Card>
      </div>
      <div style={{ width: "100%", textAlign: "right", fontSize: 20 }}>
        <Link href="/arts">
          <a style={{ marginRight: 20 }}>MORE</a>
        </Link>
      </div>
      <Footer />
    </NoSSR>
  );
}

export default AgileLayout(Page);
