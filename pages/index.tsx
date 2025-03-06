import React, {useState} from "react"
import Head from "next/head"
import {useRouter} from "next/router"
import {Row, Col, Image} from "antd"
import {Card, Button, Table, Progress} from 'antd';

import AgileLayout from "./_layout"
import {banners} from "../data/home/banner"
import {Footer} from "../components/footer"
import Link from "next/link";
import { useEnergy } from  '../data/dataService';


export async function getStaticProps() {
    return {
        props: {
            banners: banners
        },
    }
}


const Content = React.memo(function _component() {

    const { generationData, consumptionData, marketData } = useEnergy();

    const consumptionColumns = [
        { title: 'Appliance', dataIndex: 'appliance', key: 'appliance' },
        { title: 'Daily Consumption', dataIndex: 'daily', key: 'daily' },
        { title: 'Weekly Consumption', dataIndex: 'weekly', key: 'weekly' },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Smart Home Energy Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Electricity Consumption */}
                <Card title="Electricity Consumption" bordered extra={<Link href="/consumption"><Button type="link">View More</Button></Link>}>
                    <Table dataSource={consumptionData} columns={consumptionColumns} pagination={false} />
                </Card>

                {/* Energy Storage */}
                <Card title="Energy Storage" bordered extra={<Link href="/generation"><Button type="link">View More</Button></Link>}>
                    <p style={{ color: '#595959', marginBottom: '8px' }}>Remaining Energy: 50 kWh</p>
                    <h3 style={{ marginTop: '16px' }}>Recent Generation</h3>
                    <ul>
                        {generationData.slice(0, 3).map((item) => (
                            <li key={item.key} style={{ color: '#595959' }}>{item.source}: {item.amount}</li>
                        ))}
                    </ul>
                </Card>

                {/* Trading System */}
                <Card title="Trading System" bordered extra={<Link href="/trading"><Button type="link">View More</Button></Link>}>
                    <p style={{ color: '#595959' }}>Buy or Sell excess energy</p>
                    <Table dataSource={marketData} columns={[
                        { title: 'Seller', dataIndex: 'seller', key: 'seller' },
                        { title: 'Amount (kWh)', dataIndex: 'amount', key: 'amount' },
                        { title: 'Price (USD/kWh)', dataIndex: 'price', key: 'price' }
                    ]} pagination={false} />
                </Card>
            </div>
        </div>
    )
})

const ImageLeft = ({banner}: any) => {
    const router = useRouter()

    return (
        <Row style={{cursor: "pointer"}} onClick={() => router.push(`/banners/${banner.id}`)}>
            <Col xs={24} sm={24} md={16} lg={16} xl={0} xxl={0}>
                <Image src={banner.thumbnail} preview={false} alt={banner.title} style={{display: "inline"}}/>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={0} xxl={0}
                 style={{
                     background: banner.bg_color,
                     color: banner.font_color,
                     padding: "1rem",
                 }}
            >
                <h2 style={{
                    color: banner.font_color,
                    fontWeight: 900,
                    fontSize: "2.5rem",
                    minHeight: 50,
                    whiteSpace: "pre-line",
                    fontFamily: "Montserrat",
                }}
                >
                    {banner.title}
                </h2>
                <h4 style={{
                    color: banner.font_color,
                    fontWeight: 400,
                    fontFamily: "PingFangTC-Regular",
                }}
                >
                    {banner.sub_title}
                </h4>
            </Col>

            <Col xs={0} sm={0} md={0} lg={0} xl={16} xxl={16}>
                <Image src={banner.thumbnail} preview={false} alt={banner.title} style={{display: "inline"}}/>
            </Col>
            <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={8}
                 style={{
                     background: banner.bg_color, color: banner.font_color, padding: "3rem  2rem"
                 }}
            >
                <h2
                    style={{
                        color: banner.font_color,
                        fontWeight: 900,
                        fontSize: "3.5rem",
                        marginTop: "3rem",
                        whiteSpace: "pre-line",
                        fontFamily: "Montserrat",
                    }}
                >
                    {banner.title}
                </h2>
                <h4
                    style={{
                        color: banner.font_color,
                        fontWeight: 400,
                        margin: "2rem 0",
                        fontSize: "1.5rem",
                        whiteSpace: "pre-line",
                        fontFamily: "PingFangTC-Regular",
                    }}
                >
                    {banner.sub_title}
                </h4>
            </Col>
            <style jsx>{`h2 {
                margin: 0;
                white-space: pre-line;
            }`}</style>
        </Row>
    )
}

const ImageRight = ({banner}: any) => {
    const router = useRouter()

    return (
        <Row style={{cursor: "pointer"}} onClick={() => router.push(`/banners/${banner.id}`)}>
            <Col xs={0} sm={0} md={8} lg={8} xl={0} xxl={0}
                 style={{
                     background: banner.bg_color,
                     padding: "1rem",
                 }}
            >
                <h2
                    style={{
                        color: banner.font_color,
                        fontWeight: 900,
                        fontSize: "2.5rem",
                        minHeight: 50,
                        whiteSpace: "pre-line",
                        fontFamily: "Montserrat",
                    }}
                >
                    {banner.title}
                </h2>
                <h4
                    style={{
                        color: banner.font_color,
                        fontWeight: 400,
                        whiteSpace: "pre-line",
                        fontFamily: "PingFangTC-Regular",
                    }}
                >
                    {banner.sub_title}
                </h4>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={0} xxl={0}>
                <Image
                    src={banner.thumbnail}
                    preview={false}
                    alt={banner.title}
                    style={{display: "inline", height: "100%"}}
                />
            </Col>
            <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}
                 style={{
                     background: banner.bg_color,
                     padding: "1rem",
                 }}
            >
                <h2
                    style={{
                        color: banner.font_color,
                        fontWeight: 900,
                        fontSize: "2.5rem",
                        minHeight: 50,
                        whiteSpace: "pre-line",
                        fontFamily: "Montserrat",
                    }}
                >
                    {banner.title}
                </h2>
                <h4
                    style={{
                        color: banner.font_color,
                        fontWeight: 400,
                        whiteSpace: "pre-line",
                        fontFamily: "PingFangTC-Regular",
                    }}
                >
                    {banner.sub_title}
                </h4>
            </Col>
            <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={8}
                 style={{
                     background: banner.bg_color,
                     padding: "1.5rem 2rem ",
                 }}
            >
                <h2
                    style={{
                        color: banner.font_color,
                        fontWeight: 900,
                        fontSize: "3.5rem",
                        marginTop: "3rem",
                        whiteSpace: "pre-line",
                        fontFamily: "Montserrat",
                    }}
                >
                    {banner.title}
                </h2>
                <h4
                    style={{
                        color: banner.font_color,
                        fontWeight: 400,
                        margin: "2rem 0",
                        fontSize: "1.5rem",
                        whiteSpace: "pre-line",
                        fontFamily: "PingFangTC-Regular",
                    }}
                >
                    {banner.sub_title}
                </h4>
            </Col>
            <Col xs={0} sm={0} md={0} lg={0} xl={16} xxl={16}>
                <Image
                    src={banner.thumbnail}
                    preview={false}
                    alt={banner.title}
                    style={{display: "inline", height: "100%"}}
                />
            </Col>
        </Row>
    )
}

const Banners = React.memo(function _component({banners}: any) {
    return <>
        {
            banners.map((banner: any, index: any) => {
                return index % 2 === 0 ? <ImageLeft key={index} banner={banner}/> :
                    <ImageRight key={index} banner={banner}/>
            })
        }
    </>
})


function Home(props: any) {
    const {banners} = props

    return (
        <>
            <Head>
                <title>Home / Agile</title>
                <meta name="description" content="Home"/>
                <link rel="icon" href="/favicon.png"/>
            </Head>
            <Banners banners={banners}/>
            <Content/>
            <Footer/>
        </>
    )
}

export default AgileLayout(Home)
