import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import NoSSR from '@mpth/react-no-ssr';
import { Row, Col, Button, Card, Space, Divider, InputNumber, Image, Typography, Descriptions, Table } from "antd";
import { MenuOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

import AgileLayout from "../_layout";
import { Urls } from "../../lib/url";
import { BidLog, MarketArt } from "../../lib/type";
import { utils } from "ethers";
import { MetaMaskProvider } from "../../lib/mm";
import { FixBidCFS } from "../../ether/cfs";
import { useAppSelector } from "../../store/hooks";

import styles from "../../styles/market.module.css";
import { EllipsisMiddle } from "../../components/ellipsis";


const { Title, Text } = Typography;


const PriceLine = (props: any) => {
  const { edition } = props;

  if (
    edition.e_state === "seller_settle" ||
    edition.e_state === "buyer_settle"
  ) {

    let currentPrice = `${utils.formatEther(edition.e_bid_price.toString())} ETH`
    if (edition.e_state === "buyer_settle") {
      currentPrice = `${utils.formatEther(edition.e_fixed_price.toString())} ETH`
    }
    return (
      <div className={styles.PriceLine}>
        <Card
          style={{
            borderRadius: "10px",
            padding: 0,
            border: "2px solid #cccc",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            Deal Price:{" "}
            {currentPrice}
          </Title>
          {
            edition.e_bid_count === 0 ?
              <></> : <Divider />
          }
          {
            edition.e_bid_count > 0 ?
              <Title level={5} style={{ margin: 0 }}>
                Bid Count: {edition.e_bid_count}
              </Title> :
              <></>
          }
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.PriceLine}>
      <Card
        style={{
          borderRadius: "10px",
          margin: "10px 0",
          padding: 0,
          border: "2px solid #cccc",
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Fixed Price:{" "}
          {`${utils.formatEther(edition.e_fixed_price.toString())} ETH`}
        </Title>
        <Divider />
        <Title level={5} style={{ margin: 0 }}>
          Current Price:{" "}
          {`${utils.formatEther(edition.e_bid_price.toString())} ETH`}
        </Title>
        <Divider />
        <Title level={5} style={{ margin: 0 }}>
          Base Price:{" "}
          {`${utils.formatEther(edition.e_opening_bid.toString())} ETH`}
        </Title>
        <Divider />
        <Title level={5} style={{ margin: 0 }}>
          Bid Count: {edition.e_bid_count}
        </Title>
      </Card>
    </div>
  );
};

export const StateTag = (props: any) => {
  const { edition } = props;

  if (
    edition.e_state === "seller_settle" ||
    edition.e_state === "buyer_settle"
  ) {
    return (
      <p
        style={{
          color: "#ccc",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          margin: 0,
        }}
      >
        <Descriptions.Item label="Title">
          <StopOutlined style={{ fontWeight: "bold" }} />
          &nbsp;DEAL
        </Descriptions.Item>
      </p>
    );
  } else {
    return (
      <p
        style={{
          color: "#7ED321",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          margin: 0,
        }}
      >
        <Descriptions.Item label="Title">
          <CheckCircleOutlined style={{ fontWeight: "bold" }} />
          &nbsp;BIDDING
        </Descriptions.Item>
      </p>
    );
  }
};

const ButtonPrice = (props: any) => {
  const {
    e_auction_id,
    e_fixed_price,
    e_opening_bid,
    e_state,
    e_bid_price,
    notify,
  } = props;

  let firstBid = utils.formatEther(e_opening_bid.toString());
  if (e_bid_price > e_opening_bid) {
    firstBid = utils.formatEther(e_bid_price.toString());
  }

  const ether = useAppSelector((state) => state.ether);
  const [bid, setBid] = useState(firstBid);
  const [fixPrice, setFixPrice] = useState(
    utils.formatEther(e_fixed_price.toString())
  );

  const onBidChange = (value: string) => {
    setBid(value);
  };

  const onFixPriceChange = (value: string) => {
    setFixPrice(value);
  };

  const onBid = async () => {
    const p = MetaMaskProvider();
    // @ts-ignore
    const signer = p.getSigner(ether.account);
    let fixBidCFS = FixBidCFS(p, signer);
    const value = `${utils.parseEther(bid)}`;
    try {
      await fixBidCFS.bid(e_auction_id, { value });
      notify.success("Bid success", "");
    } catch (e) {
      notify.error("Bid failed", "");
    }
  };

  const onFixPrice = async () => {
    const p = MetaMaskProvider();
    // @ts-ignore
    const signer = p.getSigner(ether.account);
    let fixBidCFS = FixBidCFS(p, signer);
    const value = `${utils.parseEther(fixPrice)}`;
    try {
      await fixBidCFS.fixedWithdraw(e_auction_id, { value });
      notify.success("Buy success", "");
    } catch (e) {
      notify.error("Bid failed", "");
    }
  };

  if (
    e_state === "seller_settle" ||
    e_state === "buyer_settle" ||
    e_state === "seller_cancel" ||
    e_state === "todo"
  ) {
    return <></>;
  }

  return (
    <>
      <Col span={24} style={{ margin: "6px 0" }}>
        <Space style={{ width: "100%" }}>
          <InputNumber<string>
            style={{ width: "100%" }}
            stringMode
            value={bid}
            onChange={onBidChange}
          />
          <Text>ETH</Text>
          <Button type="primary" onClick={onBid} style={{ minWidth: 100 }}>
            Play Bid
          </Button>
        </Space>
      </Col>
      <Col span={24} style={{ margin: "6px 0" }}>
        <Space>
          <InputNumber<string>
            style={{ width: "100%" }}
            stringMode
            value={fixPrice}
            onChange={onFixPriceChange}
          />
          <Text>ETH</Text>
          <Button type="primary" onClick={onFixPrice} style={{ minWidth: 100 }}>
            Buy Now
          </Button>
        </Space>
      </Col>
    </>
  );
};

const BidCard = (props: any) => {
  const { edition } = props;

  return (
    <Row gutter={16}>
      <Col
        span={24}
        style={{
          display: "flex",
          alignContent: "center",
          margin: 0,
          fontFamily: "Montserrat",
        }}
      >
        <Title style={{ margin: 0 }}>{edition.n_title.toUpperCase()}</Title>
      </Col>
      <Col span={24} style={{ margin: "10px 0", fontSize: 15 }}>
        <StateTag edition={edition} />
      </Col>
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          marginBottom: 10
        }}
      >
        <MenuOutlined style={{ color: "#8F8F8F" }} />
        <b style={{ marginLeft: 10, fontWeight: "bolder", fontSize: 20, }}>
          Description
        </b>
      </Col>
      <Col span={24}>
        <div className={styles.desc}>
          <Card
            style={{
              borderRadius: "10px",
              border: "2px solid #cccc",
              padding: "0 16px",
            }}
          >
            <Title
              level={3}
              style={{ color: "#373737", margin: 0, padding: 0 }}
            >
              Created by {edition.n_user_name}
            </Title>
            <Text
              type="secondary"
              style={{ lineHeight: "20px", display: "block" }}
            >
              {edition.n_desc}
            </Text>
          </Card>
        </div>
      </Col>
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          marginBottom: 10,
          marginTop: 12
        }}
      >
        <MenuOutlined style={{ color: "#8F8F8F" }} />
        <b style={{ marginLeft: 10, fontWeight: "bolder", fontSize: 20, }}>
          Price
        </b>
      </Col>
      <Col span={24}>{<PriceLine {...props} edition={edition} />}</Col>
      <ButtonPrice
        notify={props.notify}
        e_auction_id={edition.e_auction_id}
        e_fixed_price={edition.e_fixed_price}
        e_opening_bid={edition.e_opening_bid}
        e_bid_price={edition.e_bid_price}
        e_state={edition.e_state}
      />
    </Row>
  );
};

const image = (art: MarketArt) => {
  if (art.n_mime_type === "video/mp4") {
    return (
      <video
        poster={`${art.n_oss_url}?x-oss-process=video/snapshot,t_7000,f_png,m_fast`}
        src={art.n_oss_url}
        controls
        controlsList="nodownload"
        preload="none"
        style={{ width: "100%", objectFit: "fill" }}
      />
    );
  } else {
    return (
      <Image
        alt={art.n_title}
        width="100%"
        src={`${art.n_oss_url}`}
        preview={{ src: art.n_oss_url }}
        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
      />
    );
  }
};

function Page(props: any) {
  const router = useRouter();
  const { token } = router.query;
  const [edition, setEdition] = useState<MarketArt | null>(null);
  const [logs, setLogs] = useState<Array<BidLog>>([]);

  useEffect(() => {
    if (!token || Array.isArray(token)) {
      return
    }

    const fetchArt = async () => {
      if (!token || Array.isArray(token)) {
        return
      }
      try {
        let e = await axios.get(Urls.bs.GetEditionByToken(token))
        if (e.status !== 200) {
          return;
        }
        let editionInfo = await e.data
        setEdition(editionInfo.art)
        setLogs(editionInfo.logs)
      } catch (e) { }
    }

    fetchArt().then()
    const id = setInterval(() => {
      fetchArt().then()
    }, 7000)
    return () => clearInterval(id)
  }, [token]);


  if (!token || !edition) {
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

  const tableCols: any = [
    {
      title: "No.",
      render: (text: any, record: any) => {
        if (record.state !== "bid") {
          return "DEAL"
        }
        return record.bid_count
      },
    },
    {
      title: "Bidding Price",
      render: (record: any) => {
        if (
          record.state === "seller_settle" ||
          record.state === "buyer_settle"
        ) {
          return <p>{`${utils.formatEther(edition.e_fixed_price.toString())} ETH`}</p>
        } else {
          return <p>{`${utils.formatEther(record.bid_price.toString())} ETH`}</p>
        }
      }
    },
    {
      title: "Bidding Time",
      render: (text: any, record: any) => {
        if (record.start_time === 0) {
          return <p>N/A</p>
        } else {
          const date = new Date(record.start_time * 1000)
          return <p>{date.toLocaleString("en-US")}</p>
        }
      },
    },
    {
      title: "Transaction ID",
      dataIndex: "ID",
      render: (text: any, record: any) => {
        if (record.ether_net === "mainnet") {
          return <EllipsisMiddle suffixCount={7} width="70%">
            {record.tx_hash}
          </EllipsisMiddle>
        } else {
          return <EllipsisMiddle suffixCount={7} width="70%">
            {record.tx_hash}
          </EllipsisMiddle>
        }
      }
    }
  ]

  return (
    <NoSSR>
      <Head>
        <title>Bid / Agile</title>
        <meta name="description" content="Bid / Agile" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Card
        bordered={false}
        style={{ paddingBottom: 164, marginTop: "14px", minHeight: "100%" }}
      >
        <Row justify="space-between" gutter={14}>
          <Col xs={24} sm={24} md={24} lg={14} xl={16} xxl={16}>
            {image(edition)}
          </Col>
          <Col xs={24} sm={24} md={24} lg={10} xl={8} xxl={8}>
            <BidCard {...props} edition={edition} />
          </Col>
        </Row>
        {
          logs.length === 0 ? null :
            <div className={styles.bidding}>
              <Card title='Bidding Records' style={{
                width: '100%', borderRadius: "10px",
                border: "2px solid #cccc",
              }}>
                <Table
                  columns={tableCols}
                  dataSource={logs}
                  rowKey="block"
                  pagination={false}
                  scroll={{ x: "100%" }}
                  style={{ marginTop: 30, overflowX: 'auto',cursor:'unset' }}
                />
              </Card>
            </div>
        }
      </Card>
    </NoSSR>
  );
}

export default AgileLayout(Page);
