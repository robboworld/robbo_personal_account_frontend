import React from 'react'
import Select from 'react-select'
import { useDispatch } from 'react-redux'


import { SelectWrapper, CreateNew } from './componets'
import { createProjectPage } from '@/actions'

import Flex from '@/components/Flex'
import Button from '../UI/Button'

export default () => {

    const dispath = useDispatch()

    const options = [
        { value: 'last-modified', label: 'Последнее изменение' },
        { value: 'alphabet', label: 'A-Я' },
        { value: 'alphabet-reverse', label: 'Я-А' },
        { value: 'shared', label: ' Доступ' },
    ]

    const customStyles = {
        control: base => ({
            ...base,
            border: '1px solid grey',
            boxShadow: 'none',
        }),
        option: (base, state) => ({
            ...base,
            height: '100%',
            backgroundColor: state.isSelected ? "green" : "white",
            "&:hover": {
                backgroundColor: "green",
                color: "white",
            },
        }),

    }


    const token = localStorage.getItem('token')

    const createNewProjectPageHandler = () => {
        dispath(createProjectPage(token))
        window.location.replace('https://scratch.mit.edu/projects/703215105/')
    }

    return (
        <Flex width="100%" margin="0 0 2rem 0"
            justify="space-between" align="center">
            <SelectWrapper>
                <Select
                    styles={customStyles}
                    defaultValue={options[0]}
                    options={options}
                />
            </SelectWrapper>
            <CreateNew>
                <Button content="Создать новый"
                    background="grey"
                    padding="0.5rem"
                    handleSubmit={createNewProjectPageHandler} />
            </CreateNew>
        </Flex>
    )
}