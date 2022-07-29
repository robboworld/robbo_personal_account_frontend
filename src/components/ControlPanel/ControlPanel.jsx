import React from 'react'
import { useSelector } from 'react-redux'

import Flex from '@/components/Flex'
import { getNewProjectId } from '@/reducers/myProjects'
import config from '@/config'
import { useActions } from '@/helpers/useActions'
import { Select, Button } from '@/components/UI'

export default () => {

    const { createProjectPage } = useActions()
    const newProjectId = useSelector(state => getNewProjectId(state.myProjects))

    const options = [
        { value: 'last-modified', label: 'Последнее изменение' },
        { value: 'alphabet', label: 'A-Я' },
        { value: 'alphabet-reverse', label: 'Я-А' },
        { value: 'shared', label: ' Доступ' },
    ]



    const token = localStorage.getItem('token')

    if (newProjectId) {
        window.location.replace(config.scratchURL + '?#' + newProjectId)
    }

    return (
        <Flex width='100%' margin='0 0 2rem 0'
            justify='space-between' align='center'>
            <Select width='300px' options={options} />
            <Flex>
                <Button content='Создать новый'
                    background='grey'
                    padding='0.5rem'
                    handleSubmit={() => createProjectPage(token)} />
            </Flex>
        </Flex>
    )
}