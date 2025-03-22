import React from "react";

import dynamic from "next/dynamic";

import {Row, Col, Image} from "antd";

import AgileLayout from "@/components/layout";
import AgileFooter from "@/components/footer";

function About() {
    const contentEN = `
  CoHome is a collaborative energy-sharing platform designed to connect multiple households in a smart grid ecosystem. It empowers communities to optimize energy usage, share surplus resources, and collectively reduce carbon footprints. Through real-time monitoring, fair cost allocation, and a user-friendly dashboard, CoHome encourages smarter living, sustainability, and cooperation among neighbors.
`;

    const images = [
        "/images/CoHome.png",
        "/images/CoHome-2.jpg",
        "/images/CoHome-3.jpg",
    ];

    const BigContent = () => (
        <>
            <h3 className="title">About CoHome</h3>
            <div
                className="images"
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {images.map((item, index) => (
                    <Image
                        preview={false}
                        alt={`CoHome Image ${index}`}
                        key={index}
                        src={item}
                        style={{width: 300, height: "auto", margin: "20px 0"}}
                    />
                ))}
            </div>
            <div className="empty"/>
            <div className="typeface">
                <p className="English">{contentEN}</p>
            </div>
            <style jsx>{`
                .title {
                    display: flex;
                    font-weight: bold;
                    font-size: 48px;
                    color: #0f0f0f;
                    margin-bottom: 48px;
                    justify-content: flex-start;
                }

                .empty {
                    height: 80px;
                }

                .typeface {
                    line-height: 32px;
                }

                .English {
                    font-size: 20px;
                    color: #333;
                    text-align: justify;
                }
            `}</style>
        </>
    );

    const SmallContent = () => (
        <>
            <h3 className="title">About CoHome</h3>
            <div className="images">
                {images.map((item, index) => (
                    <Image
                        key={index}
                        alt={`CoHome Image ${index}`}
                        src={item}
                        style={{height: "auto", margin: "20px 0", width: "100%"}}
                    />
                ))}
            </div>
            <div className="empty"/>
            <div className="typeface">
                <p className="English">{contentEN}</p>
            </div>
            <style jsx>{`
                .title {
                    display: flex;
                    font-weight: bold;
                    font-size: 36px;
                    color: #0f0f0f;
                    margin-bottom: 32px;
                    justify-content: flex-start;
                }

                .images {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .empty {
                    height: 60px;
                }

                .typeface {
                    line-height: 30px;
                }

                .English {
                    font-size: 18px;
                    color: #333;
                    text-align: justify;
                }
            `}</style>
        </>
    );

    return (
        <>
            <Row>
                <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} style={{padding: "6%"}}>
                    <SmallContent/>
                </Col>

                <Col xs={0} sm={0} md={24} lg={24} xl={0} xxl={0} style={{padding: "8%"}}>
                    <BigContent/>
                </Col>

                <Col xs={0} sm={0} md={0} lg={0} xl={24} xxl={24} style={{padding: "8%"}}>
                    <BigContent/>
                </Col>
            </Row>
            <AgileFooter/>
        </>
    );
}

export default dynamic(() => Promise.resolve(AgileLayout(About)), {
    ssr: false,
});
