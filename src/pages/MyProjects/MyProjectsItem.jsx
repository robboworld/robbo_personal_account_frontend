import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import React, { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"

import { ProjectPageItem, ScratchLink, Description, Avatar, LastModified, RemoveProjectPage } from './components'
import config from "@/config"
import { useActions } from "@/helpers/useActions";


export default ({ projectPageIndex, projectPage }) => {

    const { deleteProjectPage } = useActions()
    const history = useHistory()
    const token = localStorage.getItem('token')

    const deleteProjectPageHandler = () => {
        deleteProjectPage(token, projectPage.projectId, projectPageIndex)
    }

    const toProjectPageHandler = () => {
        history.push(`/projects/${projectPage.projectId}`)
    }

    const seeInsideHandler = () => {
        window.location.replace(config.scratchURL + `?#${projectPage.projectId}`)
    }

    return (
        <ProjectPageItem>
            <Avatar />
            <Flex direction="column" margin="0 1rem"
                justify="space-between">
                <ScratchLink onClick={toProjectPageHandler}> {projectPage.title}</ScratchLink>
                <LastModified>
                    {"Последние изменение: " + projectPage.lastModified}
                </LastModified>
                <Button
                    content="Перейти"
                    background="grey"
                    height="2rem"
                    width="7rem"
                    padding="0 1rem"
                    handleSubmit={seeInsideHandler}
                />
            </Flex>
            <Flex width="58%" justify="flex-end"
                align="center">
                <RemoveProjectPage onClick={deleteProjectPageHandler}>
                    удалить
                </RemoveProjectPage>
            </Flex>
        </ProjectPageItem>
    )
}