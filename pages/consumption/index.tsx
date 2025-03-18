import React from 'react';
import {Card, Table} from 'antd';
import {useEnergy} from '@/lib/data';
import Head from "next/head";
import AgileFooter from "@/components/footer";

export default function Consumption() {
    const {consumptionData} = useEnergy();

    const columns = [
        {title: 'Appliance', dataIndex: 'appliance', key: 'appliance'},
        {title: 'Daily Consumption', dataIndex: 'daily', key: 'daily'},
        {title: 'Weekly Consumption', dataIndex: 'weekly', key: 'weekly'},
    ];

    return (
        <>
            <Head>
                <title>Home / Agile</title>
                <meta name="description" content="Home"/>
                <link rel="icon" href="/favicon.png"/>
            </Head>
            <div style={{minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '24px'}}>
                <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '24px'}}>Energy Consumption</h1>

                <Card title="Power Consumption Details" bordered>
                    <Table dataSource={consumptionData} columns={columns} pagination={false}/>
                </Card>
            </div>
            <AgileFooter/>
        </>
    );
}
