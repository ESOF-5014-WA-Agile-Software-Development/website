import React, {useState} from 'react';
import {Card, Table, Button} from 'antd';
import {useEnergy} from '@/lib/data';
import AgileFooter from "@/components/footer";
import Head from "next/head";

export default function Trading() {
    const {marketData, setMarketData} = useEnergy();

    const columns = [
        {title: 'Seller', dataIndex: 'seller', key: 'seller'},
        {title: 'Energy (kWh)', dataIndex: 'amount', key: 'amount'},
        {title: 'Price (USD/kWh)', dataIndex: 'price', key: 'price'},
        {
            title: 'Action', key: 'action', render: () => (
                <>
                    <Button type="primary" onClick={handleSell}>Sell</Button>
                    <Button type="primary" onClick={handleBuy}>Buy</Button>
                </>
            )
        },
    ];

    const [sellAmount] = useState(0);
    const [sellPrice] = useState(0);

    const handleSell = () => {
        const newEntry = {
            key: (marketData.length + 1).toString(),
            seller: 'You',
            amount: `${sellAmount} kWh`,
            price: sellPrice,
        };
        setMarketData([...marketData, newEntry]);
    };

    const handleBuy = () => {

    };

    return (
        <>
            <Head>
                <title>Home / Agile</title>
                <meta name="description" content="Home"/>
            </Head>
            <div style={{minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '24px'}}>
                <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '24px'}}>Energy Trading</h1>

                <Card title="Market Listings" bordered>
                    <Table dataSource={marketData} columns={columns} pagination={false}/>
                </Card>

                {/*<Card title="Sell Energy" bordered style={{ marginTop: '24px' }}>*/}
                {/*    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>*/}
                {/*        <InputNumber min={1} placeholder="Amount (kWh)" onChange={setSellAmount} />*/}
                {/*        <InputNumber min={0.1} step={0.1} placeholder="Price (USD/kWh)" onChange={setSellPrice} />*/}
                {/*        <Button type="primary" onClick={handleSell}>Sell</Button>*/}
                {/*    </div>*/}
                {/*</Card>*/}
            </div>
            <AgileFooter/>
        </>
    );
}
