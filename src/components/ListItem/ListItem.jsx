import React, { useState } from 'react'
import { PropTypes } from 'prop-types'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'

import { StyledListItem, DeleteButton, Title, IconsWrapper, IconDiv, IconSVG } from './components'

const { confirm } = Modal

const ListItem = ({
    itemIndex,
    label,
    handleClick,
    handleDelete,
    render,
    additionalIcons,
}) => {
    const [contentOpen, setContentOpen] = useState(false)
    const [additionalContentOpen, setAdditionalContentOpen] = useState(false)

    const showDeleteConfirm = () => {
        confirm({
            title: 'Вы точно хотите удалить?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk() {
                handleDelete(itemIndex)
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    return (
        <StyledListItem >
            <Title onClick={handleClick || (() => setContentOpen(true))}> {label}</Title>

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
                <DeleteButton onClick={showDeleteConfirm}>
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