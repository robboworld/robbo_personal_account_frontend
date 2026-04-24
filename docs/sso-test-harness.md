# SSO test harness (LK -> LMS)

## Scope
- Authorization Code + PKCE redirect.
- Callback processing and error normalization.
- Identity link persistence by `external_sub`.

## Happy path
1. Enable `LK_SSO_WITH_LMS_ENABLED=true`.
2. Fill required OIDC env vars.
3. Open LK and click `LMS`.
4. After callback, user is redirected to `/home`.
5. Check localStorage has `lk_lms_identity_link`.

## Negative cases
- Invalid state: modify callback URL `state` and verify `invalid_state`.
- Expired code: replay old callback URL and verify `expired_code`/`network_error`.
- Missing sub: simulate malformed id_token in mocked token endpoint.
- Access denied: simulate `error=access_denied` callback.

## Observability expectations
- `authorize_redirect_started` appears once per attempt.
- `sso_success` appears once on successful callback.
- `sso_error` includes `reason` and optional `details`.
