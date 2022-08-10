import React from "react"

import { PageLayout, Card } from '@/layouts'
import SideBar from "@/components/SideBar"

export default () => {
    return (
        <PageLayout>
            <Card>
                <SideBar />
            </Card>
        </PageLayout>
    )
}