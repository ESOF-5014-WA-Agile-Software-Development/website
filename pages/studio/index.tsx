import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import NoSSR from '@mpth/react-no-ssr';
import {
  Row,
  Col,
  Button,
  Card,
  Upload,
  Pagination,
  Form,
  Input,
  Space,
  Drawer,
  Divider,
  InputNumber,
  Radio,
  Image,
  Typography,
  Descriptions,
  Tag,
  Statistic,
} from "antd";
const { Meta } = Card;
import {
  PlusOutlined,
  SyncOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { Hash, Urls } from "../../lib/url";
import AgileLayout from "../_layout";
import { GetDate } from "../../lib/time";
import { ToFormData } from "../../lib/form";
import { NFTInfo, OSSUploadResponse } from "../../lib/type";
import { EllipsisMiddle } from "../../components/ellipsis";
import { useAppSelector } from "../../store/hooks";
import { NFTCreateCFS } from "../../ether/cfs";
import { MetaMaskProvider } from "../../lib/mm";
import { GetUser } from "../../lib/user";
import { SellDrawer } from "../../components/sell";

function NFTCard(props: any) {
  const {
    user,
    info,
    notify,
    setSelectToMint,
    setMintDrawVisible,
    setSelectToSell,
    setSellDrawVisible,
  } = props;

  const image = (info: NFTInfo) => {
    if (info.mime_type === "video/mp4") {
      return (
        <Image
          src={`${info.oss_url}?x-oss-process=video/snapshot,t_7000,f_png,m_fast`}
          alt=""
          onClick={() => {
            window.open(info.oss_url, "_blank");
          }}
          style={{ cursor: "pointer" }}
          preview={false}
          fallback="data:image/png;base64,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"
        />
      );
    } else {
      return (
        <Image
          src={`${info.oss_url}`}
          alt=""
          preview={{ src: info.oss_url }}
          fallback="data:image/png;base64,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"
        />
      );
    }
  };

  const onRetryPreProcess = async () => {
    try {
      let retryRes = await axios.post(
        Urls.bs.retryNFTSPreProcess(info.id),
        {
          action: "retry",
        },
        {
          headers: { Authorization: `token ${user.token}` },
        }
      );

      if (retryRes.status !== 200) {
        notify.error("Update NTFS error!", "code: " + retryRes.status);
        return;
      }
      let nfts = await retryRes.data;
      notify.success("retry preprocess succeed", "");
    } catch (e) {
      notify.error("update NTF error!", "code: " + e);
    }
  };

  let date = new Date(info.created_at);
  let ipfsUpdated = new Date(info.ipfs_updated);
  let diff =
    Math.abs(Date.now() - ipfsUpdated.getTime()) / 1000 / 60 / 60 / 0.5;
  let pre = <></>;
  let r = (
    <Col span={6}>
      <Button type="link" size="small" onClick={onRetryPreProcess}>
        retry
      </Button>
    </Col>
  );
  let preRetry = <></>;
  if (info.ipfs_state === "todo") {
    pre = <Tag color="#2db7f5">waiting</Tag>;
    if (diff >= 1) {
      preRetry = r;
    }
  } else if (info.ipfs_state === "success") {
    pre = <Tag color="#108ee9">success</Tag>;
  } else if (info.ipfs_state === "uploading") {
    pre = <Tag color="#87d068">doing</Tag>;
    if (diff >= 1) {
      preRetry = r;
    }
  } else if (info.ipfs_state === "fail") {
    pre = <Tag color="#f50">failed</Tag>;
    preRetry = r;
  } else {
    pre = <Tag color="gray">unknown</Tag>;
  }

  const onMint = (info: NFTInfo) => {
    return () => {
      setSelectToMint(info);
      setMintDrawVisible(true);
    };
  };

  const onSell = (info: NFTInfo) => {
    return () => {
      setSelectToSell(info);
      setSellDrawVisible(true);
    };
  };

  const actions = () => {
    if (info.ipfs_state === "success") {
      if (info.minted <= 0) {
        return [
          <Button type="primary" block key="mint" onClick={onMint(info)}>
            Mint
          </Button>,
        ];
      } else if (info.minted < info.edition) {
        return [
          <Button type="primary" block key="mint" onClick={onMint(info)}>
            Mint
          </Button>,
          <Button type="primary" block key="sell" onClick={onSell(info)} danger>
            Sell
          </Button>,
        ];
      } else if (info.minted <= 0) {
        return [
          <Button type="primary" block key="mint" onClick={onMint(info)}>
            Mint
          </Button>,
        ];
      } else {
        return [
          <Button type="primary" block key="sell" onClick={onSell(info)} danger>
            Sell
          </Button>,
        ];
      }
    } else {
      return [
        <Button type="primary" block key="mint" disabled>
          Mint
        </Button>,
      ];
    }
  };

  return (
    <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
      <Card cover={image(info)} actions={actions()}>
        <Row justify="space-between">
          <Col span={24}>
            <Meta
              style={{ marginBottom: "14px" }}
              avatar={
                info.mime_type == "video/mp4" ? <VideoCameraOutlined /> : <></>
              }
              title={info.title}
              description={info.desc}
            />
          </Col>
          <Col span={12}>
            <Statistic title="Edition" value={info.edition} />
          </Col>
          <Col span={12}>
            <Statistic title="Minted" value={info.minted} />
          </Col>
          <Col span={18}>
            <Descriptions size="small">
              <Descriptions.Item label="Preprocessing">{pre}</Descriptions.Item>
            </Descriptions>
          </Col>
          {preRetry}
          <Col span={24}>
            <Descriptions size="small">
              <Descriptions.Item label="Created At">
                {date.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

function NFTS(props: any) {
  const { user, notify } = props;
  const [uploadDrawVisible, setUploadDrawVisible] = useState(false);
  const [mintDrawVisible, setMintDrawVisible] = useState(false);
  const [sellDrawVisible, setSellDrawVisible] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageTotalRecords, setPageTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [pageOrder, setPageOrder] = useState("created_at:desc");
  const [nfts, setNFTS] = useState<NFTInfo[]>([]);
  const [selectToMint, setSelectToMint] = useState<NFTInfo | null>(null);
  const [selectToSell, setSelectToSell] = useState<NFTInfo | null>(null);

  const [chosenState, setChosenState] = useState("reviewing");
  const onChangeState = (e: any) => {
    setPageCurrent(1);
    setChosenState(e.target.value);
  };

  const onChange = (page: number, page_size?: number) => {
    setPageCurrent(page);
    if (page_size) {
      setPageSize(page_size);
    }
  };

  const onShowSizeChange = (current: number, page_size?: number) => {
    setPageCurrent(current);
    if (page_size) {
      setPageSize(page_size);
    }
  };

  const refresh = useCallback(async () => {
    /*
    let nftsRes = await axios.get(Urls.bs.getNFTS(), {
      headers: { Authorization: `token ${user.token}` },
      params: {
        current: pageCurrent,
        page_size: pageSize,
        sort: pageOrder,
        search: "state:" + chosenState,
      },
    });
    if (nftsRes.status !== 200) {
      notify.error("Get NTFS error!", "code: " + nftsRes.status);
      return;
    }
    let nfts = await nftsRes.data;
     */
    let nfts = {
      total: 0,
      nfts: [],
    }
    setPageTotalRecords(nfts.total);
    setNFTS(nfts.nfts);
  }, [chosenState, pageCurrent, pageSize, pageOrder, notify, user]);

  const refreshAfterCreate = () => {
    if (chosenState === "reviewing" && pageCurrent === 1) {
      refresh().then((r) => {});
    }
  };

  useEffect(() => {
    refresh().then((r) => {});
  }, [
    chosenState,
    pageCurrent,
    pageSize,
    pageOrder,
    pageTotalRecords,
    refresh,
  ]);

  const onRefresh = () => {
    refresh().then((r) => {});
  };

  return (
    <>
      <Row gutter={[7, 14]}>
        <Col xs={12} sm={8} md={6} lg={5} xl={4} xxl={3}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setUploadDrawVisible(true);
            }}
          >
            New NFT
          </Button>
        </Col>
        <Col xs={21} sm={13} md={10} lg={8} xl={6} xxl={5}>
          <Radio.Group
            buttonStyle="solid"
            value={chosenState}
            onChange={onChangeState}
          >
            <Radio.Button value="reviewing">reviewing</Radio.Button>
            <Radio.Button value="passed">passed</Radio.Button>
            <Radio.Button value="rejected">rejected</Radio.Button>
          </Radio.Group>
        </Col>
        <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}>
          <Button onClick={onRefresh} icon={<SyncOutlined />} />
        </Col>
      </Row>
      <Divider />
      <Row
        justify="space-around"
        align="middle"
        style={{ marginTop: "14px", marginBottom: "14px" }}
      >
        <Pagination
          defaultCurrent={1}
          current={pageCurrent}
          hideOnSinglePage={true}
          total={pageTotalRecords}
          pageSize={pageSize}
          onChange={onChange}
          onShowSizeChange={onShowSizeChange}
        />
      </Row>
      <Row
        gutter={[14, 21]}
        style={{ marginTop: "14px", paddingBottom: "64px" }}
      >
        {nfts.map((info, index, array) => {
          return (
            <NFTCard
              {...props}
              key={info.id}
              info={info}
              setMintDrawVisible={setMintDrawVisible}
              setSelectToMint={setSelectToMint}
              setSelectToSell={setSelectToSell}
              setSellDrawVisible={setSellDrawVisible}
            ></NFTCard>
          );
        })}
      </Row>
      <NewNFTDrawer
        {...props}
        visible={uploadDrawVisible}
        show={setUploadDrawVisible}
        refreshAfterCreate={refreshAfterCreate}
      />
      <MintDrawer
        {...props}
        visible={mintDrawVisible}
        show={setMintDrawVisible}
        selectToMint={selectToMint}
      />
      <SellDrawer
        {...props}
        visible={sellDrawVisible}
        show={setSellDrawVisible}
        selectToSell={selectToSell}
      />
    </>
  );
}

function MintDrawer(props: any) {
  const { visible, show, selectToMint, notify } = props;
  const ether = useAppSelector((state) => state.ether);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectToMint) {
      form.setFieldsValue({
        id: selectToMint.id,
        art_id: selectToMint.art_id,
        ipfs_cid: selectToMint.ipfs_cid,
        title: selectToMint.title,
        address: ether.account,
        edition: selectToMint.edition,
        minted: selectToMint.minted,
        count: 1,
        desc: selectToMint.desc,
      });
    }
  }, [selectToMint, ether, form]);

  const onClose = () => {
    show(false);
  };

  const onFinish = async (values: any) => {
    const { id, art_id, ipfs_cid, edition, minted, count, address, owner } =
      values;

    setSubmitting(true);

    try {
      const p = MetaMaskProvider();
      // @ts-ignore
      const signer = p.getSigner(ether.account);
      const CFS = NFTCreateCFS(p, signer);

      if (minted > 0 && art_id) {
        // add one to minted
        const res = await CFS.addArt(art_id, count);
        let mintRes = await axios.post(
          Urls.bs.mintNFT(id),
          {
            th: res.hash,
            from: res.from,
            to: res.to,
          },
          {
            headers: { Authorization: `token ${GetUser().token}` },
          }
        );
        if (mintRes.status !== 200) {
          console.log("mint update to server error");
          return;
        }
        notify.success("mint success", "");
        show(false);
      } else {
        const res = await CFS.createArt([], [], edition, ipfs_cid, count);
        let mintRes = await axios.post(
          Urls.bs.mintNFT(id),
          {
            th: res.hash,
            from: res.from,
            to: res.to,
          },
          {
            headers: { Authorization: `token ${GetUser().token}` },
          }
        );
        if (mintRes.status !== 200) {
          console.log("mint update to server error");
          return;
        }
        notify.success("mint success", "");
        show(false);
      }
    } catch (e) {
      // TODO alert
      notify.error("NFT mint failed", e.code || "");
      console.log(e);
    }

    setSubmitting(false);
  };

  if (selectToMint === null) {
    return <></>;
  } else {
    return (
      <Drawer title="Mint" onClose={onClose} visible={visible} width={350}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark
          initialValues={{
            id: selectToMint.id,
            ipfs_cid: selectToMint.ipfs_cid,
            title: selectToMint.title,
            owner: selectToMint.owner,
            address: ether.account,
            edition: selectToMint.edition,
            minted: selectToMint.minted,
            art_id: selectToMint.art_id,
            count: 1,
            desc: selectToMint.desc,
          }}
        >
          <Form.Item
            name="id"
            label="ID"
            hidden
            rules={[{ required: true, message: "Please enter the art id" }]}
          >
            <Input value={selectToMint.id} disabled />
          </Form.Item>
          <Form.Item name="art_id" label="Art ID" hidden>
            <Input value={selectToMint.art_id} disabled />
          </Form.Item>
          <Form.Item
            name="ipfs_cid"
            label="IPFS CID"
            hidden
            rules={[
              { required: true, message: "Please enter the art ipfs cid" },
            ]}
          >
            <Input value={selectToMint.ipfs_cid} disabled />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the art title" }]}
          >
            <Input value={selectToMint.title} disabled />
          </Form.Item>
          <Form.Item
            name="edition"
            label="Edition"
            rules={[{ required: true, message: "Please enter edition number" }]}
          >
            <InputNumber value={selectToMint.edition} disabled />
          </Form.Item>
          <Form.Item name="minted" label="Minted">
            <InputNumber value={selectToMint.minted} disabled />
          </Form.Item>
          <Form.Item
            name="count"
            label="Count"
            rules={[{ required: true, message: "Please enter count" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="desc" label="Description">
            <Input.TextArea value={selectToMint.desc} rows={4} disabled />
          </Form.Item>
          <Form.Item name="owner" label="Owner">
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
                    {selectToMint.owner}
                  </EllipsisMiddle>
                </Typography.Text>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="address" label="Current Address">
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

function NewNFTDrawer(props: any) {
  const { user, visible, show, notify, refreshAfterCreate } = props;
  const ether = useAppSelector((state) => state.ether);
  const [fileList, setFileList] = useState<
    Array<UploadFile<OSSUploadResponse>>
  >([]);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ address: ether.account });
    }
  }, [ether, form, visible]);

  const beforeUpload = (file: any) => {
    const allowedSize = file.size / 1024 / 1024 < 100;
    if (!allowedSize) {
      console.log("file must smaller than 30MB!");
    }
    return allowedSize;
  };

  const customRequest = async (option: UploadRequestOption) => {
    const config = {
      onUploadProgress: (event: any) => {
        const percent = Math.floor(10 + (event.loaded / event.total) * 90);
        if (option.onProgress) {
          // @ts-ignore
          option.onProgress({ percent: percent });
        }
      },
    };

    try {
      // get sign from bs server for oss upload
      let res = await axios.get(Urls.bs.getOssToken(), {
        headers: { Authorization: `token ${user.token}` },
      });
      if (res.status != 200) {
        notify.error("New NFT error!", "get oss token failed");
        return;
      }
      let token = await res.data;
      if (option.onProgress) {
        // @ts-ignore
        option.onProgress({ percent: 10 });
      }
      // prepare to upload
      // prepare key for oss storage
      let name;
      // @ts-ignore
      if ("name" in option.file) {
        name = option.file.name;
      } else if (typeof option.file === "string") {
        name = option.file;
      } else if (option.filename) {
        name = option.filename;
      } else {
        name = "unknown";
      }
      const filePath = `/${user.info?.id}/${GetDate()}/${Hash(name)}/${nanoid(
        8
      )}`;
      const fileName = `${token.dir}${filePath}`;
      // prepare request
      const ossUploadRequest = {
        key: fileName,
        OSSAccessKeyId: token.key,
        policy: token.policy,
        success_action_status: "200",
        callback: token.callback,
        signature: token.sign,
        file: option.file,
      };
      // upload
      let uploadResponse = await axios.post(
        token.host,
        ToFormData(ossUploadRequest),
        config
      );
      if (uploadResponse.status != 200) {
        notify.error("New NFT error!", "upload oss failed.");
        return;
      }
      let uploadData = await res.data;
      // must
      if (option.onSuccess) {
        option.onSuccess(
          {
            ...uploadData,
            url: `${token.host}/${fileName}`,
            oss_path: filePath,
          },
          uploadResponse.request
        );
      }
      // must
      setFileList((prevState) => {
        if (prevState.length > 0) {
          let thumbUrl = `${token.host}/${fileName}`;
          if (prevState[0].type === "video/mp4") {
            thumbUrl = `${token.host}/${fileName}?x-oss-process=video/snapshot,t_7000,f_png,w_0,h_0,m_fast`;
          }
          return [
            {
              ...prevState[0],
              url: `${token.host}/${fileName}`,
              thumbUrl: thumbUrl,
              status: "done",
            },
          ];
        }
        return prevState;
      });
    } catch (err) {
      notify.error("New NFT error!", err);
      if (option.onError) {
        option.onError(err);
      }
    } finally {
    }
  };

  const handleChange = (info: UploadChangeParam) => {
    setFileList(info.fileList);
  };

  const onUploadChange = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onClose = () => {
    show(false);
  };

  const onFinish = async (values: any) => {
    const { art, title, edition, desc, owner } = values;

    setSubmitting(true);
    try {
      let submitRes = await axios.post(
        Urls.bs.createNFT(),
        {
          title: title,
          edition: edition,
          desc: desc,
          meta_name: art[0].name,
          meta_size: art[0].size,
          mime_type: art[0].type,
          oss_host: art[0].response.host,
          oss_url: art[0].response.url,
          oss_path: escape(art[0].response.oss_path),
          owner: owner,
        },
        {
          headers: { Authorization: `token ${user.token}` },
        }
      );
      if (submitRes.status !== 200) {
        notify.error("New NFT error!", submitRes.status);
        return;
      }
      let _ = await submitRes.data;
      setFileList([]);
      form.resetFields();
      show(false);
      notify.success("Create NFT success!", "");

      // refresh nfts
      refreshAfterCreate();
    } catch (err) {
      notify.error("New NFT error!", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer title="New NFT" onClose={onClose} visible={visible} width={350}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark
        initialValues={{ owner: ether.account, edition: 1, desc: "" }}
      >
        <Form.Item
          name="art"
          label="Image, Video, Audio, or 3D Model"
          valuePropName="art"
          getValueFromEvent={onUploadChange}
          rules={[{ required: true, message: "Please choose an art" }]}
        >
          <Upload
            name="upload-nft-media"
            listType="picture-card"
            className="avatar-uploader"
            accept="image/png,image/jpeg,image/jpg,image/gif,video/mp4"
            fileList={fileList}
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 7 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the art title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="edition"
          label="Total Edition"
          rules={[{ required: true, message: "Please enter edition number" }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item name="desc" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="owner"
          label="MetaMask"
          rules={[{ required: true, message: "please connect to MetaMask" }]}
        >
          <Row align="middle">
            <Col span={3}>
              <Image src="/images/metamask.png" height={30} width={30} alt="" />
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

function Page(props: any) {
  const title = "Studio / Agile";
  const description = "TODO.";

  return (
    <NoSSR>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Card style={{ marginTop: "14px", minHeight: "100%" }}>
        <NFTS {...props} />
      </Card>
    </NoSSR>
  );
}

export default AgileLayout(Page);
