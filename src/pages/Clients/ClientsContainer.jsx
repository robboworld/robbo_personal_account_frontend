import React from "react"

import Clients from "../Clients"

import withFetchingData from "@/hoc/withFetchingData"
import { parentQuerysGQL } from "@/graphQL"

const ClientsContainer = () => {
    return (
        withFetchingData(
            <Clients />,
            parentQuerysGQL.GET_ALL_PARENTS,
            { page: '1', pageSize: '10' },
        )
    )
}

export default withFetchingData(
    <Clients />,
    parentQuerysGQL.GET_ALL_PARENTS,
    { page: '1', pageSize: '10' },
)