import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { Input, Form, Switch, Spin, message, Modal, InputNumber, Space, Button } from 'antd'
import { ArrowLeftOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, ExclamationCircleOutlined, PictureOutlined, PushpinOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'
import { createGlobalStyle } from 'styled-components'

import {
    ActionButton,
    ActionsGroup,
    ActionsSection,
    AuthorText,
    BackButton,
    BackRow,
    GuestMainGrid,
    GuestMetaBlock,
    GuestMetaSection,
    GuestMetaText,
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
    ViewOnlyNote,
} from './styles'

import PlayerScratchControls from './PlayerScratchControls'
import ProjectReactions from './ProjectReactions'

import ScratchPlayerEmbed from '@/components/ScratchPlayerEmbed'
import PageLayout from '@/components/PageLayout'
import RobboGuestHeader from '@/components/RobboGuestHeader/RobboGuestHeader'
import RobboSiteFooter from '@/components/RobboSiteFooter/RobboSiteFooter'
import {
    downloadProjectSb3,
    downloadProjectSb3ByPlayToken,
    moderateDeleteProjectPage,
    projectPageAPI,
    setLandingFeatured,
    tryRefreshAccessToken,
    uploadProjectPreview,
    uploadProjectSb3,
} from '@/api/projectPage'
import config from '@/config'
import { LANDING_PAGE_ROUTE, MY_PROJECTS_ROUTE, PUBLIC_PROJECTS_ROUTE, SUPER_ADMIN } from '@/constants'
import { projectPageMutationGraphQL } from '@/graphQL/mutation/projectPage'
import { formatDateTime } from '@/helpers/formatDateTime'
import { RequireAuth, fetchOidcStatus, isAccessTokenExpired, isOidcSsoEnabled, useAuthRole } from '@/helpers'
import { useActions } from '@/helpers/useActions'
import { displayProjectTitle } from '@/helpers/intl'
import Loader from '@/components/Loader'
import { getProjectPageState } from '@/reducers/projectPage'
import {
    getProjectPageById,
    clearProjectPageState,
    updateProjectPage,
} from '@/actions'
import RobboGuestFonts from '@/theme/robboGuestFonts'
import robboGuestTokens from '@/theme/robboGuestTokens'


const { TextArea } = Input
const { confirm } = Modal

const GuestGlobal = createGlobalStyle`
  html.guest-project-page-active,
  html.guest-project-page-active body,
  html.guest-project-page-active #root {
    min-height: 100dvh;
    background: ${robboGuestTokens.pageBg} !important;
    background-image: none !important;
  }
`

function normalizeGuestProjectPage(raw) {
    if (!raw) return {}
    return {
        ...raw,
        projectPageId: raw.projectPageId || raw.projectPageID,
        projectId: raw.projectId || raw.projectID,
        authorUserId: raw.authorUserId || raw.authorUserID || '',
        authorName: raw.authorName || raw.authorUserID || '',
        isOwner: false,
    }
}

function GuestProjectView({ projectPageId }) {
    const intl = useIntl()
    const navigate = useNavigate()
    const playerRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [projectPage, setProjectPage] = useState(null)
    const [playToken, setPlayToken] = useState(null)
    const [isPlayerRunning, setIsPlayerRunning] = useState(false)
    const [downloadBusy, setDownloadBusy] = useState(false)

    useEffect(() => {
        document.documentElement.classList.add('guest-project-page-active')
        return () => {
            document.documentElement.classList.remove('guest-project-page-active')
        }
    }, [])

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError('')
        projectPageAPI.fetchProjectPageById(projectPageId)
            .then(data => {
                if (cancelled) return
                setProjectPage(normalizeGuestProjectPage(data?.projectPage))
                setPlayToken(data?.playToken || null)
            })
            .catch(e => {
                if (cancelled) return
                setError(e?.message || intl.formatMessage({ id: 'project_page.player_error' }))
                setProjectPage(null)
                setPlayToken(null)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [projectPageId, intl])

    const displayTitle = projectPage?.title || intl.formatMessage({ id: 'project_page.player_title' })
    const instruction = (projectPage?.instruction || '').trim()
    const notes = (projectPage?.notes || '').trim()

    const handleDownloadSb3 = async () => {
        if (!playToken) {
            message.error(intl.formatMessage({ id: 'project_page.download_sb3_error' }))
            return
        }
        setDownloadBusy(true)
        try {
            await downloadProjectSb3ByPlayToken(playToken, projectPageId, projectPage?.title)
            message.success(intl.formatMessage({ id: 'project_page.download_sb3_success' }))
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'project_page.download_sb3_error' }))
        } finally {
            setDownloadBusy(false)
        }
    }

    return (
        <React.Fragment>
            <RobboGuestFonts />
            <GuestGlobal />
            <RobboGuestHeader />
            <main id='content' style={{ flex: 1, width: '100%' }}>
                <PageShell>
                    <BackRow>
                        <BackButton
                            type='default'
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(LANDING_PAGE_ROUTE)}
                        >
                            На главную
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
                    ) : error ? (
                        <PlayerCard>
                            <ProjectTitle>{intl.formatMessage({ id: 'project_page.player_error' })}</ProjectTitle>
                            <ViewOnlyNote>{error}</ViewOnlyNote>
                            <div style={{ marginTop: '1rem' }}>
                                <Link to={LANDING_PAGE_ROUTE}>Вернуться на лендинг</Link>
                            </div>
                        </PlayerCard>
                    ) : (
                        <GuestMainGrid>
                            <PlayerCard>
                                <ScratchPlayerEmbed
                                    ref={playerRef}
                                    projectPageId={projectPageId}
                                    playToken={playToken}
                                    onRunningChange={setIsPlayerRunning}
                                />
                                <PlayerScratchControls
                                    running={isPlayerRunning}
                                    onGreenFlag={() => playerRef.current?.sendCommand('scratch:greenFlag')}
                                    onStopAll={() => playerRef.current?.sendCommand('scratch:stopAll')}
                                />
                                <ProjectReactions projectPageId={projectPageId} />
                            </PlayerCard>
                            <MetaCard>
                                <ProjectTitle>{displayTitle}</ProjectTitle>
                                {(instruction || notes) ? (
                                    <GuestMetaBlock style={{ marginTop: 0 }}>
                                        {instruction ? (
                                            <GuestMetaSection>
                                                <MetaLabel>
                                                    <FormattedMessage id='project_page.instruction' />
                                                </MetaLabel>
                                                <GuestMetaText>{instruction}</GuestMetaText>
                                            </GuestMetaSection>
                                        ) : null}
                                        {notes ? (
                                            <GuestMetaSection>
                                                <MetaLabel>
                                                    <FormattedMessage id='project_page.description' />
                                                </MetaLabel>
                                                <GuestMetaText>{notes}</GuestMetaText>
                                            </GuestMetaSection>
                                        ) : null}
                                    </GuestMetaBlock>
                                ) : null}
                                <ActionsGroup style={{ marginTop: '1rem' }}>
                                    <ActionButton
                                        type='default'
                                        htmlType='button'
                                        icon={<CloudDownloadOutlined />}
                                        loading={downloadBusy}
                                        disabled={!playToken}
                                        onClick={handleDownloadSb3}
                                    >
                                        <FormattedMessage id='project_page.download_sb3' />
                                    </ActionButton>
                                </ActionsGroup>
                                <ViewOnlyNote>
                                    <FormattedMessage id='project_page.view_only' />
                                </ViewOnlyNote>
                            </MetaCard>
                        </GuestMainGrid>
                    )}
                </PageShell>
            </main>
            <RobboSiteFooter />
        </React.Fragment>
    )
}

function AuthenticatedProjectView({ projectPageId, token }) {
    const intl = useIntl()
    const authRole = useAuthRole()
    const isSuperAdmin = Number(authRole) === SUPER_ADMIN
    const [downloadBusy, setDownloadBusy] = useState(false)
    const [uploadBusy, setUploadBusy] = useState(false)
    const [previewBusy, setPreviewBusy] = useState(false)
    const [deleteBusy, setDeleteBusy] = useState(false)
    const [playerReloadKey, setPlayerReloadKey] = useState(0)
    const [isPlayerRunning, setIsPlayerRunning] = useState(false)
    const [moderateOpen, setModerateOpen] = useState(false)
    const [moderateReason, setModerateReason] = useState('')
    const [moderateBusy, setModerateBusy] = useState(false)
    const [featureOpen, setFeatureOpen] = useState(false)
    const [featureOrder, setFeatureOrder] = useState(1)
    const [featureBusy, setFeatureBusy] = useState(false)
    const [landingFeatured, setLandingFeaturedLocal] = useState(false)
    const [landingSortOrder, setLandingSortOrderLocal] = useState(0)
    const uploadInputRef = useRef(null)
    const previewInputRef = useRef(null)
    const playerRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    const actions = useActions({
        getProjectPageById,
        clearProjectPageState,
        updateProjectPage,
    }, [])

    const [form] = Form.useForm()
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
        if (!projectPage) {
            return
        }
        setLandingFeaturedLocal(Boolean(projectPage.landingFeatured))
        setLandingSortOrderLocal(Number(projectPage.landingSortOrder) || 0)
    }, [projectPage?.projectPageId, projectPage?.landingFeatured, projectPage?.landingSortOrder])

    useEffect(() => {
        if (loading || !projectPage?.projectPageId) return

        const selectedNavBarKey = isOwner ? '2' : 'public_projects'
        if (location.state?.selectedNavBarKey === selectedNavBarKey) return

        navigate(location.pathname, {
            replace: true,
            state: {
                ...location.state,
                selectedNavBarKey,
            },
        })
    }, [
        isOwner,
        loading,
        location.pathname,
        location.state,
        navigate,
        projectPage?.projectPageId,
    ])

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

    const handleUploadPreview = async event => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file || !token || !projectPageId) return
        setPreviewBusy(true)
        try {
            await uploadProjectPreview(token, projectPageId, file)
            message.success('Превью проекта обновлено')
            actions.getProjectPageById(token, projectPageId)
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'notification.error_message' }))
        } finally {
            setPreviewBusy(false)
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

    const confirmModerateDelete = async () => {
        const reason = moderateReason.trim()
        if (reason.length < 3) {
            message.warning(intl.formatMessage({ id: 'project_page.moderate_reason_required' }))
            return
        }
        setModerateBusy(true)
        try {
            await moderateDeleteProjectPage(projectPageId, reason)
            message.success(intl.formatMessage({ id: 'project_page.moderate_delete_ok' }))
            setModerateOpen(false)
            setModerateReason('')
            navigate(PUBLIC_PROJECTS_ROUTE)
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'project_page.moderate_delete_error' }))
        } finally {
            setModerateBusy(false)
        }
    }

    const confirmAddToLanding = async () => {
        setFeatureBusy(true)
        try {
            const data = await setLandingFeatured(projectPageId, {
                featured: true,
                sortOrder: Number(featureOrder) || 1,
            })
            setLandingFeaturedLocal(data?.projectPage?.landingFeatured ?? true)
            setLandingSortOrderLocal(data?.projectPage?.landingSortOrder ?? (Number(featureOrder) || 1))
            message.success(intl.formatMessage({ id: 'project_page.landing_add_ok' }))
            setFeatureOpen(false)
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'project_page.landing_error' }))
        } finally {
            setFeatureBusy(false)
        }
    }

    const removeFromLanding = async () => {
        setFeatureBusy(true)
        try {
            await setLandingFeatured(projectPageId, { featured: false, sortOrder: 0 })
            setLandingFeaturedLocal(false)
            setLandingSortOrderLocal(0)
            message.success(intl.formatMessage({ id: 'project_page.landing_remove_ok' }))
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'project_page.landing_error' }))
        } finally {
            setFeatureBusy(false)
        }
    }

    const saveLandingOrder = async () => {
        setFeatureBusy(true)
        try {
            const data = await setLandingFeatured(projectPageId, {
                featured: true,
                sortOrder: Number(landingSortOrder) || 0,
            })
            setLandingSortOrderLocal(data?.projectPage?.landingSortOrder ?? (Number(landingSortOrder) || 0))
            message.success(intl.formatMessage({ id: 'project_page.landing_order_ok' }))
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'project_page.landing_error' }))
        } finally {
            setFeatureBusy(false)
        }
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
                            ref={playerRef}
                            projectPageId={projectPageId}
                            playToken={playToken}
                            reloadKey={playerReloadKey}
                            onRunningChange={setIsPlayerRunning}
                        />
                        <PlayerScratchControls
                            running={isPlayerRunning}
                            onGreenFlag={() => playerRef.current?.sendCommand('scratch:greenFlag')}
                            onStopAll={() => playerRef.current?.sendCommand('scratch:stopAll')}
                        />
                        <ProjectReactions projectPageId={projectPageId} interactive />
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
                                            <React.Fragment>
                                                <input
                                                    ref={previewInputRef}
                                                    type='file'
                                                    accept='image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp'
                                                    style={{ display: 'none' }}
                                                    onChange={handleUploadPreview}
                                                />
                                                <ActionButton
                                                    type='default'
                                                    icon={<PictureOutlined />}
                                                    loading={previewBusy}
                                                    onClick={() => previewInputRef.current?.click()}
                                                >
                                                    Загрузить превью
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
                                        {isSuperAdmin && (
                                            <React.Fragment>
                                                {landingFeatured ? (
                                                    <Space wrap size={8}
style={{ width: '100%' }}>
                                                        <InputNumber
                                                            min={0}
                                                            value={landingSortOrder}
                                                            onChange={value => setLandingSortOrderLocal(value)}
                                                            aria-label={intl.formatMessage({ id: 'project_page.landing_order_label' })}
                                                        />
                                                        <Button
                                                            loading={featureBusy}
                                                            onClick={saveLandingOrder}
                                                        >
                                                            <FormattedMessage id='project_page.landing_order_save' />
                                                        </Button>
                                                        <Button
                                                            loading={featureBusy}
                                                            onClick={removeFromLanding}
                                                        >
                                                            <FormattedMessage id='project_page.landing_remove' />
                                                        </Button>
                                                    </Space>
                                                ) : (
                                                    <ActionButton
                                                        type='default'
                                                        icon={<PushpinOutlined />}
                                                        onClick={() => {
                                                            setFeatureOrder((landingSortOrder || 0) + 1 || 1)
                                                            setFeatureOpen(true)
                                                        }}
                                                    >
                                                        <FormattedMessage id='project_page.landing_add' />
                                                    </ActionButton>
                                                )}
                                                <ActionButton
                                                    type='default'
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        setModerateReason('')
                                                        setModerateOpen(true)
                                                    }}
                                                >
                                                    <FormattedMessage id='project_page.moderate_delete' />
                                                </ActionButton>
                                            </React.Fragment>
                                        )}
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
                                </ActionsSection>
                            </Form>
                        </ProjectForm>
                    </MetaCard>
                </MainGrid>
            )}
            <Modal
                open={moderateOpen}
                title={intl.formatMessage({ id: 'project_page.moderate_delete_title' })}
                okText={intl.formatMessage({ id: 'project_page.moderate_delete_confirm' })}
                cancelText={intl.formatMessage({ id: 'project_page.moderate_cancel' })}
                okButtonProps={{ danger: true, loading: moderateBusy, disabled: moderateReason.trim().length < 3 }}
                onOk={confirmModerateDelete}
                onCancel={() => !moderateBusy && setModerateOpen(false)}
                destroyOnClose
            >
                <p>
                    <FormattedMessage
                        id='project_page.moderate_delete_body'
                        values={{ title: displayProjectTitle(projectPage?.title, intl) }}
                    />
                </p>
                <TextArea
                    rows={4}
                    value={moderateReason}
                    onChange={e => setModerateReason(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'project_page.moderate_reason_placeholder' })}
                />
            </Modal>
            <Modal
                open={featureOpen}
                title={intl.formatMessage({ id: 'project_page.landing_add_title' })}
                okText={intl.formatMessage({ id: 'project_page.landing_add_confirm' })}
                cancelText={intl.formatMessage({ id: 'project_page.moderate_cancel' })}
                okButtonProps={{ loading: featureBusy }}
                onOk={confirmAddToLanding}
                onCancel={() => !featureBusy && setFeatureOpen(false)}
                destroyOnClose
            >
                <p>
                    <FormattedMessage
                        id='project_page.landing_add_body'
                        values={{ title: displayProjectTitle(projectPage?.title, intl) }}
                    />
                </p>
                <label htmlFor='project-landing-sort-order'>
                    <FormattedMessage id='project_page.landing_order_label' />
                </label>
                <InputNumber
                    id='project-landing-sort-order'
                    style={{ width: '100%', marginTop: 8 }}
                    min={0}
                    value={featureOrder}
                    onChange={value => setFeatureOrder(value)}
                />
            </Modal>
        </PageShell>
    )
}

function readStoredAccessToken() {
    const token = localStorage.getItem('token')
    if (!token || token === 'null') {
        return null
    }
    if (isAccessTokenExpired(token)) {
        return null
    }
    return token
}

/**
 * Soft session probe: JWT and/or OIDC BFF cookie.
 * Does not use OidcSessionProvider (that redirects unauthenticated users to login).
 */
export default () => {
    const { projectPageId } = useParams()
    const [probe, setProbe] = useState({ status: 'loading', token: null })

    useEffect(() => {
        let cancelled = false

        const run = async () => {
            let token = readStoredAccessToken()
            if (token) {
                if (!cancelled) {
                    setProbe({ status: 'auth', token })
                }
                return
            }

            token = await tryRefreshAccessToken()
            if (token) {
                if (!cancelled) {
                    setProbe({ status: 'auth', token })
                }
                return
            }

            if (isOidcSsoEnabled()) {
                try {
                    const status = await fetchOidcStatus()
                    if (status?.authenticated) {
                        token = await tryRefreshAccessToken()
                        if (!cancelled) {
                            setProbe({ status: 'auth', token: token || '' })
                        }
                        return
                    }
                } catch (_) {
                    // fall through to guest
                }
            }

            if (!cancelled) {
                setProbe({ status: 'guest', token: null })
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [projectPageId])

    if (probe.status === 'loading') {
        return <Loader />
    }

    if (probe.status === 'guest') {
        return <GuestProjectView projectPageId={projectPageId} />
    }

    return (
        <RequireAuth>
            <PageLayout>
                <AuthenticatedProjectView projectPageId={projectPageId} token={probe.token} />
            </PageLayout>
        </RequireAuth>
    )
}
