import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { Typography, Row, Col, Image } from "antd";

import AgileLayout from "../_layout";
import { banners, bannerArticles } from "../../data/home/banner";
import {Footer} from '../../components/footer'

const { Title, Text } = Typography;

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params;
  let article = null;
  // TODO hongkang
  if (id in bannerArticles) {
    // @ts-ignore
    article = bannerArticles[id];
  }

  return {
    props: {
      article: article,
    },
  };
}

export async function getStaticPaths() {
  const paths = banners.map((banner: { id: string }) => {
    return { params: { id: banner.id } };
  });
  return {
    paths: paths,
    fallback: true,
  };
}

function Banner(props: any) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div
        style={{
          fontSize: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        Loading...
      </div>
    );
  }

  const { article } = props;
  if (article === null) {
    return (
      <div
        style={{
          fontSize: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        404 in page
      </div>
    );
  }

  const BannerDetails = () => {
    const parsed_content = JSON.parse(article.parsed_content);
    return (
      <>
        <Title
          level={2}
          style={{ textAlign: "center", margin: "3rem 0 1.5rem 0" }}
        >
          {article.title}
        </Title>
        <Row gutter={[16, 16]} justify="center" style={{ padding: "0 10px" }}>
          <Col xs={24} sm={24} md={6} lg={24} xl={3} xxl={2}>
            <Row gutter={8} style={{ display: "flex", alignItems: "center" }}>
              <Col>
                <Image
                  alt=""
                  src={article.author_avatar}
                  preview={false}
                  style={{
                    borderRadius: "50%",
                    width: 70,
                    height: 70,
                  }}
                ></Image>
              </Col>
              {/* 文字水平 */}
              <Col xs={18} sm={18} md={0} lg={0} xl={0} xxl={0}>
                <Title level={3} style={{ fontWeight: "normal", fontSize: 14 }}>
                  {article.author_name}
                </Title>
                <Text style={{ color: "#A7A7A7", fontSize: 12 }}>
                  {article.author_desc}
                </Text>
              </Col>
              {/* 文字垂直 */}
              <Col xs={0} sm={0} md={24} lg={18} xl={24} xxl={24}>
                <Title level={3} style={{ fontWeight: "normal", fontSize: 14 }}>
                  {article.author_name}
                </Title>
                <Text style={{ color: "#A7A7A7", fontSize: 12 }}>
                  {article.author_desc}
                </Text>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={18} lg={24} xl={10} xxl={10}>
            {parsed_content.map((item: any, index: any) => {
              return (
                <div key={index}>
                  {item.type === "text" ? (
                    <Text style={{ whiteSpace: "pre-wrap" }}>{item.text}</Text>
                  ) : (
                    <Image
                      alt=""
                      src={
                        `https://todo/` +
                        item.src
                      }
                      preview={false}
                      style={{ width: "100%", height: "100%" }}
                    ></Image>
                  )}
                </div>
              );
            })}
          </Col>
        </Row>
        <Footer />
      </>
    );
  };
  // console.log(article, '123')
  return (
    <>
      <Head>
        <title>{article.title} / Agile</title>
        <meta name="description" content="Agile" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <BannerDetails />
    </>
  );
}

export default AgileLayout(Banner);
