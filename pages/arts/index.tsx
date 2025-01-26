import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Image,
  Typography,
  Row,
  Col,
  Card,
  Pagination,
  Descriptions,
} from "antd";
import { StopOutlined } from "@ant-design/icons";

import AgileLayout from "../_layout";
import { Footer } from "../../components/footer";
import { artInfoList } from "../../data/market/arts";
import styles from "../../styles/arts.module.css";

const { Title, Text } = Typography;

export async function getStaticProps() {
  return {
    props: { artInfoList },
  };
}

const SmallImage = ({ item }: any) => {
  return (
    <div className={styles.market}>
      <Card
        style={{ padding: "0", backgroundColor: "#FAFBFC" }}
        bordered={false}
      >
        <Title
          style={{
            fontSize: 24,
            margin: "0 0 0 10px",
            fontFamily: "Montserrat",
          }}
        >
          {item.name}
        </Title>
        <Row justify="space-between">
          <Col
            span={12}
            style={{
              lineHeight: "34px",
              fontWeight: 500,
              fontSize: 14,
              fontFamily: "Montserrat",
            }}
          >
            <Descriptions.Item label="Title">
              {item.creator.name}
            </Descriptions.Item>
          </Col>
          <Col
            span={12}
            style={{
              lineHeight: "34px",
              fontWeight: 500,
              display: "flex",
              justifyContent: "end",
              fontSize: 18,
            }}
          >
            <p
              style={{
                color: "#CCC",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                margin: 0,
                fontSize: 14,
              }}
            >
              <Descriptions.Item label="Title">
                <StopOutlined style={{ fontWeight: "bold" }} />
                &nbsp;DEAL
              </Descriptions.Item>
            </p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const ArtistImage = ({ arts }: any) => {
  return (
    <>
      <Row
        gutter={[18, 18]}
        style={{ fontWeight: "bolder", padding: "0 10px" }}
      >
        {arts.map((item: any, index: any) => {
          if (index % 3 === 0) {
            return (
              <Col
                xs={8}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                key={index}
                // style={{ backgroundColor: '#FAFBFC' }}
              >
                <Image src={item.image} preview={false}></Image>
                <SmallImage item={item} />{" "}
              </Col>
            );
          } else if (index % 3 === 1) {
            return (
              <Col
                xs={8}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                key={index}
                // style={{ backgroundColor: '#FAFBFC' }}
              >
                <Image src={item.image} preview={false}></Image>
                <SmallImage item={item} />{" "}
              </Col>
            );
          } else {
            return (
              <Col
                xs={8}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                key={index}
                // style={{ backgroundColor: '#FAFBFC' }}
              >
                <Image src={item.image} preview={false}></Image>
                <SmallImage item={item} />
              </Col>
            );
          }
        })}
      </Row>
    </>
  );
};

function Arts(props: any) {
  const { artInfoList } = props;
  let [pagenum, setPagenum] = useState(1);
  let [pageSize, setPageSize] = useState(8);
  let artList = artInfoList.arts.slice(
    (pagenum - 1) * pageSize,
    (pagenum - 1) * pageSize + pageSize
  );

  const PageChange = (page: any) => {
    setPagenum(page);
  };
  const onShowSizeChange = (page: any, Size: any) => {
    setPageSize(Size);
  };

  return (
    <div className={styles.arts}>
      <ArtistImage arts={artList} />
      <Pagination
        current={pagenum}
        total={artInfoList.total}
        pageSize={pageSize}
        onChange={PageChange}
        onShowSizeChange={onShowSizeChange}
        pageSizeOptions={["8", "10", "16"]}
      />
      <Footer />
    </div>
  );
}
export default AgileLayout(Arts);
