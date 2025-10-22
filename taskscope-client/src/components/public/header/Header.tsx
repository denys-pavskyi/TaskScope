import React from 'react'
import '../header/Header.scss'
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography} from 'antd'

const { Header: AntHeader} = Layout;
const { Title } = Typography;

const Header: React.FC = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { key: '/today', label: 'Today' },
        { key: '/upcoming', label: 'Upcoming' },
        { key: '/tags', label: 'Tags' },
        { key: '/calendar', label: 'Calendar' },
    ];

    return (
    <AntHeader className="app-header">
      <div className="logo" onClick={() => navigate('/')}>TaskScope</div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={(e) => navigate(e.key)}
      />
    </AntHeader>
    );
};

export default Header;