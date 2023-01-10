import React, { memo } from "react"
import styled from 'styled-components'
import { PropTypes } from 'prop-types'

import Flex from "@/components/Flex"
import RobboGroupForm from "@/components/RobboGroupForm"
import { useActions } from "@/helpers/useActions"
import { createRobboGroupRequest } from '@/actions'

const AddStudentGroup = memo(({ robboUnitId }) => {
    const actions = useActions({ createRobboGroupRequest }, [])
    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Добавление Robbo Group</Text>
            <RobboGroupForm
                margin='0 0 10px 0'
                handleSubmit={robboGroup => actions.createRobboGroupRequest(String(robboUnitId), robboGroup)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Flex>
    )
})

const Text = styled.p`
  font-size: 1.5rem;
  margin-bottom: 10px;
`

AddStudentGroup.propTypes = {
    robboUnitId: PropTypes.string.isRequired,
}

export default AddStudentGroup