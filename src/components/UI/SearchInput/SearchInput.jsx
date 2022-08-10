
import React, { useState } from "react"

import Flex from "@/components/Flex"
import { Input, Button } from "@/components/UI"

export default ({
    searchHandle,
}) => {

    const [searchInput, setSearchInput] = useState('')

    return (
        <Flex width='100%' justify='center'>
            <Input
                placeholder='Найти ребенка'
                value={searchInput}
                handleInput={input => setSearchInput(input)}
            />
            <Button
                content='Найти'
                padding='1rem'
                margin='0 0 0 1rem'
                handleSubmit={() => searchHandle(searchInput)}
            />
        </Flex>
    )
}