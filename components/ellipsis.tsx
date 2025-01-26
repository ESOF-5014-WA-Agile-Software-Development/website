import { Typography } from 'antd';

const { Text } = Typography;

export const EllipsisMiddle = ({suffixCount, width, children}:{
    suffixCount:number, width:string, children:string|null
}) => {
    if (children && children.length && children.length > suffixCount) {
        const start = children.slice(0, children.length - suffixCount).trim();
        const suffix = children.slice(-suffixCount).trim();
        return (
            <Text style={{ maxWidth: width }} ellipsis={{ suffix }}>
                {start}
            </Text>
        )
    }
    return <Text style={{ maxWidth: width }}>
        {children}
    </Text>
}
