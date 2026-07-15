import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Modal, Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import styled from 'styled-components'

import { useActions } from '@/helpers'
import { changeLanguage } from '@/actions'
import { getAppState } from '@/reducers/app'
import theme from '@/theme'

const IconTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0.65rem;
  background: rgba(0, 175, 65, 0.1);
  color: ${theme.colors.secondary};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.22s ease,
    transform 0.18s ease;

  &:hover {
    background: rgba(0, 175, 65, 0.18);
    color: ${theme.colors.accentGreen};
  }

  &:active {
    transform: scale(0.96);
  }

  .anticon {
    font-size: 1.05rem;
  }
`

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.25rem;
`

const SelectLanguage = ({ variant = 'default' }) => {
    const intl = useIntl()
    const actions = useActions({ changeLanguage }, [])
    const { language } = useSelector(({ app }) => getAppState(app))
    const [open, setOpen] = useState(false)
    const languages = useMemo(() => ([
        { value: 'ru', label: intl.formatMessage({ id: 'header.lang_ru' }) },
        { value: 'en', label: intl.formatMessage({ id: 'header.lang_en' }) },
        { value: 'zh', label: intl.formatMessage({ id: 'header.lang_zh' }) },
    ]), [intl])

    if (variant === 'sidebar') {
        return (
            <React.Fragment>
                <IconTrigger
                    type='button'
                    aria-label={intl.formatMessage({ id: 'header.select_language' })}
                    onClick={() => setOpen(true)}
                >
                    <GlobalOutlined />
                </IconTrigger>
                <Modal
                    title={intl.formatMessage({ id: 'header.select_language' })}
                    open={open}
                    onCancel={() => setOpen(false)}
                    footer={null}
                    centered
                    destroyOnClose
                    width={360}
                    maskClosable
                    styles={{
                        mask: { background: 'rgba(24, 28, 32, 0.55)' },
                    }}
                >
                    <ModalBody>
                        <Select
                            style={{ width: '100%' }}
                            value={language}
                            options={languages}
                            onChange={value => {
                                actions.changeLanguage(value)
                                setOpen(false)
                            }}
                            size='large'
                        />
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, maxWidth: '100%' }}>
            <span style={{ color: '#fff', whiteSpace: 'nowrap', fontWeight: 600, fontSize: 15 }}>
                <FormattedMessage id='header.select_language' />
            </span>
            <Select
                style={{ width: 120 }}
                value={language}
                options={languages}
                onChange={value => actions.changeLanguage(value)}
            />
        </div>
    )
}

export default SelectLanguage
