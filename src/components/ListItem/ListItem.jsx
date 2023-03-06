import React, { useState } from 'react'
import { useIntl } from 'react-intl'
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
    const intl = useIntl()
    const [contentOpen, setContentOpen] = useState(false)
    const [additionalContentOpen, setAdditionalContentOpen] = useState(false)

    const showDeleteConfirm = () => {
        confirm({
            title: intl.formatMessage({ id: 'modal_window.delete_confirm' }),
            icon: <ExclamationCircleOutlined />,
            okText: intl.formatMessage({ id: 'modal_window.delete_confirm_ok' }),
            okType: 'danger',
            cancelText: intl.formatMessage({ id: 'modal_window.delete_confirm_cancel_text' }),
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