import React from "react";
import { Row, Col, Image } from "antd";

import AgileLayout from "../_layout";
import { Footer } from "../../components/footer";

function About(props: any) {
  const contentCN =
    "Agile";
  const contentEN =
    `Agile`
  const imgs = [
    "https://img1.utuku.imgcdc.com/645x0/ent/20220809/07379453-20f4-463f-9c65-ca534867ee63.jpg"
  ];

  const BigContent = () => {
    return (
      <>
        <h3 className="VCTitle">VC</h3>
        <div
          className="imgs"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {imgs.map((item: any, index: any) => {
            return (
              <Image
                preview={false}
                alt=""
                key={index}
                src={item}
                style={{ width: 225, height: "100%", margin: "20px 0" }}
              />
            );
          })}
        </div>
        <div className="empty"></div>
        <h3>About</h3>
        <div className="typeface">
          <p className="Chinese">{contentCN}</p>
          <p className="English">{contentEN}</p>
        </div>
        <style jsx>{`
          h3 {
            display: flex;
            font-weight: bolder;
            flex-direction: row;
            font-size: 48px;
            color: #0f0f0f;
            margin-bottom: 58px;
            width: 100%;
            justify-content: flex-end;
            align-items: flex-end;
            font-family: Montserrat;
          }

          .empty {
            height: 100px;
          }
          .typeface {
            line-height: 30px;
          }
          .Chinese {
            font-family: PingFangTC-Regular;
            font-size: 24px;
            color: #0f0f0f;
            text-align: justify;
            margin-bottom: 28px;
            line-height: 34px;
          }
          .English {
            font-family: "Montserrat";
            font-size: 24px;
            color: #EBEBEB;
            text-align: justify;
            line-height: 30px;
          }
        `}</style>
      </>
    );
  };
  const SmallContent = () => {
    return (
      <>
        <h3 className="VCTitle">VC</h3>
        <div className="imgs">
          {imgs.map((item: any, index: any) => {
            return (
              <Image
                key={index}
                alt=""
                src={item}
                style={{ height: "auto", margin: "20px 0", width: 180 }}
              />
            );
          })}
        </div>
        <div className="empty"></div>
        <h3>About</h3>
        <div className="typeface">
          <p className="Chinese">{contentCN}</p>
          <p className="English">{contentEN}</p>
        </div>
        <style jsx>{`
          h3 {
            display: flex;
            font-weight: bolder;
            flex-direction: row;
            font-size: 48px;
            color: #0f0f0f;
            margin-bottom: 58px;
            width: 100%;
            justify-content: flex-end;
            align-items: flex-end;
            font-family: Montserrat;
          }
          .imgs {
            display: flex;
            flex-wrap: wrap;
            align-item: center;
            justify-content: space-between;
          }

          .empty {
            height: 100px;
          }
          .typeface {
            line-height: 30px;
          }
          .Chinese {
            font-family: PingFangTC-Regular;
            font-size: 24px;
            color: #0f0f0f;
            text-align: justify;
            margin-bottom: 28px;
          }
          .English {
            font-family: Helvetica;
            font-size: 24px;
            color: rgba(15, 15, 15, 0.28);
            text-align: justify;
          }
        `}</style>
      </>
    );
  };
  return (
    <>
      <Row>
        <Col
          xs={24}
          sm={24}
          md={0}
          lg={0}
          xl={0}
          xxl={0}
          style={{ padding: "4%" }}
        >
          <SmallContent />
        </Col>
        <Col
          xs={0}
          sm={0}
          md={24}
          lg={24}
          xl={0}
          xxl={0}
          style={{ padding: "8%" }}
        >
          <BigContent />
        </Col>
        <Col
          xs={0}
          sm={0}
          md={0}
          lg={0}
          xl={24}
          xxl={24}
          style={{ padding: "8%" }}
        >
          <BigContent />
        </Col>
      </Row>
      <Footer style={{ width: "100%" }} />
    </>
  );
}

export default AgileLayout(About);
