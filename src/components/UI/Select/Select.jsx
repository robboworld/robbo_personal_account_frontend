import React from 'react'
import Select from 'react-select'

import { SelectWrapper } from './components'

const customStyles = {
    control: base => ({
        ...base,
        border: '1px solid grey',
        boxShadow: 'none',
    }),
    option: (base, state) => ({
        ...base,
        height: '100%',
        backgroundColor: state.isSelected ? 'green' : 'white',
        '&:hover': {
            backgroundColor: 'green',
            color: 'white',
        },
    }),

}

export default function CustomSelect({ options, onChange, value }) {
    return (<SelectWrapper>
        <Select
            styles={customStyles}
            options={options}
            onChange={onChange}
            value={value}
        />
            </SelectWrapper>)

}