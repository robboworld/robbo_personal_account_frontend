import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import {
    deleteProjectReaction,
    fetchProjectReactions,
    fetchReactionTypes,
    putProjectReaction,
} from '@/api/projectPage'
import theme from '@/theme'

const ReactionSection = styled.section`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(87, 94, 117, 0.12);
`

const ReactionHeading = styled.h2`
  margin: 0 0 0.75rem;
  color: rgba(87, 94, 117, 0.9);
  font-size: 0.875rem;
  font-weight: 600;
`

const ReactionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const ReactionButton = styled.button`
  min-width: 3.25rem;
  min-height: 2.75rem;
  padding: 0.4rem 0.65rem;
  border: 1px solid ${props => (props.$selected
        ? theme.colors.accentGreen
        : 'rgba(87, 94, 117, 0.16)')};
  border-radius: 8px;
  background: ${props => (props.$selected
        ? 'rgba(0, 175, 65, 0.12)'
        : 'rgba(255, 255, 255, 0.78)')};
  color: #383838;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  opacity: ${props => (props.$busy ? 0.6 : 1)};
  transition:
    transform 180ms cubic-bezier(0.32, 0.72, 0, 1),
    border-color 220ms ease,
    background 220ms ease;

  &:hover:not(:disabled),
  &:focus-visible {
    border-color: ${theme.colors.accentGreen};
    background: rgba(0, 175, 65, 0.08);
    outline: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 175, 65, 0.18);
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }
`

const Emoji = styled.span`
  font-size: 1.15rem;
  line-height: 1;
`

const Count = styled.span`
  min-width: 1ch;
  margin-left: 0.35rem;
  color: rgba(87, 94, 117, 0.82);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
`

const Status = styled.p`
  margin: 0;
  color: rgba(87, 94, 117, 0.72);
  font-size: 0.8125rem;
`

function ProjectReactions({ projectPageId, interactive }) {
    const intl = useIntl()
    const [types, setTypes] = useState([])
    const [summary, setSummary] = useState({ counts: [], myReaction: null })
    const [loading, setLoading] = useState(true)
    const [busyCode, setBusyCode] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError('')
        Promise.all([
            fetchReactionTypes(),
            fetchProjectReactions(projectPageId),
        ])
            .then(([typeData, summaryData]) => {
                if (cancelled) return
                setTypes(typeData.types || [])
                setSummary(summaryData || { counts: [], myReaction: null })
            })
            .catch(() => {
                if (!cancelled) {
                    setError(intl.formatMessage({ id: 'reactions.load_error' }))
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [intl, projectPageId])

    const countByCode = summary.counts.reduce((result, item) => {
        result[item.code] = item.count
        return result
    }, {})

    const handleReaction = async code => {
        if (!interactive || busyCode) return
        setBusyCode(code)
        setError('')
        try {
            const nextSummary = summary.myReaction === code
                ? await deleteProjectReaction(projectPageId)
                : await putProjectReaction(projectPageId, code)
            setSummary(nextSummary)
        } catch (_) {
            setError(intl.formatMessage({ id: 'reactions.update_error' }))
        } finally {
            setBusyCode('')
        }
    }

    return (
        <ReactionSection aria-labelledby={`project-reactions-${projectPageId}`}>
            <ReactionHeading id={`project-reactions-${projectPageId}`}>
                {intl.formatMessage({ id: 'reactions.title' })}
            </ReactionHeading>
            {loading && <Status>{intl.formatMessage({ id: 'reactions.loading' })}</Status>}
            {!loading && error && <Status role='alert'>{error}</Status>}
            {!loading && types.length > 0 && (
                <ReactionList>
                    {types.map(type => {
                        const selected = summary.myReaction === type.code
                        const count = countByCode[type.code] || 0
                        return (
                            <ReactionButton
                                key={type.code}
                                type='button'
                                disabled={!interactive || Boolean(busyCode)}
                                $selected={selected}
                                $busy={busyCode === type.code}
                                aria-pressed={interactive ? selected : undefined}
                                aria-label={intl.formatMessage(
                                    { id: interactive ? 'reactions.action_label' : 'reactions.count_label' },
                                    { emoji: type.emoji, count },
                                )}
                                onClick={() => handleReaction(type.code)}
                            >
                                <Emoji aria-hidden='true'>{type.emoji}</Emoji>
                                <Count>{count}</Count>
                            </ReactionButton>
                        )
                    })}
                </ReactionList>
            )}
        </ReactionSection>
    )
}

ProjectReactions.propTypes = {
    projectPageId: PropTypes.string.isRequired,
    interactive: PropTypes.bool,
}

ProjectReactions.defaultProps = {
    interactive: false,
}

export default ProjectReactions
