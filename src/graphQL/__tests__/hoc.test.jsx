import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { gql } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'

import { graphql } from '@/graphQL/hoc'

const GET_NAME = gql`query GetName($id: String!) { GetName(id: $id) { name } }`
const RENAME = gql`mutation Rename($name: String!) { Rename(name: $name) { name } }`

const mocks = [
  { request: { query: GET_NAME, variables: { id: '1' } }, result: { data: { GetName: { __typename: 'N', name: 'Alice' } } } },
  { request: { query: RENAME, variables: { name: 'Bob' } }, result: { data: { Rename: { __typename: 'N', name: 'Bob' } } } },
]

describe('graphql() compatibility HOC', () => {
  it('passes query data under the given name with options from props', async () => {
    const View = ({ Person }) => <p>{Person.loading ? 'loading' : Person.GetName.name}</p>
    const Wrapped = graphql(GET_NAME, { name: 'Person', options: props => ({ variables: { id: props.id } }) })(View)
    render(<MockedProvider mocks={mocks}><Wrapped id='1' /></MockedProvider>)
    expect(screen.getByText('loading')).toBeTruthy()
    await waitFor(() => expect(screen.getByText('Alice')).toBeTruthy())
  })

  it('calls query onCompleted with the data', async () => {
    const onCompleted = jest.fn()
    const Wrapped = graphql(GET_NAME, { options: { variables: { id: '1' }, onCompleted } })(() => null)
    render(<MockedProvider mocks={mocks}><Wrapped /></MockedProvider>)
    await waitFor(() => expect(onCompleted).toHaveBeenCalledWith({ GetName: { __typename: 'N', name: 'Alice' } }))
  })

  it('omits the data prop while skipped', () => {
    const View = ({ data }) => <p>{data ? 'has data' : 'no data'}</p>
    const Wrapped = graphql(GET_NAME, { skip: () => true })(View)
    render(<MockedProvider mocks={[]}><Wrapped /></MockedProvider>)
    expect(screen.getByText('no data')).toBeTruthy()
  })

  it('passes the mutate function under the given name', async () => {
    let rename
    const View = ({ RenameUser }) => {
      rename = RenameUser
      return null
    }
    const Wrapped = graphql(RENAME, { name: 'RenameUser' })(View)
    render(<MockedProvider mocks={mocks}><Wrapped /></MockedProvider>)
    let response
    await act(async () => {
      response = await rename({ variables: { name: 'Bob' } })
    })
    expect(response.data.Rename.name).toBe('Bob')
  })
})
