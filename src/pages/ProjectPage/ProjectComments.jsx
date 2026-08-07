import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, message } from 'antd'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import {
    deleteProjectComment,
    fetchProjectComments,
    postProjectComment,
    putCommentReaction,
} from '@/api/projectPage'
import { formatDateTime } from '@/helpers/formatDateTime'
import theme from '@/theme'

const Section = styled.section`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(87, 94, 117, 0.12);
`

const Heading = styled.h2`
  margin: 0 0 0.75rem;
  color: rgba(87, 94, 117, 0.9);
  font-size: 0.875rem;
  font-weight: 600;
`

const CommentList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li > & {
    margin-top: 1.1rem;
  }
`

const CommentItem = styled.li`
  margin: 0 0 1.4rem;
  padding-left: ${props => (props.$depth > 0 ? '0.85rem' : '0')};
  border-left: ${props => (props.$depth > 0
        ? '2px solid rgba(87, 94, 117, 0.12)'
        : 'none')};

  &:last-child {
    margin-bottom: 0;
  }
`

const Author = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  margin-bottom: 0.25rem;
`

const AuthorName = styled.span`
  font-weight: 600;
  font-size: 0.8125rem;
  color: #383838;
`

const Meta = styled.span`
  font-size: 0.75rem;
  color: rgba(87, 94, 117, 0.65);
`

const Body = styled.p`
  margin: 0 0 0.4rem;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.875rem;
  color: #383838;
  line-height: 1.45;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
`

const VoteBtn = styled.button`
  min-height: 1.75rem;
  padding: 0.15rem 0.45rem;
  border: 1px solid ${props => (props.$selected
        ? theme.colors.accentGreen
        : 'rgba(87, 94, 117, 0.16)')};
  border-radius: 6px;
  background: ${props => (props.$selected
        ? 'rgba(0, 175, 65, 0.12)'
        : 'rgba(255, 255, 255, 0.78)')};
  color: #383838;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;

  &:hover:not(:disabled),
  &:focus-visible {
    border-color: ${theme.colors.accentGreen};
    outline: none;
  }
`

const Composer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const Status = styled.p`
  margin: 0;
  color: rgba(87, 94, 117, 0.72);
  font-size: 0.8125rem;
`

function displayAuthor(author) {
    return (author?.fullName || author?.nickname || author?.id || '—').trim()
}

function CommentNode({
    comment,
    depth,
    interactive,
    canModerate,
    currentUserId,
    projectPageId,
    onReload,
    busyId,
    setBusyId,
}) {
    const intl = useIntl()
    const [replyOpen, setReplyOpen] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [posting, setPosting] = useState(false)

    const my = comment.reactions?.myReaction || null
    const likes = comment.reactions?.likes || 0
    const dislikes = comment.reactions?.dislikes || 0
    const isAuthor = currentUserId && comment.author?.id === currentUserId
    const canDelete = interactive && (isAuthor || canModerate)

    const onVote = async code => {
        if (!interactive || busyId) {
            return
        }
        setBusyId(comment.id)
        try {
            await putCommentReaction(projectPageId, comment.id, code)
            await onReload()
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'comments.reaction_error' }))
        } finally {
            setBusyId('')
        }
    }

    const onDelete = async () => {
        if (!canDelete || busyId) {
            return
        }
        setBusyId(comment.id)
        try {
            await deleteProjectComment(projectPageId, comment.id)
            await onReload()
        } catch (e) {
            message.error(e?.message || intl.formatMessage({ id: 'comments.delete_error' }))
        } finally {
            setBusyId('')
        }
    }

    const onReply = async () => {
        const body = replyText.trim()
        if (!body || posting) {
            return
        }
        setPosting(true)
        try {
            await postProjectComment(projectPageId, { body, parentId: comment.id })
            setReplyText('')
            setReplyOpen(false)
            await onReload()
        } catch (e) {
            if (e?.code === 'profanity_detected' || String(e?.message).includes('profanity_detected')) {
                message.error(intl.formatMessage({ id: 'comments.profanity_error' }))
            } else {
                message.error(e?.message || intl.formatMessage({ id: 'comments.post_error' }))
            }
        } finally {
            setPosting(false)
        }
    }

    return (
        <CommentItem $depth={depth}>
            <Author>
                <AuthorName>{displayAuthor(comment.author)}</AuthorName>
                {comment.createdAt ? (
                    <Meta>{formatDateTime(comment.createdAt, intl.locale)}</Meta>
                ) : null}
            </Author>
            <Body>{comment.body}</Body>
            <Actions>
                {interactive ? (
                    <React.Fragment>
                        <VoteBtn
                            type='button'
                            $selected={my === 'like'}
                            disabled={Boolean(busyId)}
                            onClick={() => onVote('like')}
                            aria-label={intl.formatMessage({ id: 'comments.like' })}
                        >
                            👍 {likes}
                        </VoteBtn>
                        <VoteBtn
                            type='button'
                            $selected={my === 'dislike'}
                            disabled={Boolean(busyId)}
                            onClick={() => onVote('dislike')}
                            aria-label={intl.formatMessage({ id: 'comments.dislike' })}
                        >
                            👎 {dislikes}
                        </VoteBtn>
                        <Button type='link' size='small'
onClick={() => setReplyOpen(v => !v)}>
                            {intl.formatMessage({ id: 'comments.reply' })}
                        </Button>
                    </React.Fragment>
                ) : (
                    <Meta>
                        👍 {likes} · 👎 {dislikes}
                    </Meta>
                )}
                {canDelete ? (
                    <Button type='link' size='small'
danger onClick={onDelete}
disabled={Boolean(busyId)}>
                        {intl.formatMessage({ id: 'comments.delete' })}
                    </Button>
                ) : null}
            </Actions>
            {replyOpen && interactive ? (
                <Composer style={{ marginTop: '0.5rem' }}>
                    <Input.TextArea
                        rows={2}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        maxLength={2000}
                        placeholder={intl.formatMessage({ id: 'comments.reply_placeholder' })}
                    />
                    <Button type='primary' size='small'
loading={posting} onClick={onReply}>
                        {intl.formatMessage({ id: 'comments.send' })}
                    </Button>
                </Composer>
            ) : null}
            {Array.isArray(comment.replies) && comment.replies.length > 0 ? (
                <CommentList>
                    {comment.replies.map(child => (
                        <CommentNode
                            key={child.id}
                            comment={child}
                            depth={depth + 1}
                            interactive={interactive}
                            canModerate={canModerate}
                            currentUserId={currentUserId}
                            projectPageId={projectPageId}
                            onReload={onReload}
                            busyId={busyId}
                            setBusyId={setBusyId}
                        />
                    ))}
                </CommentList>
            ) : null}
        </CommentItem>
    )
}

CommentNode.propTypes = {
    comment: PropTypes.object.isRequired,
    depth: PropTypes.number.isRequired,
    interactive: PropTypes.bool,
    canModerate: PropTypes.bool,
    currentUserId: PropTypes.string,
    projectPageId: PropTypes.string.isRequired,
    onReload: PropTypes.func.isRequired,
    busyId: PropTypes.string,
    setBusyId: PropTypes.func.isRequired,
}

function ProjectComments({
    projectPageId,
    interactive = false,
    canModerate = false,
    currentUserId = '',
}) {
    const intl = useIntl()
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [draft, setDraft] = useState('')
    const [posting, setPosting] = useState(false)
    const [busyId, setBusyId] = useState('')

    const reload = useCallback(async () => {
        const data = await fetchProjectComments(projectPageId)
        setComments(Array.isArray(data?.comments) ? data.comments : [])
    }, [projectPageId])

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError('')
        reload()
            .catch(e => {
                if (!cancelled) {
                    setError(e?.message || intl.formatMessage({ id: 'comments.load_error' }))
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                }
            })
        return () => {
            cancelled = true
        }
    }, [reload, intl])

    const onPost = async () => {
        const body = draft.trim()
        if (!body || posting) {
            return
        }
        setPosting(true)
        try {
            await postProjectComment(projectPageId, { body })
            setDraft('')
            await reload()
        } catch (e) {
            if (e?.code === 'profanity_detected' || String(e?.message).includes('profanity_detected')) {
                message.error(intl.formatMessage({ id: 'comments.profanity_error' }))
            } else {
                message.error(e?.message || intl.formatMessage({ id: 'comments.post_error' }))
            }
        } finally {
            setPosting(false)
        }
    }

    return (
        <Section>
            <Heading>{intl.formatMessage({ id: 'comments.title' })}</Heading>
            {interactive ? (
                <Composer>
                    <Input.TextArea
                        rows={3}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        maxLength={2000}
                        placeholder={intl.formatMessage({ id: 'comments.placeholder' })}
                    />
                    <Button type='primary' loading={posting}
onClick={onPost} disabled={!draft.trim()}>
                        {intl.formatMessage({ id: 'comments.send' })}
                    </Button>
                </Composer>
            ) : null}
            {loading ? <Status>{intl.formatMessage({ id: 'comments.loading' })}</Status> : null}
            {error ? <Status>{error}</Status> : null}
            {!loading && !error && comments.length === 0 ? (
                <Status>{intl.formatMessage({ id: 'comments.empty' })}</Status>
            ) : null}
            <CommentList>
                {comments.map(c => (
                    <CommentNode
                        key={c.id}
                        comment={c}
                        depth={0}
                        interactive={interactive}
                        canModerate={canModerate}
                        currentUserId={currentUserId}
                        projectPageId={projectPageId}
                        onReload={reload}
                        busyId={busyId}
                        setBusyId={setBusyId}
                    />
                ))}
            </CommentList>
        </Section>
    )
}

ProjectComments.propTypes = {
    projectPageId: PropTypes.string.isRequired,
    interactive: PropTypes.bool,
    canModerate: PropTypes.bool,
    currentUserId: PropTypes.string,
}

export default ProjectComments
