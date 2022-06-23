import React, { useState, useEffect } from "react";


import { PageLayout, Card } from "@/layouts";
import { MainContainer, WelcomeText, HardcoreLink } from "./components";
import SideBar from "@/components/SideBar";

export default () => {
    return (
        <PageLayout>
            <Card>
                <SideBar />
                <MainContainer>
                    <WelcomeText>Cсылка на Mvp</WelcomeText>
                    <HardcoreLink href="http://0.0.0.0:8601/">Ссылка</HardcoreLink>
                </MainContainer>
            </Card>
        </PageLayout>
    )
}