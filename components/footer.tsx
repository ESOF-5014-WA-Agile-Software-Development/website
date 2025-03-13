import {Layout, Row, Col, Typography} from 'antd';

const {Footer: AntFooter} = Layout;
const {Text} = Typography;


const FootContent = () => {
    return (
        <AntFooter style={{padding: '14px 14px'}}>
            <Row justify="center">
                <Col>
                    <Text>
                        © {new Date().getFullYear()} CoHome. All rights reserved.
                    </Text>
                </Col>
            </Row>
        </AntFooter>
    );
};

const AgileFooter = () => {
    return <Row>
        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
            <FootContent/>
        </Col>
        <Col xs={0} sm={0} md={24} lg={24} xl={0} xxl={0}>
            <FootContent/>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={24} xxl={24}>
            <FootContent/>
        </Col>
    </Row>
};

export default AgileFooter;
