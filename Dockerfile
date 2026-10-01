# Build stage: full install + webpack. dotenv-webpack bakes .env into the bundle here;
# the file never reaches the runtime image (its values are public in the bundle anyway).
FROM node:22-alpine AS build
WORKDIR /app

# Cypress postinstall тянет тяжёлый бинарник (Electron/браузер) — в образе приложения
# не нужен и сильно раздувает шаг Yarn «[4/4] Building fresh packages».
ENV CYPRESS_INSTALL_BINARY=0

# Git-хуки в образе не нужны (и .git в контексте сборки нет).
ENV CI=true HUSKY=0

# Иначе первый yarn install идёт без lockfile → свежие минорные версии ломают webpack 4 в образе.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000
COPY . /app
RUN yarn build

# Runtime stage: Express server + built assets only, no sources, devDependencies or .env.
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3030

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile --ignore-scripts --network-timeout 100000 \
    && yarn cache clean
COPY server.js ./
COPY public ./public
COPY static ./static
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3030
CMD ["node", "server.js"]
