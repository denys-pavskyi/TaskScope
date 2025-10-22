import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from '../../components/public/header/Header'
import './MainLayout.scss'

const { Content } = Layout;

const MainLayout: React.FC = () => {
    return(
        <Layout className="main-layout">
            <Header />
            <Content className="main-content">
                <Outlet />
            </Content>
        </Layout>
    );
};

export default MainLayout;