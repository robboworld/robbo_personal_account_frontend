import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PageLayout, Card } from "@/layouts"
import { WelcomeText, HardcoreLink, ProjectStage, UnsharedMessage, Title, Instructions, Notes } from "./components"
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import Input from "@/components/UI/Input"
import { getProjectPageById, onChangeProjectPageInstruction, onChangeProjectPageNotes, onChangeProjectPageTitle, onSharedProject, updateProjectPage } from "@/actions"
import { getProjectPage } from "@/reducers/projectPage"
import config from "@/config"
import Textarea from "@/components/UI/TextArea"


export default (props) => {
    const dispath = useDispatch()
    const [titleEditMode, setTitleEditMode] = useState(false)
    const [instructionsEditMode, setInstructionsEditMode] = useState(false)
    const [notesEditMode, setNotesEditMode] = useState(false)
    const { projectPageId } = props.match.params
    const token = localStorage.getItem('token')

    useEffect(() => {
        // dispath(getProjectPageById(token))
    }, [])

    const projectPage = useSelector(state => getProjectPage(state.projectPage))


    const onChangeTitleHandler = (title) => {
        dispath(onChangeProjectPageTitle(title))
    }

    const onChangeInstructionsHanler = (instruction) => {
        dispath(onChangeProjectPageInstruction(instruction))
    }

    const onChangeNotesHanler = (notes) => {
        dispath(onChangeProjectPageNotes(notes))
    }

    const onBlurHandler = (element) => {
        switch (element) {
            case "title":
                setTitleEditMode(false)
                dispath(updateProjectPage(token, projectPage))
                return
            case "instruction":
                setInstructionsEditMode(false)
                dispath(updateProjectPage(token, projectPage))
                return
            case "notes":
                setNotesEditMode(false)
                dispath(updateProjectPage(token, projectPage))
                return
        }
    }

    const onSharedHandler = () => {
        dispath(onSharedProject(!projectPage.isShared))
        dispath(updateProjectPage(token, projectPage))
    }

    const seeInsideHandler = () => {
        window.location.replace(config.scratchURL + `?#${projectPageId}`)
    }

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex direction="column" align="flex-start"
                    width="100%" height="100%"
                    padding="2rem">
                    {
                        !projectPage.isShared &&
                        <UnsharedMessage>
                            <Flex align="center" width="100%"
                                height="100%" justify="space-between" >
                                <span>Данный проект не открыт для общего доступа</span>
                                <Button
                                    content="Открыть доступ"
                                    background="#ff8c1a"
                                    padding="0.5rem"
                                    handleSubmit={onSharedHandler}
                                />
                            </Flex>
                        </UnsharedMessage>
                    }
                    <Flex align="center" width="100%"
                        justify="space-between">
                        {titleEditMode
                            ?
                            < Input
                                onBlur={() => { onBlurHandler("title") }}
                                value={projectPage.title}
                                width="50%"
                                height="4rem"
                                fontSize="3rem"
                                handleInput={onChangeTitleHandler}
                            />
                            : <Title onClick={() => { setTitleEditMode(true) }}>
                                <span>{projectPage.title}</span>
                            </Title>

                        }
                        <Button
                            content="Открыть в Scratch"
                            background="grey"
                            margin="1rem" padding="0.5rem"
                            handleSubmit={seeInsideHandler}
                        />
                    </Flex>
                    <Flex column="row" justify="space-between"
                        width="100%" height="41%"
                        padding="2rem 0">
                        <ProjectStage />
                        <Flex direction="column" width="100%"
                            height="100%">
                            <Flex direction="column" width="100%"
                                height="100%" align="center">
                                <h4>Инструкция</h4>
                                {
                                    instructionsEditMode ?
                                        <Textarea
                                            onBlur={() => { onBlurHandler("instruction") }}
                                            handleInput={onChangeInstructionsHanler}
                                            value={projectPage.instruction}
                                            width={"100%"}
                                            height={"15vh"}
                                            padding={"2rem"}
                                            placeholder={"Инструкция здесь"}
                                            fontSize={"1vw"}
                                            margin={"1rem 0"}
                                        /> :
                                        <Instructions onClick={() => { setInstructionsEditMode(true) }}>
                                            {
                                                projectPage.instruction
                                            }
                                        </Instructions>
                                }

                            </Flex>
                            <Flex direction="column" width="100%"
                                height="100%" align="center">
                                <h4>Примечание</h4>
                                {
                                    notesEditMode ?
                                        <Textarea
                                            onBlur={() => { onBlurHandler("notes") }}
                                            handleInput={onChangeNotesHanler}
                                            value={projectPage.notes}
                                            width={"100%"}
                                            height={"15vh"}
                                            padding={"2rem"}
                                            placeholder={"Примечание здесь"}
                                            fontSize={"1vw"}
                                            margin={"1rem 0"}
                                        /> :
                                        <Notes onClick={() => { setNotesEditMode(true) }}>
                                            {
                                                projectPage.notes
                                            }
                                        </Notes>
                                }
                            </Flex>
                        </Flex>

                    </Flex>

                </Flex>
            </Card>
        </PageLayout>
    )
}