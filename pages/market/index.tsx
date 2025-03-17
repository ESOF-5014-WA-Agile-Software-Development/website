import {ethers} from "ethers";

import React, {useEffect, useState, useCallback} from "react";

import Head from "next/head";
import getConfig from "next/config";

import {Row, Col, Card, Button, Form, Input, Space, Drawer, InputNumber, Image, Typography, Table, Spin} from "antd";
import type {TableProps} from 'antd';
import {PlusOutlined, LoadingOutlined} from "@ant-design/icons";

import AgileLayout from "@/components/layout";
import AgileFooter from "@/components/footer";
import {useWeb3} from "@/context/Web3Provider";
import {useAppSelector, useContract} from "@/store/hooks";
import {EllipsisMiddle} from "@/components/ellipsis";
import {Offer} from "@/lib/type";

const {publicRuntimeConfig} = getConfig();

const CAD_TO_ETH_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=cad";


function NewOfferDrawer(props: any) {
    const {open, show, notify, refreshAfterCreate} = props;

    const ether = useAppSelector((state) => state.ether);
    const {provider} = useWeb3();
    const contract = useContract(provider);

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const [rate, setRate] = useState(0);

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch(CAD_TO_ETH_API);
                const data = JSON.parse(await response.text()) as { ethereum: { cad: number } };
                setRate(data.ethereum.cad);
            } catch (error) {
                console.error("get CAD/ETH rate failed:", error);
            }
        };

        fetchExchangeRate().then();
    }, []);

    const onClose = () => {
        show(false);
    };

    const onValuesChange = (changedValues: any) => {
        if (changedValues && changedValues.price) {
            const ethValue = (parseFloat(changedValues.price) / rate).toFixed(18);
            const ethValueInWei = ethers.utils.parseUnits(ethValue, 18);
            form.setFieldsValue({pricePerUnit: ethValueInWei});
        }
    }

    const onFinish = async (values: any) => {
        if (!contract) {
            notify.error("Please connect MetaMask!");
            return;
        }

        const {electricity, pricePerUnit} = values;
        setSubmitting(true);
        try {
            const tx = await contract.createOffer(ethers.utils.parseUnits(electricity.toString(), 18), pricePerUnit);
            await tx.wait();
            form.resetFields();
            show(false);
            notify.success("Create Offer success!", "");
            refreshAfterCreate();
        } catch (err) {
            notify.error("Create Offer error!", err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (open) {
            form.setFieldsValue({address: ether.account});
        }
    }, [ether, form, open]);

    return (
        <Drawer title="New Offer" onClose={onClose} open={open} width={350}>
            <Form layout="vertical" form={form} onFinish={onFinish} requiredMark
                  onValuesChange={onValuesChange}
                  initialValues={{owner: ether.account, electricity: 0, price: 0, pricePerUnit: 0}}>
                <Form.Item name="electricity" label="Electricity"
                           rules={[{required: true, message: "Please enter electricity"}]}>
                    <InputNumber min={0} addonAfter="kWh" style={{width: "100%"}}/>
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{required: true, message: "Please enter price"}]}>
                    <InputNumber min={0} addonAfter="$/kWh" style={{width: "100%"}}/>
                </Form.Item>
                <Form.Item label={`Price (${rate} $ = 1 ETH)`} dependencies={['price']}>
                    {({getFieldValue}) => {
                        const price = getFieldValue("price") || "0";
                        const ethValue = (parseFloat(price) / rate).toFixed(18);
                        const ethValueInWei = ethers.utils.parseUnits(ethValue, 18);
                        return <Input value={ethValueInWei.toString()} suffix="wei" disabled/>;
                    }}
                </Form.Item>
                <Form.Item name="pricePerUnit" hidden>
                    <Input suffix="wei" disabled/>
                </Form.Item>
                <Form.Item label="Total Price" dependencies={['electricity', 'price']}>
                    {({getFieldValue}) => {
                        const electricity = getFieldValue('electricity') || 0;
                        const price = getFieldValue('price') || 0;
                        const totalPrice = electricity * price;
                        return <Input value={totalPrice} suffix="$" disabled/>;
                    }}
                </Form.Item>
                <Form.Item label="Total Price" dependencies={['electricity', 'price']}>
                    {({getFieldValue}) => {
                        const electricity = getFieldValue('electricity') || 0;
                        const price = getFieldValue('price') || 0;
                        const totalPrice = electricity * price;
                        const ethValue = (totalPrice / rate).toFixed(18);
                        const ethValueInWei = ethers.utils.parseUnits(ethValue, 18);
                        return <Input value={ethValueInWei.toString()} suffix="wei" disabled/>;
                    }}
                </Form.Item>
                <Form.Item name="owner" label="MetaMask"
                           rules={[{required: true, message: "please connect to MetaMask"}]}>
                    <Row align="middle">
                        <Col span={3}>
                            <Image src="/images/metamask.png" height={30} width={30} alt=""/>
                        </Col>
                        <Col span={21}>
                            <Typography.Text type="secondary">
                                <EllipsisMiddle suffixCount={12} width="77%">{ether.account}</EllipsisMiddle>
                            </Typography.Text>
                        </Col>
                    </Row>
                </Form.Item>
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit" disabled={submitting}>Submit</Button>
                </Space>
            </Form>
        </Drawer>
    );
}

function PurchaseDrawer(props: any) {
    const {open, show, notify, refreshAfterPurchase, toPurchaseOffer} = props;

    const ether = useAppSelector((state) => state.ether);
    const { provider } = useWeb3();
    const contract = useContract(provider);

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const [rate, setRate] = useState(0);

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch(CAD_TO_ETH_API);
                const data = JSON.parse(await response.text()) as { ethereum: { cad: number } };
                setRate(data.ethereum.cad);
            } catch (error) {
                console.error("get CAD/ETH rate failed:", error);
            }
        };

        fetchExchangeRate().then();
    }, []);

    const onClose = () => {
        show(false);
    };

    const onFinish = async (values: any) => {
        if (!contract) {
            notify.error("Please connect MetaMask!");
            return;
        }

        const {electricity, id} = values;

        setSubmitting(true);
        try {
            const tx = await contract.purchase(id, ethers.utils.parseUnits(electricity.toString(), 18));
            await tx.wait();
            form.resetFields();
            show(false);
            notify.success("Purchase Offer success!", "");
            refreshAfterPurchase();
        } catch (err) {
            console.log(err);
            notify.error("Purchase Offer error!", err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (open) {
            form.setFieldsValue({address: ether.account});
        }
    }, [ether, form, open]);

    useEffect(() => {
        form.setFieldsValue({
            pricePerUnit: toPurchaseOffer?.pricePerUnit,
            id: toPurchaseOffer?.id,
        });
    }, [toPurchaseOffer, form]);

    if(!toPurchaseOffer) {
        return <Drawer title="New Offer" onClose={onClose} open={open} width={350}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </Drawer>;
    }

    return (
        <Drawer title="Purchase" onClose={onClose} open={open} width={350}>
            <Form layout="vertical" form={form} onFinish={onFinish} requiredMark
                  initialValues={{
                      owner: ether.account,
                      id: toPurchaseOffer.id,
                      pricePerUnit: toPurchaseOffer.pricePerUnit,
                      electricity: 0,
            }}>
                <Form.Item name="id" label="id" hidden>
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="electricity" label="Electricity"
                           rules={[{required: true, message: "Please enter electricity"}]}>
                    <InputNumber min={0} addonAfter="kWh" style={{width: "100%"}}/>
                </Form.Item>
                <Form.Item name="pricePerUnit" label="Price">
                    <Input suffix="ETH" disabled/>
                </Form.Item>
                <Form.Item label="Total Price" dependencies={['electricity']}>
                    {({getFieldValue}) => {
                        const electricity = getFieldValue('electricity') || 0;
                        const totalPrice = electricity * toPurchaseOffer.pricePerUnit;
                        const totalPriceInCAD = totalPrice * rate;
                        return <Input value={totalPriceInCAD} suffix="$" disabled/>;
                    }}
                </Form.Item>
                <Form.Item label="Total Price" dependencies={['electricity']}>
                    {({getFieldValue}) => {
                        const electricity = getFieldValue('electricity') || 0;
                        const totalPrice = electricity * toPurchaseOffer.pricePerUnit;
                        return <Input value={totalPrice.toString()} suffix="ETH" disabled/>;
                    }}
                </Form.Item>
                <Form.Item name="owner" label="MetaMask"
                           rules={[{required: true, message: "please connect to MetaMask"}]}>
                    <Row align="middle">
                        <Col span={3}>
                            <Image src="/images/metamask.png" height={30} width={30} alt=""/>
                        </Col>
                        <Col span={21}>
                            <Typography.Text type="secondary">
                                <EllipsisMiddle suffixCount={12} width="77%">{ether.account}</EllipsisMiddle>
                            </Typography.Text>
                        </Col>
                    </Row>
                </Form.Item>
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit" disabled={submitting}>Submit</Button>
                </Space>
            </Form>
        </Drawer>
    );
}

function Page(props: any) {
    const title = "Market / CoHome";
    const description = "CoHome Market";

    const {notify} = props;
    const {provider} = useWeb3();
    const contract = useContract(provider);
    const [offerDrawerVisible, setOfferDrawerVisible] = useState(false);

    const [offers, setOffers] = useState<Offer[]>([]);

    const refreshAfterNewOffer = async () => {
        if (contract) {
            await fetchOffers(contract);
        }
    };

    const fetchOffers = useCallback(async (c: ethers.Contract) => {
        try {
            const offerCounter = await c.offerCounter();
            const offerList = [];

            for (let i = 1; i <= offerCounter; i++) {
                const offer = await c.offers(i);
                offerList.push({
                    id: i,
                    key: i,
                    seller: offer[0],
                    amount: ethers.utils.formatUnits(offer[1], 18),
                    pricePerUnit: ethers.utils.formatUnits(offer[2], 18),
                    isAvailable: offer[3],
                });
            }
            console.log(offerList);
            setOffers(offerList);
        } catch (error) {
            notify.error("Error fetching offers:", error);
        }
        }, [notify]
    );

    useEffect(() => {
        if (contract) {
            fetchOffers(contract).then();
        }
    }, [contract, fetchOffers]);

    const [purchaseDrawerVisible, setPurchaseDrawerVisible] = useState(false);
    const refreshAfterPurchase = async () => {
        if (contract) {
            await fetchOffers(contract);
        }
    };
    const [toPurchaseOffer, setToPurchaseOffer] = useState<Offer|null>(null);

    const columns: TableProps<Offer>['columns'] = [
        {
            title: 'Seller',
            dataIndex: 'seller',
            key: 'seller',
            render: (seller) => <a href={`https://${publicRuntimeConfig.network}/address/${seller}`} target='_blank'
                                   rel="noreferrer" style={{color: "#4A90E2"}}>
                {seller}
            </a>,
        },
        {
            title: 'Amount(kWh)',
            dataIndex: 'amount',
            key: 'amount',
            defaultSortOrder: 'descend',
            sorter: (a, b) => Number(a.amount) - Number(b.amount),
        },
        {
            title: 'Price(ETH/kWh)',
            dataIndex: 'pricePerUnit',
            key: 'pricePerUnit',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                record.isAvailable ? <Space size="middle"><a onClick={() => {
                        setToPurchaseOffer(record);
                        setPurchaseDrawerVisible(true);
                    }} style={{color: "#4A90E2"}}>purchase</a></Space>
                    : <span>sold out</span>
            ),
        },
    ];

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description}/>
                <link rel="icon" href="/favicon.png"/>
            </Head>

            <Card style={{marginTop: "7px", minHeight: "100%", border: "none"}}>
                <Row gutter={[7, 14]}>
                    <Col xs={12} sm={8} md={6} lg={5} xl={4} xxl={3}>
                        <Button onClick={() => {
                            setOfferDrawerVisible(true);
                        }} type="primary" icon={<PlusOutlined/>}> New Offer </Button>
                    </Col>
                </Row>
                <Row gutter={[7, 14]} style={{marginTop: "14px"}}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Table<Offer> columns={columns} dataSource={offers}/>
                    </Col>
                </Row>
            </Card>

            <NewOfferDrawer
                {...props}
                open={offerDrawerVisible}
                show={setOfferDrawerVisible}
                refreshAfterCreate={refreshAfterNewOffer}
            />

            <PurchaseDrawer
                {...props}
                toPurchaseOffer={toPurchaseOffer}
                open={purchaseDrawerVisible}
                show={setPurchaseDrawerVisible}
                refreshAfterCreate={refreshAfterPurchase}
            />

            <AgileFooter/>
        </>
    );
}

export default AgileLayout(Page);
