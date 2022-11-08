import React, { useState } from 'react'
import { PropTypes } from 'prop-types'

import { StyledListItem, DeleteButton, Title, IconsWrapper, IconDiv, IconSVG } from './components'

import ConfirmModal from '@/components/ConfirmModal'
import { DragResize } from '@/components/UI'

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
    const [additionalContentOpen, setAdditionalContentOpen] = useState(false)

    return (
        <StyledListItem onClick={handleClick}>
            <DragResize
                open={confirmOpen} setOpen={setConfirmOpen}
                width='40%' height='40%'
                content={() => (
                    // refactor confirm modal from lib
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
                        <IconDiv
                            tabIndex={index} key={index}
                            onClick={() => setAdditionalContentOpen(!additionalContentOpen)}
                        >
                            <IconSVG>
                                {additionalIcon.icon}
                            </IconSVG>
                            {additionalIcon.iconLabel}
                            {
                                additionalIcon?.renderContent(additionalContentOpen, setAdditionalContentOpen)
                            }
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