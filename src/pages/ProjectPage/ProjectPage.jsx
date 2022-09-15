import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams, Redirect } from 'react-router-dom'

import { ProjectStage, UnsharedMessage, Title, Instructions, Notes } from './components'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import Flex from '@/components/Flex'
import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'
import { getProjectPage, getProjectPageLoading } from '@/reducers/projectPage'
import config from '@/config'
import Textarea from '@/components/UI/TextArea'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers/useActions'
import { checkAccess, useUserIdentity } from '@/helpers'
import { STUDENT, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from '@/constants'

export default props => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const {
        getProjectPageById,
        clearProjectPageState,
        onChangeProjectPageTitle,
        onChangeProjectPageInstruction,
        onSharedProject,
        updateProjectPage,
        onChangeProjectPageNotes,
    } = useActions()

    const [titleEditMode, setTitleEditMode] = useState(false)
    const [instructionsEditMode, setInstructionsEditMode] = useState(false)
    const [notesEditMode, setNotesEditMode] = useState(false)

    const { projectPageId } = useParams()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [STUDENT]))
            getProjectPageById(token, projectPageId)
        return () => {
            clearProjectPageState()
        }
    }, [loginLoading])

    const projectPage = useSelector(({ projectPage }) => getProjectPage(projectPage))
    const loading = useSelector(({ projectPage }) => getProjectPageLoading(projectPage))

    const onChangeTitleHandler = title => {
        onChangeProjectPageTitle(title)
    }

    const onChangeInstructionsHanler = instruction => {
        onChangeProjectPageInstruction(instruction)
    }

    const onChangeNotesHanler = notes => {
        onChangeProjectPageNotes(notes)
    }

    const onBlurHandler = element => {
        switch (element) {
            case 'title':
                setTitleEditMode(false)
                updateProjectPage(token, projectPage)
                return
            case 'instruction':
                setInstructionsEditMode(false)
                updateProjectPage(token, projectPage)
                return
            case 'notes':
                setNotesEditMode(false)
                updateProjectPage(token, projectPage)

        }
    }

    const onSharedHandler = () => {
        onSharedProject(!projectPage.isShared)
        updateProjectPage(token, projectPage)
    }

    const seeInsideHandler = () => {
        window.location.replace(config.scratchURL + `?#${projectPageId}`)
    }

    if (!loginLoading && !checkAccess(userRole, [STUDENT])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            <Card>
                <SideBar />
                {loading || loginLoading
                    ? <Loader />
                    : (
                        <Flex direction='column' align='flex-start'
                            width='100%' height='100%'
                            padding='2rem'>
                            {
                                !projectPage.isShared &&
                                <UnsharedMessage>
                                    <Flex align='center' width='100%'
                                        height='100%' justify='space-between' >
                                        <span>Данный проект не открыт для общего доступа</span>
                                        <Button
                                            content='Открыть доступ'
                                            background='#ff8c1a'
                                            padding='0.5rem'
                                            handleSubmit={onSharedHandler}
                                        />
                                    </Flex>
                                </UnsharedMessage>
                            }
                            <Flex align='center' width='100%'
                                justify='space-between'>
                                {titleEditMode
                                    ? (
                                        <Input
                                            onBlur={() => { onBlurHandler('title') }}
                                            value={projectPage.title}
                                            width='50%'
                                            height='4rem'
                                            fontSize='3rem'
                                            handleInput={onChangeTitleHandler}
                                        />)
                                    : (
                                        <Title onClick={() => { setTitleEditMode(true) }}>
                                            <span>{projectPage.title}</span>
                                        </Title>
                                    )

                                }
                                <Button
                                    content='Открыть в Scratch'
                                    background='grey'
                                    margin='1rem' padding='0.5rem'
                                    handleSubmit={seeInsideHandler}
                                />
                            </Flex>
                            <Flex direction='row' justify='space-between'
                                width='100%' height='41%'
                                padding='2rem 0'>
                                <ProjectStage />
                                <Flex direction='column' width='100%'
                                    height='100%'>
                                    <Flex direction='column' width='100%'
                                        height='100%' align='center'>
                                        <h4>Инструкция</h4>
                                        {
                                            instructionsEditMode
                                                ? (
                                                    <Textarea
                                                        onBlur={() => { onBlurHandler('instruction') }}
                                                        handleInput={onChangeInstructionsHanler}
                                                        value={projectPage.instruction}
                                                        width='100%'
                                                        height='15vh'
                                                        padding='2rem'
                                                        placeholder='Инструкция здесь'
                                                        fontSize='1vw'
                                                        margin='1rem 0'
                                                    />)
                                                : (
                                                    <Instructions onClick={() => { setInstructionsEditMode(true) }}>
                                                        {
                                                            projectPage.instruction
                                                        }
                                                    </Instructions>
                                                )
                                        }

                                    </Flex>
                                    <Flex direction='column' width='100%'
                                        height='100%' align='center'>
                                        <h4>Примечание</h4>
                                        {
                                            notesEditMode
                                                ? (
                                                    <Textarea
                                                        onBlur={() => { onBlurHandler('notes') }}
                                                        handleInput={onChangeNotesHanler}
                                                        value={projectPage.notes}
                                                        width='100%'
                                                        height='15vh'
                                                        padding='2rem'
                                                        placeholder='Примечание здесь'
                                                        fontSize='1vw'
                                                        margin='1rem 0'
                                                    />)
                                                : (
                                                    <Notes onClick={() => { setNotesEditMode(true) }}>
                                                        {
                                                            projectPage.notes
                                                        }
                                                    </Notes>
                                                )
                                        }
                                    </Flex>
                                </Flex>

                            </Flex>

                        </Flex>
                    )
                }
            </Card>
        </PageLayout>
    )
}