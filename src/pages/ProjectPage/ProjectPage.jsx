import React, { useState, useEffect } from "react";


import { PageLayout } from "@/layouts";
import { Card, MainContainer, WelcomeText } from "./components";
import SideBar from "@/components/SideBar";

export default () => {
    return (
        <PageLayout>
            <Card>
                <SideBar />
                <MainContainer>
                    <WelcomeText>Мои проекты</WelcomeText>
                </MainContainer>
            </Card>
        </PageLayout>
    )
}