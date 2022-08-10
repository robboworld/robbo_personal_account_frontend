import React, { useState } from "react"

import { WelcomeText } from "./components"

import { PageLayout, Card } from '@/layouts'
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import { Button, ModalWindow } from "@/components/UI"
import AddRobboUnit from "@/components/AddRobboUnit"

export default () => {

    const [openAddRobboUnit, setOpenAddRobboUnit] = useState(false)

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <WelcomeText>Robbo Units</WelcomeText>
                <ModalWindow
                    open={openAddRobboUnit} setOpen={setOpenAddRobboUnit}
                    width='35%'
                    content={() => (
                        <AddRobboUnit />
                    )}
                />
                <Flex direction='row' justify='flex-end'
                    align='flex-start'>
                    <Button
                        background='green'
                        content='Добавить Robbo Unit'
                        padding='0.5rem'
                        handleSubmit={() => setOpenAddRobboUnit(true)}
                    />
                </Flex>
            </Card>
        </PageLayout>
    )
}