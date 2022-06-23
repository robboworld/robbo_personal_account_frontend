import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { PageLayout, Card } from "@/layouts";
import { WelcomeText, HardcoreLink, ProjectStage, UnsharedMessage, Title, Instructions, Notes } from "./components";
import SideBar from "@/components/SideBar";
import Flex from "@/components/Flex";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { getProjectPageById } from "@/actions";
import { useSelector } from "react-redux";
import { getProjectPage } from "@/reducers/projectPage";


export default (props) => {
    const dispath = useDispatch()
    const [editMode, setEditMode] = useState(false)
    const projectPageId = props.match.params.projectPageId;

    useEffect(() => {
        // dispath(getProjectPageById(token))
    }, [])

    const projectPage = useSelector((state) => getProjectPage(state.projectPage))

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex direction={"column"} align={"flex-start"} width={"100%"} height={"100%"} padding={"2rem"}>
                    {/* если проект !isShared */}
                    <UnsharedMessage>
                        <Flex align={"center"} width={"100%"} height={"100%"} justify={"space-between"} >
                            <span>Данный проект не открыт для общего доступа</span>
                            <Button content={"Открыть доступ"} background={"#ff8c1a"} padding={"0.5rem"} />
                        </Flex>
                    </UnsharedMessage>
                    <Flex align={"center"} width={"100%"} justify={"space-between"}>
                        {editMode ?
                            < Input onBlur={() => { setEditMode(false) }} placeholder={"Title"} value={projectPage.title} width={"50%"} height={"4rem"} fontSize={"3rem"} />
                            :
                            <Title onClick={() => { setEditMode(true) }}>
                                <span>{projectPage.title}</span>
                            </Title>

                        }
                        <Button content={"Открыть в Scratch"} background={"grey"} margin={"1rem"} padding={"0.5rem"} />
                    </Flex>
                    <Flex column={"row"} justify={"space-between"} width={"100%"} height={"41%"} padding={"2rem 0"}>
                        <ProjectStage />
                        <Flex direction={"column"} width={"100%"} height={"100%"}>
                            <Flex direction={"column"} width={"100%"} height={"100%"} align={"center"}>
                                <h4>Инструкция</h4>
                                <Instructions>
                                    {
                                        projectPage.instructions
                                    }
                                </Instructions>
                            </Flex>
                            <Flex direction={"column"} width={"100%"} height={"100%"} align={"center"}>
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