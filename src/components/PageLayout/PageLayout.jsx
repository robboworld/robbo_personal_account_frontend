import React, { useState } from 'react'
import { redirect } from 'react-router-dom'
import { Layout } from 'antd'

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'

import SideBar from '@/components/SideBar'
import { useUserIdentity, checkAccess } from '@/helpers'
import {
    HOME_PAGE_ROUTE,
    LOGIN_PAGE_ROUTE,
    STUDENT,
    SUPER_ADMIN,
    UNIT_ADMIN,
    PARENT,
    TEACHER,
} from '@/constants'

const { Header, Sider, Content } = Layout

const PageLayout = ({ children }) => {
    // const { userRole, isAuth, loginLoading } = useUserIdentity()

    // if (!loginLoading && !checkAccess(userRole, [
    //     STUDENT,
    //     SUPER_ADMIN,
    //     UNIT_ADMIN,
    //     PARENT,
    //     TEACHER,
    // ])) {
    //     return redirect(HOME_PAGE_ROUTE)
    // } else if (!isAuth && !loginLoading) {
    //     return redirect(LOGIN_PAGE_ROUTE)
    // }

    const [collapsed, setCollapsed] = useState(false)
    return (
        <Layout>
            <Sider
                trigger={null} collapsible
                collapsed={collapsed} theme='light'
            >
                <SideBar />
            </Sider>
            <Layout>
                <Header style={{ backgroundColor: 'green' }}>
                    {
                        React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })
                    }
                </Header>
                <Content style={{ padding: '0 1rem' }}>
                    {
                        children
                    }
                </Content>
            </Layout>
        </Layout >
    )
}

export default PageLayout