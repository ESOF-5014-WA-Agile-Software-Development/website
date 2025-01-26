import React, { useEffect, useState } from "react";
import axios from "axios";
import { utils } from "ethers";

import NoSSR from '@mpth/react-no-ssr';

import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Space,
  Drawer,
  InputNumber,
  Image,
  Typography,
  Select,
} from "antd";
const { Option } = Select;

import { Urls } from "../lib/url";
import { EllipsisMiddle } from "../components/ellipsis";
import { useAppSelector } from "../store/hooks";
import { NFTCreateCFS, FixBidCFS } from "../ether/cfs";
import { MetaMaskProvider } from "../lib/mm";
import { GetUser } from "../lib/user";
import { Edition } from "../lib/type";

export function SellDrawer(props: any) {
  const { user, visible, show, selectToSell, notify } = props;
  const ether = useAppSelector((state) => state.ether);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [editionOptions, setEditionOptions] = useState<Array<Edition>>([]);

  useEffect(() => {
    if (selectToSell) {
      setEditionOptions([]);
      form.setFieldsValue({
        address: ether.account,
        base_price: 0,
        fixed_price: 0,

        id: selectToSell.id,
        art_id: selectToSell.art_id,
        ipfs_cid: selectToSell.ipfs_cid,
        title: selectToSell.title,

        edition: 0,
        minted: selectToSell.minted,
      });
      try {
        (async () => {
          let editions = await axios.get(Urls.bs.getEditions(selectToSell.id), {
            headers: { Authorization: `token ${user.token}` },
          });
          if (editions.status !== 200) {
            notify.error("Get NTFS error!", "code: " + editions.status);
            return;
          }
          let nfts = await editions.data;
          setEditionOptions(nfts);
        })();
      } catch (e) {
        notify.error("Get Editions error!", "code: " + e);
      }
    }
  }, [selectToSell, ether, form, notify, user]);

  const onClose = () => {
    show(false);
  };

  const onFinish = async (values: any) => {
    const {
      edition,
      base_price,
      fixed_price,
      address,
      art_id,
      minted,
      ipfs_cid,
      count,
      id,
    } = values;
    if (edition <= 0) {
      form.setFields([
        { name: "edition", errors: ["Please choose the edition"] },
      ]);
      return;
    }
    if (base_price <= 0) {
      form.setFields([
        { name: "base_price", errors: ["Please set the base price"] },
      ]);
      return;
    }
    if (fixed_price <= 0) {
      form.setFields([
        { name: "fixed_price", errors: ["Please set the fixed price"] },
      ]);
      return;
    }
    const e = editionOptions.find((eo) => eo.edition === edition);
    if (!e) {
      form.setFields([
        { name: "edition", errors: ["Please choose the valid edition"] },
      ]);
      return;
    }

    setSubmitting(true);

    try {
      const p = MetaMaskProvider();
      // @ts-ignore
      const signer = p.getSigner(ether.account);
      let CFS = NFTCreateCFS(p, signer);

      const ownerList = await CFS.ownerOf(e.token);
      const f = ownerList.find((o: string) => o === address);
      if (!f) {
        notify.error("Sell error!", "you are not the owner of this edition");
        return;
      }

      const isApproval = await CFS.isApprovedForAll(
        address,
        e.fix_bid_contract
      );
      if (!isApproval[0]) {
        const aRes = await CFS.setApprovalForAll(e.fix_bid_contract, true);
        console.log("setApprovalForAll", "FixedBid", aRes);
      }

      let fixBidCFS = FixBidCFS(p, signer);

      console.log({
        address: e.fix_bid_contract,
        tokenId: e.token,
        openingBid: `${utils.parseEther(`${base_price}`)}`,
        fixedPrice: `${utils.parseEther(`${fixed_price}`)}`,
      });

      const res = await fixBidCFS.auctionWrapped({
        address: e.nft_contract,
        tokenId: e.token,
        openingBid: `${utils.parseEther(`${base_price}`)}`,
        fixedPrice: `${utils.parseEther(`${fixed_price}`)}`,
      });
      console.log(res);
      notify.success("sell success", "");
      show(false);
    } catch (e) {
      // TODO alert
      notify.error("NFT mint failed", e.code || "");
      console.log(e);
    } finally {
      setSubmitting(false);
    }

    setSubmitting(false);
  };

  if (selectToSell === null) {
    return <></>;
  } else {
    return (
      <Drawer title="Sell" onClose={onClose} visible={visible} width={350}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark
          initialValues={{
            address: ether.account,
            base_price: 0,
            fixed_price: 0,

            id: selectToSell.id,
            art_id: selectToSell.art_id,
            ipfs_cid: selectToSell.ipfs_cid,
            title: selectToSell.title,
            owner: selectToSell.owner,
            edition: 0,
            minted: selectToSell.minted,
            desc: selectToSell.desc,
          }}
        >
          <Form.Item
            name="id"
            label="ID"
            hidden
            rules={[{ required: true, message: "Please enter the art id" }]}
          >
            <Input value={selectToSell.id} disabled />
          </Form.Item>
          <Form.Item name="art_id" label="Art ID" hidden>
            <Input value={selectToSell.art_id} disabled />
          </Form.Item>
          <Form.Item
            name="ipfs_cid"
            label="IPFS CID"
            hidden
            rules={[
              { required: true, message: "Please enter the art ipfs cid" },
            ]}
          >
            <Input value={selectToSell.ipfs_cid} disabled />
          </Form.Item>
          <Form.Item name="title" label="Title">
            <Input value={selectToSell.title} disabled />
          </Form.Item>
          <Form.Item name="minted" label="Minted">
            <InputNumber value={selectToSell.minted} disabled />
          </Form.Item>
          <Form.Item
            name="edition"
            label="Edition"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select edition" allowClear>
              {editionOptions.map((e, index) => {
                return (
                  <Option value={e.edition} key={index}>
                    {e.edition}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="base_price"
            label="Base Price (ETH)"
            rules={[{ required: true, message: "Please enter base price" }]}
          >
            <InputNumber style={{ width: "140px" }} />
          </Form.Item>
          <Form.Item
            name="fixed_price"
            label="Fixed Price (ETH)"
            rules={[{ required: true, message: "Please enter fixed price" }]}
          >
            <InputNumber style={{ width: "140px" }} />
          </Form.Item>
          <Form.Item name="address" label="Current Address" hidden>
            <Row align="middle">
              <Col span={3}>
                <Image
                  src="/images/metamask.png"
                  height={30}
                  width={30}
                  alt=""
                />
              </Col>
              <Col span={21}>
                <Typography.Text type="secondary">
                  <EllipsisMiddle suffixCount={12} width="77%">
                    {ether.account}
                  </EllipsisMiddle>
                </Typography.Text>
              </Col>
            </Row>
          </Form.Item>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" disabled={submitting}>
              Submit
            </Button>
          </Space>
        </Form>
      </Drawer>
    );
  }
}
