import styled from 'styled-components'

import { surface } from '@/components/AccountShell/styles'

export const ClientsToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: 1rem;
`

export const ClientsListShell = styled.div`
  .clientsList.ant-list {
    background: transparent;
  }

  .clientsList .ant-list-item {
    border-radius: 0.85rem;
    margin-bottom: 0.5rem;
    padding: 0.65rem 0.85rem !important;
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid ${surface.line} !important;
  }

  .clientsList .ant-list-pagination {
    margin-top: 1.25rem;
  }
`
