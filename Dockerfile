FROM node:18-alpine
WORKDIR /app

# Cypress postinstall тянет тяжёлый бинарник (Electron/браузер) — в образе приложения
# не нужен и сильно раздувает шаг Yarn «[4/4] Building fresh packages».
ENV CYPRESS_INSTALL_BINARY=0

# Husky не ставит git-hooks в CI; в контейнере .git обычно нет.
ENV CI=true

# Иначе первый yarn install идёт без lockfile → свежие минорные версии ломают webpack 4 в образе.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000
COPY . /app
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

ENTRYPOINT ["yarn", "start", "--port", "3030"]
