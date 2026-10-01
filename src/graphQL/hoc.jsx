import React, { useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'

/**
 * Drop-in for the graphql() HOC that Apollo 4 removed, for the legacy-section containers.
 * Supports what this codebase uses: `name`, `skip` and `options` (object or props => object);
 * query onCompleted/onError options are called from effects.
 * Queries pass `{ ...data, loading, error, refetch, fetchMore, networkStatus, variables }`
 * as props[name || 'data'] (omitted while skipped); mutations pass the mutate function as
 * props[name || 'mutate'] and its state as props[`${name}Result`] (or `result`).
 * New code should call useQuery/useMutation directly.
 */
export function graphql (document, config = {}) {
  const definition = document.definitions.find(d => d.kind === 'OperationDefinition')
  const isMutation = definition?.operation === 'mutation'
  const resolve = (value, props) => (typeof value === 'function' ? value(props) : value)

  return Component => {
    const QueryWrapped = props => {
      const skip = Boolean(resolve(config.skip, props))
      // Apollo 4 dropped useQuery's onCompleted/onError: call them from effects instead.
      const { onCompleted, onError, ...options } = resolve(config.options, props) || {}
      const result = useQuery(document, { ...options, skip })
      const callbacks = useRef({ onCompleted, onError })
      callbacks.current = { onCompleted, onError }
      useEffect(() => {
        if (result.data && !result.loading) {
          callbacks.current.onCompleted?.(result.data)
        }
      }, [result.data, result.loading])
      useEffect(() => {
        if (result.error) {
          callbacks.current.onError?.(result.error)
        }
      }, [result.error])
      if (skip) {
        return <Component {...props} />
      }
      const dataProp = {
        ...result.data,
        loading: result.loading,
        error: result.error,
        networkStatus: result.networkStatus,
        refetch: result.refetch,
        fetchMore: result.fetchMore,
        variables: result.variables,
      }
      return <Component {...props} {...{ [config.name || 'data']: dataProp }} />
    }

    const MutationWrapped = props => {
      const skip = Boolean(resolve(config.skip, props))
      const options = resolve(config.options, props) || {}
      const [mutate, state] = useMutation(document, options)
      if (skip) {
        return <Component {...props} />
      }
      const name = config.name || 'mutate'
      const resultName = config.name ? `${config.name}Result` : 'result'
      return <Component {...props} {...{ [name]: mutate, [resultName]: state }} />
    }

    const Wrapped = isMutation ? MutationWrapped : QueryWrapped
    Wrapped.displayName = `graphql(${Component.displayName || Component.name || 'Component'})`
    return Wrapped
  }
}
