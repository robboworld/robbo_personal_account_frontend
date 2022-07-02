import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PageLayout, Card } from "@/layouts"
import { WelcomeText, HardcoreLink, ProjectStage, UnsharedMessage, Title, Instructions, Notes } from "./components"
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import Input from "@/components/UI/Input"
import { getProjectPageById, onChangeProjectPageTitle, onSharedProject, updateProjectPage } from "@/actions"
import { getProjectPage } from "@/reducers/projectPage"
import config from "@/config"


export default (props) => {
    console.log(props)
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

    const onBlurHandler = (element) => {
        switch (element) {
            case "title":
                setTitleEditMode(false)
                dispath(updateProjectPage(token, projectPage))
                return
            case "instructions":
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
        window.location.replace(config.scratchURL + `project/${projectPageId}`)
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
                                    // instructionsEditMode ?
                                    //     // TODO textarea
                                    //     <Input
                                    //         onBlur={() => { setInstructionsEditMode(false) }}
                                    //         value={projectPage.instructions}
                                    //         width="100%"

                                    //     />
                                    //     :
                                    //     <Instructions onClick={() => { setInstructionsEditMode(true) }}>
                                    //         {
                                    //             projectPage.instructions
                                    //         }
                                    //     </Instructions>
                                    <Instructions>
                                        {
                                            projectPage.instructions
                                        }
                                    </Instructions>
                                }

                            </Flex>
                            <Flex direction="column" width="100%"
                                height="100%" align="center">
                                <h4>Примечание</h4>
                                <Notes>
                                    {
                                        projectPage.notes
                                    }
                                </Notes>
                            </Flex>
                        </Flex>

                    </Flex>

                </Flex>
            </Card>
        </PageLayout>
    )
}