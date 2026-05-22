/** Apollo HOC puts query result in `data`; union member exposes `userHttp`. */
export function getProfileFromQuery(data) {
  const node = data?.GetUser
  if (!node) {
    return { profile: null, loading: data?.loading ?? false, error: data?.error }
  }
  return {
    profile: node.userHttp ?? null,
    loading: data?.loading ?? false,
    error: data?.error,
  }
}
