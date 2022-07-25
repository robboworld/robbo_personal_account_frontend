import React from 'react'

import SideBar from "@/components/SideBar"
import { Card, PageLayout } from "@/layouts"
import Flex from '@/components/Flex'


export default () => {
    return (
        <PageLayout>
            <Card>
                <h3>Педагоги</h3>
                <SideBar />
                <Flex>
                    <h3>Список педагогов</h3>
                </Flex>
            </Card>
        </PageLayout>

    )
}