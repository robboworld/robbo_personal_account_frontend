# SSO test harness (LK + LMS + Scratch)

Единственный контур: BFF `/auth/oidc/start` → IdP → `/auth/oidc/callback` на API.

## Happy path
1. `LK_SSO_WITH_LMS_ENABLED=true`, IdP = Tutor (или `./setup.sh --oidc-mock`).
2. `/login` → вход через edx → cookie `lk_bff_session`.
3. Кнопка LMS / `/mycourses` → `start?return_to=<LMS_URL>&prompt=none` без второго пароля.
4. Редактор: status → при необходимости `start?return_to=<editor>` → save sb3.
5. Logout → BFF (+ IdP end_session если настроен).

## Negative cases
- Чужой `return_to=https://evil.example` → редирект на `/home`.
- Replay callback `state` → `invalid_state`.
- `error=access_denied` от IdP.

## Observability
- Консоль FE: `[lms-sso] authorize_redirect_started` с `flow: 'bff'`.
