import { Row, Col } from "antd";


const FootContent = () => {
  return (
      <>
          <span>TODO Footer</span>
      </>
  );
};

export const Footer = (_props: any) => {
  return <Row >
    <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}  >
      <FootContent />
    </Col>
    <Col xs={0} sm={0} md={24} lg={24} xl={0} xxl={0}>
      <FootContent />
    </Col>
    <Col xs={0} sm={0} md={0} lg={0} xl={24} xxl={24}>
      <FootContent />
    </Col>
  </Row>
};
