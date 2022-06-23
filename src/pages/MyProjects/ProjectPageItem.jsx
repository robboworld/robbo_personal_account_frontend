import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import React, { useEffect, useState } from "react"

import { ProjectPageItem, ScratchLink, Description, Avatar, LastModified, RemoveProjectPage } from './components'

export default ({ projectPage }) => {
    return (
        <ProjectPageItem>
            <Avatar />
            <Flex direction={"column"} margin={"0 1rem"} justify={"space-between"}>
                <ScratchLink href={projectPage.linkScratch}> {projectPage.title}</ScratchLink>
                <LastModified>
                    {"Последние изменение: " + projectPage.date}
                </LastModified>
                <Button content={"Перейти"} background={"grey"} height={"2rem"} width={"7rem"} padding={"0 1rem"} />
            </Flex>
            <Flex width={"58%"} justify={"flex-end"} align={"center"}>
                <RemoveProjectPage>
                    {"удалить"}
                </RemoveProjectPage>
            </Flex>
        </ProjectPageItem>
    )
}