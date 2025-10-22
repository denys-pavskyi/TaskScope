import React from 'react'
import '../header/Header.scss'
import { Layout, Typography} from 'antd'

const { Header: AntHeader} = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
    return (
        <AntHeader className="app-header">
            <Title level={3} className="logo">TaskScope</Title>
        </AntHeader>
    );
};

export default Header;