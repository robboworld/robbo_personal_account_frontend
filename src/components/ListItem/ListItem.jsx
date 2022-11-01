import React, { useState } from 'react'
import { PropTypes } from "prop-types"

import { StyledListItem, DeleteButton, Title, IconsWrapper, IconDiv, IconSVG } from './components'

import { ModalWindow } from '@/components/UI'
import ConfirmModal from '@/components/ConfirmModal'

const ListItem = ({
    itemIndex,
    label,
    handleClick,
    handleDelete,
    render,
    additionalIcons,
}) => {
    const [contentOpen, setContentOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    return (
        <StyledListItem onClick={handleClick}>
            <ModalWindow
                open={confirmOpen} setOpen={setConfirmOpen}
                width='35%' height='25%'
                content={() => (
                    <ConfirmModal
                        yesHandle={() => handleDelete(itemIndex)}
                        canselHandle={() => setConfirmOpen(false)}
                        message='Вы точно хотите удалить?'
                    />
                )}
            />
            <Title onClick={() => setContentOpen(true)}> {label}</Title>

            <IconsWrapper>
                {
                    additionalIcons?.map((additionalIcon, index) => (
                        <IconDiv tabIndex={index} key={index}>
                            <IconSVG>
                                {additionalIcon.icon}
                            </IconSVG>
                            {additionalIcon.iconLabel}
                        </IconDiv>

                    ))
                }
            </IconsWrapper>

            {
                handleDelete &&
                <DeleteButton onClick={e => {
                    e.stopPropagation()
                    setConfirmOpen(true)
                }}>
                    ×
                </DeleteButton>
            }
            {
                render(contentOpen, setContentOpen)
            }
        </StyledListItem>
    )
}

ListItem.propTypes = {
    itemIndex: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    handleClick: PropTypes.func,
    handleDelete: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
    ]),
    render: PropTypes.func,
    additionalIcons: PropTypes.arrayOf(
        PropTypes.PropTypes.shape({
            iconLabel: PropTypes.string,
            renderContent: PropTypes.func,
            icon: PropTypes.element,
            handler: PropTypes.func,
        })),
}

export default ListItem