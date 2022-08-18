import React, { useEffect } from "react"
import { useParams } from "react-router-dom"

import { PageLayout, Card } from '@/layouts'
import SideBar from "@/components/SideBar"
import { useActions } from "@/helpers/useActions"

export default ({ robboUnit }) => {

    const token = localStorage.getItem('token')
    const { getRobboUnitById } = useActions()
    const { robboUnitId } = useParams()

    useEffect(() => {
        getRobboUnitById(token, robboUnitId)
        return () => {
            // clear robboUnit {}
        }
    }, [])

    return (
        <PageLayout>
            <Card>
                <SideBar />
            </Card>
        </PageLayout>
    )
}