import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Input, Form, Switch, Spin, message, Modal } from 'antd'
import { ArrowLeftOutlined, CloudDownloadOutlined, CloudUploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'

import {
    ActionButton,
    ActionsGroup,
    ActionsSection,
    AuthorText,
    BackButton,
    BackRow,
    LoadingWrap,
    MainGrid,
    MetaCard,
    MetaLabel,
    MetaRow,
    MetaValue,
    PageShell,
    PlayerCard,
    PrimaryAction,
    ProjectForm,
    ProjectTitle,
    ScratchAction,
    SectionTitle,
    UploadHint,
    ViewOnlyNote,
} from './styles'

import ScratchPlayerEmbed from '@/components/ScratchPlayerEmbed'
import { downloadProjectSb3, uploadProjectSb3 } from '@/api/projectPage'
import config from '@/config'
import { MY_PROJECTS_ROUTE, PUBLIC_PROJECTS_ROUTE } from '@/constants'
import { projectPageMutationGraphQL } from '@/graphQL/mutation/projectPage'
import { formatDateTime } from '@/helpers/formatDateTime'
import { useActions } from '@/helpers/useActions'
import { getProjectPageState } from '@/reducers/projectPage'
import {
    getProjectPageById,
    clearProjectPageState,
    updateProjectPage,
} from '@/actions'


const { TextArea } = Input
const { confirm } = Modal

export default () => {
    const intl = useIntl()
    const [downloadBusy, setDownloadBusy] = useState(false)
    const [uploadBusy, setUploadBusy] = useState(false)
    const [deleteBusy, setDeleteBusy] = useState(false)
    const [playerReloadKey, setPlayerReloadKey] = useState(0)
    const uploadInputRef = useRef(null)
    const navigate = useNavigate()
    const actions = useActions({
        getProjectPageById,
        clearProjectPageState,
        updateProjectPage,
    }, [])

    const [form] = Form.useForm()
    const { projectPageId } = useParams()
    const token = localStorage.getItem('token')
    const titleValue = Form.useWatch('title', form)

    useEffect(() => {
        actions.getProjectPageById(token, projectPageId)
        return () => {
            actions.clearProjectPageState()
        }
    }, [projectPageId, token])

    const { projectPage, playToken, loading } = useSelector(({ projectPage }) => getProjectPageState(projectPage))
    const isOwner = Boolean(projectPage?.isOwner)

    useEffect(() => {
        if (loading || !projectPage?.projectPageId) return
        form.setFieldsValue({
            title: projectPage.title,
            instruction: projectPage.instruction,
            notes: projectPage.notes,
            isShared: projectPage.isShared,
        })
    }, [
        loading,
        form,
        projectPage?.projectPageId,
        projectPage?.lastModified,
        projectPage?.title,
        projectPage?.instruction,
        projectPage?.notes,
        projectPage?.isShared,
    ])

    const seeInsideHandler = () => {
        window.open(`${config.scratchURL}?#${projectPage.projectId}`)
    }

    const handleDownloadSb3 = async () => {
        if (!token || !projectPageId) return
        setDownloadBusy(true)
        try {
            await downloadProjectSb3(token, projectPageId, projectPage?.title)
            message.success(intl.formatMessage({ id: 'project_page.download_sb3_success' }))
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'project_page.download_sb3_error' }))
        } finally {
            setDownloadBusy(false)
        }
    }

    const handleUploadSb3 = async event => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file || !token || !projectPageId) return
        if (!file.name.toLowerCase().endsWith('.sb3')) {
            message.error(intl.formatMessage({ id: 'project_page.upload_sb3_invalid' }))
            return
        }
        setUploadBusy(true)
        try {
            await uploadProjectSb3(token, projectPageId, file)
            message.success(intl.formatMessage({ id: 'project_page.upload_sb3_success' }))
            actions.getProjectPageById(token, projectPageId)
            setPlayerReloadKey(k => k + 1)
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'project_page.upload_sb3_error' }))
        } finally {
            setUploadBusy(false)
        }
    }

    const handleDeleteProject = () => {
        confirm({
            title: intl.formatMessage({ id: 'modal_window.delete_confirm' }),
            icon: <ExclamationCircleOutlined />,
            okText: intl.formatMessage({ id: 'modal_window.delete_confirm_ok' }),
            okType: 'danger',
            cancelText: intl.formatMessage({ id: 'modal_window.delete_confirm_cancel_text' }),
            async onOk() {
                setDeleteBusy(true)
                try {
                    await projectPageMutationGraphQL.deleteProjectPage(projectPageId)
                    message.success(intl.formatMessage({ id: 'notification.project_page_deleted_success' }))
                    navigate(MY_PROJECTS_ROUTE)
                } catch (e) {
                    message.error(e?.message || intl.formatMessage({ id: 'notification.error_message' }))
                } finally {
                    setDeleteBusy(false)
                }
            },
        })
    }

    const backTarget = isOwner ? MY_PROJECTS_ROUTE : PUBLIC_PROJECTS_ROUTE
    const displayTitle = titleValue || projectPage?.title || intl.formatMessage({ id: 'project_page.player_title' })

    return (
        <PageShell>
            <BackRow>
                <BackButton
                    type='default'
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(backTarget)}
                >
                    <FormattedMessage id={isOwner ? 'project_page.back_to_projects' : 'project_page.back_to_public'} />
                </BackButton>
                {projectPage?.authorName && (
                    <AuthorText>
                        <FormattedMessage
                            id='project_page.author_label'
                            values={{ name: projectPage.authorName }}
                        />
                    </AuthorText>
                )}
            </BackRow>
            {loading ? (
                <LoadingWrap><Spin /></LoadingWrap>
            ) : (
                <MainGrid>
                    <PlayerCard>
                        <ProjectTitle>{displayTitle}</ProjectTitle>
                        <ScratchPlayerEmbed
                            projectPageId={projectPageId}
                            playToken={playToken}
                            reloadKey={playerReloadKey}
                        />
                        {!isOwner && (
                            <ViewOnlyNote>
                                <FormattedMessage id='project_page.view_only' />
                            </ViewOnlyNote>
                        )}
                    </PlayerCard>
                    <MetaCard>
                        <SectionTitle>
                            <FormattedMessage id='project_page.meta_section' />
                        </SectionTitle>
                        <ProjectForm>
                            <Form
                                name='normal_project-page'
                                className='project-page-form'
                                layout='vertical'
                                form={form}
                                onFinish={({ title, instruction, notes, isShared }) => {
                                    actions.updateProjectPage(token, {
                                        projectPageId,
                                        projectId: projectPage.projectId,
                                        title,
                                        instruction,
                                        notes,
                                        isShared,
                                    })
                                }}
                            >
                                <Form.Item
                                    name='title'
                                    label={<FormattedMessage id='project_page.title' />}
                                >
                                    <Input size='large' readOnly={!isOwner} />
                                </Form.Item>
                                <Form.Item
                                    name='instruction'
                                    label={<FormattedMessage id='project_page.instruction' />}
                                >
                                    <TextArea size='large' rows={4}
readOnly={!isOwner} />
                                </Form.Item>
                                <Form.Item
                                    name='notes'
                                    label={<FormattedMessage id='project_page.description' />}
                                >
                                    <TextArea size='large' rows={4}
readOnly={!isOwner} />
                                </Form.Item>
                                <MetaRow>
                                    <MetaLabel>
                                        <FormattedMessage id='project_page.last_change' />
                                    </MetaLabel>
                                    <MetaValue>
                                        {formatDateTime(projectPage.lastModified, intl.locale)}
                                    </MetaValue>
                                </MetaRow>
                                {isOwner && (
                                    <Form.Item
                                        name='isShared'
                                        label={<FormattedMessage id='project_page.shared_access' />}
                                        valuePropName='checked'
                                    >
                                        <Switch />
                                    </Form.Item>
                                )}
                                <ActionsSection>
                                    <MetaLabel style={{ marginBottom: '0.65rem' }}>
                                        <FormattedMessage id='project_page.actions_group' />
                                    </MetaLabel>
                                    <ActionsGroup>
                                        {isOwner && (
                                            <PrimaryAction type='primary' htmlType='submit'>
                                                <FormattedMessage id='project_page.save' />
                                            </PrimaryAction>
                                        )}
                                        {isOwner && (
                                            <React.Fragment>
                                                <input
                                                    ref={uploadInputRef}
                                                    type='file'
                                                    accept='.sb3,application/x.scratch.sb3'
                                                    style={{ display: 'none' }}
                                                    onChange={handleUploadSb3}
                                                />
                                                <ActionButton
                                                    type='default'
                                                    icon={<CloudUploadOutlined />}
                                                    loading={uploadBusy}
                                                    onClick={() => uploadInputRef.current?.click()}
                                                >
                                                    <FormattedMessage id='project_page.upload_sb3' />
                                                </ActionButton>
                                            </React.Fragment>
                                        )}
                                        {isOwner && (
                                            <ScratchAction type='primary' onClick={seeInsideHandler}>
                                                <FormattedMessage id='project_page.open_in_scratch' />
                                            </ScratchAction>
                                        )}
                                        <ActionButton
                                            type='default'
                                            htmlType='button'
                                            icon={<CloudDownloadOutlined />}
                                            loading={downloadBusy}
                                            onClick={handleDownloadSb3}
                                        >
                                            <FormattedMessage id='project_page.download_sb3' />
                                        </ActionButton>
                                        {isOwner && (
                                            <ActionButton
                                                type='default'
                                                danger
                                                htmlType='button'
                                                loading={deleteBusy}
                                                onClick={handleDeleteProject}
                                            >
                                                <FormattedMessage id='project_page.delete' />
                                            </ActionButton>
                                        )}
                                    </ActionsGroup>
                                    {isOwner && (
                                        <UploadHint>
                                            <FormattedMessage id='project_page.upload_sb3_hint' />
                                        </UploadHint>
                                    )}
                                </ActionsSection>
                            </Form>
                        </ProjectForm>
                    </MetaCard>
                </MainGrid>
            )}
        </PageShell>
    )
}
