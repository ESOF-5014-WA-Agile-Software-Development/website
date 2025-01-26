import React from "react";
import Head from "next/head";

import { Row, Col } from "antd";

import AgileLayout from "../_layout";
import { Footer } from "../../components/footer";
import styles from '../../styles/news.module.css'


export async function getStaticProps() {
  return {
    props: {},
  };
}

const NewsContent = React.memo(function _componment(_props: any) {
  return (
    <Row>
      <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} className={styles.news} >
          todo
      </Col>
      <Col xs={0} sm={0} md={24} lg={24} xl={0} xxl={0}>
          todo
      </Col>
      <Col xs={0} sm={0} md={0} lg={0} xl={24} xxl={24}>
          todo
      </Col>
    </Row>
  );
})

function News(props: any) {
  return (
    <>
      <Head>
        <title>news / Agile</title>
        <meta name="description" content="Agile" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <NewsContent {...props} />
      <Footer />
    </>
  );
}
export default AgileLayout(News);
