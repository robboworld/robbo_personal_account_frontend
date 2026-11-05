import styled from 'styled-components'
import { Button, Card, List } from 'antd'

import theme from '@/theme'
import { surface } from '@/components/AccountShell'

const { colors } = theme

// The lightest green that keeps white text readable: 4.6:1, accentGreen gives 2.9:1.
const HEADER_GREEN = '#008834'

/** A class: a green header on a tinted card, so that it reads as a block of its own. */
export const ClassCardFrame = styled(Card)`
  overflow: hidden;
  border: 1px solid ${surface.glassLine};
  background: ${surface.page};
  box-shadow: ${surface.shadow};

  && .ant-card-head {
    background: ${HEADER_GREEN};
    border-bottom: none;
  }

  /* Where the name has no room beside "Покинуть класс", the button moves to a row of its own. */
  && .ant-card-head-wrapper {
    flex-wrap: wrap;
  }

  && .ant-card-head-title {
    flex: 1 1 12rem;
    padding-block: 0.625rem;
    white-space: normal;
  }

  && .ant-card-extra {
    margin-inline-start: 0;
    padding-block-end: 0.625rem;

    ${theme.above.small`
      padding-block-end: 0;
    `}
  }
`

export const ClassName = styled.div`
  color: #fff;
  font-size: 1.125rem;
  font-weight: 600;
`

export const ClassTeacher = styled.div`
  color: #fff;
  font-size: 0.875rem;
  font-weight: 400;
`

/** Quiet on purpose: leaving is rare, and the red is kept for the confirmation. */
export const LeaveButton = styled(Button)`
  && {
    color: #fff;
  }

  &&:hover,
  &&:focus-visible {
    background: rgba(255, 255, 255, 0.16);
    color: #fff;
  }
`

/** Assignments of a class: white cards on the class's tint in place of the list's thin lines. */
export const AssignmentList = styled(List)`
  && .ant-list-header {
    padding-block: 0 0.75rem;
    border-bottom: none;
  }

  && .ant-list-item {
    margin-bottom: 0.75rem;
    padding: 0.875rem 1rem;
    border: 1px solid ${surface.glassLine};
    border-radius: 0.625rem;
    background: ${surface.card};
  }

  && .ant-list-item:last-child {
    margin-bottom: 0;
  }

  /* A row of equal buttons: the frames replace the list's split lines. */
  && .ant-list-item-action {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-block-start: 0.75rem;
    margin-inline-start: 0;
  }

  && .ant-list-item-action > li {
    padding: 0;
  }

  && .ant-list-item-action-split {
    display: none;
  }

  /* The dark green: accentGreen text on white is only 2.9:1. */
  && .ant-list-item-action .ant-btn-link {
    border: 1.5px solid ${colors.accentGreenDark};
    color: ${colors.accentGreenDark};
  }

  && .ant-list-item-action .ant-btn-link:hover {
    background: rgba(0, 175, 65, 0.1);
    color: ${colors.accentGreenDark};
  }
`
