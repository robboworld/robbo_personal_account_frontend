import React, { useEffect, useState } from "react"

import { ProjectPageItem, ScratchLink, Description } from './components'

export default ({ projectPage }) => {
    return (
        <ProjectPageItem>
            <ScratchLink href={projectPage.linkScratch}> {projectPage.title}</ScratchLink>
        </ProjectPageItem>
    )
}