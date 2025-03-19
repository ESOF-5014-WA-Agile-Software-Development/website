import React from "react"

import Head from "next/head"
import dynamic from "next/dynamic";

import AgileLayout from "@/components/layout"
import AgileFooter from "@/components/footer"
import {Card, Button, Table} from 'antd';
import {useEnergy} from '@/lib/data';
import Link from "next/link";


function Home() {


    const {generationData, consumptionData, marketData} = useEnergy();

    const consumptionColumns = [
        {title: 'Appliance', dataIndex: 'appliance', key: 'appliance'},
        {title: 'Daily Consumption', dataIndex: 'daily', key: 'daily'},
        {title: 'Weekly Consumption', dataIndex: 'weekly', key: 'weekly'},
    ];

    return (
        <>
            <Head>
                <title>Home / Agile</title>
                <meta name="description" content="Home"/>
            </Head>
            <div style={{minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '24px'}}>
                <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '24px'}}>Smart Home Energy
                    Dashboard</h1>

                <div
                    style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                    {/* Electricity Consumption */}
                    <Card title="Electricity Consumption" variant="outlined"
                          extra={<Link href="/consumption"><Button type="link">View More</Button></Link>}>
                        <Table dataSource={consumptionData} columns={consumptionColumns} pagination={false}/>
                    </Card>

                    {/* Energy Storage */}
                    <Card title="Energy Storage" variant="outlined"
                          extra={<Link href="/generation"><Button type="link">View More</Button></Link>}>
                        <p style={{color: '#595959', marginBottom: '8px'}}>Remaining Energy: 50 kWh</p>
                        <h3 style={{marginTop: '16px'}}>Recent Generation</h3>
                        <ul>
                            {generationData.slice(0, 3).map((item) => (
                                <li key={item.key} style={{color: '#595959'}}>{item.source}: {item.amount}</li>
                            ))}
                        </ul>
                    </Card>

                    {/* Trading System */}
                    <Card title="Trading System" variant="outlined"
                          extra={<Link href="/trading"><Button type="link">View More</Button></Link>}>
                        <p style={{color: '#595959'}}>Buy or Sell excess energy</p>
                        <Table dataSource={marketData} columns={[
                            {title: 'Seller', dataIndex: 'seller', key: 'seller'},
                            {title: 'Amount (kWh)', dataIndex: 'amount', key: 'amount'},
                            {title: 'Price (USD/kWh)', dataIndex: 'price', key: 'price'}
                        ]} pagination={false}/>
                    </Card>
                </div>
            </div>
            <AgileFooter/>
        </>
    )
}

export default dynamic(() => Promise.resolve(AgileLayout(Home)), {
    ssr: false,
});
