import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import getConfig from "next/config";

import { Typography, Row, Col, Image, Card } from "antd";

import { Footer } from "../../components/footer";
import AgileLayout from "../_layout";

const { serverRuntimeConfig } = getConfig();
const { Title, Text } = Typography;

export async function getStaticProps({ params }: any) {
  const r = await fetch("");
  let artists = await r.json();

  const { name } = params;
  const res = await fetch(
    ``
  );
  let artworks = await res.json();

  let info = artists.find((artist: any) => artist.name === name);
  if (!info) {
    info = {
      artworks_sold: 0,
      average_sale: "",
      highest_sale: "",
      name: name,
      total_artwork_value: "",
    };
  }

  return {
    props: {
      name: name,
      info: info,
      artworks: artworks,
    },
    revalidate: serverRuntimeConfig.ssg_interval_artist_artworks,
  };
}

export async function getStaticPaths() {
  const res = await fetch("https://cryptoart.io/top_artists");
  let artists = await res.json();
  if (artists.length > serverRuntimeConfig.ssg_count_top_artists) {
    artists = artists.slice(0, serverRuntimeConfig.ssg_count_top_artists);
  }

  const paths = artists.map((artist: { name: any }) => {
    return { params: { name: artist.name } };
  });

  return {
    paths: paths,
    fallback: true,
  };
}

function Artist(props: any) {
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
  const { artworks_sold, total_artwork_value } = router.query;
  const { name, info, artworks } = props;

  let one: any = [];
  let two: any = [];
  let three: any = [];
  artworks.map((item: any, index: any) => {
    if (index % 3 === 0) {
      one.push(item);
    } else if (index % 3 === 1) {
      two.push(item);
    } else {
      three.push(item);
    }
  });

  const ArtistsTitle = () => {
    return (
      <>
        <Title
          style={{
            textTransform: "uppercase",
            margin: "6rem 0",
            fontWeight: "bolder",
            textAlign: "center",
            fontSize: "3rem",
          }}
        >
          {name}
        </Title>
        <Title
          level={3}
          style={{
            margin: "1rem 0",
            backgroundColor: "#fafbfc",
            padding: "1rem 0",
            textAlign: "center",
            fontSize: 18,
          }}
        >
          Total Artwork Value: {info.total_artwork_value}
        </Title>
        <Title
          level={3}
          style={{
            margin: "1rem 0",
            backgroundColor: "#fafbfc",
            padding: "1rem 0",
            textAlign: "center",
            fontSize: 18,
          }}
        >
          Total Artworks Sold: {info.artworks_sold}{" "}
        </Title>
      </>
    );
  };

  const ArtistImage = () => {
    return (
      <>
        {/* 一个 */}
        <Row
          gutter={[10, 10]}
          style={{
            fontWeight: "bolder",
            padding: "0 1rem",
            fontFamily: "Montserrat",
          }}
        >
          {artworks.map((item: any, index: any) => {
            return (
              <Col
                key={index}
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
            fontFamily: "Montserrat",
          }}
        >
          {artworks.map((item: any, index: any) => {
            return (
              <Col key={index} xs={0}
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
          })}
        </Row>
        {/* 三个 */}
        <Row
          gutter={[18, 18]}
          style={{
            fontWeight: "bolder",
            padding: "0 10px",
            fontFamily: "Montserrat",
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

  const SmallTitle = ({ item }: any) => {
    return (
      <>
        <Title level={2} style={{ margin: "0 1rem", fontSize: 24 }}>
          {item.name}
        </Title>
        <Row
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: "0 1.5rem",
          }}
        >
          <Col>
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
              <Col
                style={{
                  color: "rgba(127, 127, 127, 0.29)",
                  marginRight: "1rem",
                }}
              >
                Artist
              </Col>
              <Col>{item.artist}</Col>
            </Row>
            {item.collector ? (
              <Row style={{ display: "flex", justifyContent: "space-between" }}>
                <Col
                  style={{
                    color: "rgba(127, 127, 127, 0.29)",
                    marginRight: "1rem",
                  }}
                >
                  Collector
                </Col>
                <Col>{item.collector}</Col>
              </Row>
            ) : null}
            {/* FIXME @anyifeng TypeError: Cannot read property 'toFixed' of null */}
            {item.usd_price && item.eth_price ? (
              <Row style={{ display: "flex", justifyContent: "end" }}>
                {item.usd_price.toFixed(2) === null ||
                item.eth_price.toFixed(2) === null ? (
                  <Col>
                    ${item.usd_price}[{item.eth_price}ETH]
                  </Col>
                ) : (
                  <Col>
                    ${item.usd_price.toFixed(2)}[{item.eth_price.toFixed(2)}ETH]
                  </Col>
                )}
              </Row>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </>
    );
  };

  const SmallImage = ({ item }: any) => {
    return (
      <Col style={{ margin: "10px 0", backgroundColor: "#FAFBFC" }}>
        {item.mimetype === "video" ? (
          <video
            poster={item.thumbnail}
            src={item.image}
            controls
            preload="none"
            style={{ width: "100%", height: "70%", margin: "0" }}
          ></video>
        ) : (
          <Image src={item.thumbnail} preview={false} alt=""></Image>
        )}
        <SmallTitle item={item} />
      </Col>
    );
  };

  return (
    <div>
      <Head>
        <title>{name} / Agile</title>
        <meta name="description" content="Agile" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div style={{ fontFamily: "Montserrat" }}>
        <ArtistsTitle />
        <ArtistImage />
        <Footer />
      </div>
    </div>
  );
}

export default AgileLayout(Artist);
