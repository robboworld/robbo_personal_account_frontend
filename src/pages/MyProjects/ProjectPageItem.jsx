import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux"
import { deleteProjectPage } from "@/actions"

import { ProjectPageItem, ScratchLink, Description, Avatar, LastModified, RemoveProjectPage } from './components'

export default ({ projectPage }) => {

    const dispath = useDispatch()
    const history = useHistory();
    const token = localStorage.getItem('token')

    const deleteProjectPageHandler = () => {
        dispath(deleteProjectPage(token, projectPage.id))
    }

    const toProjectPageHandler = () => {
        history.push(`/projects/${projectPage.id}`);
    }

    return (
        <ProjectPageItem>
            <Avatar />
            <Flex direction={"column"} margin={"0 1rem"} justify={"space-between"}>
                <ScratchLink onClick={toProjectPageHandler}> {projectPage.title}</ScratchLink>
                <LastModified>
                    {"Последние изменение: " + projectPage.date}
                </LastModified>
                <Button content={"Перейти"} background={"grey"} height={"2rem"} width={"7rem"} padding={"0 1rem"} />
            </Flex>
            <Flex width={"58%"} justify={"flex-end"} align={"center"}>
                <RemoveProjectPage onClick={deleteProjectPageHandler}>
                    {"удалить"}
                </RemoveProjectPage>
            </Flex>
        </ProjectPageItem>
    )
}