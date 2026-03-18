FROM node:18-alpine
WORKDIR /app
COPY package.json /app/package.json
RUN yarn install --network-timeout 100000
COPY . /app
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

ENTRYPOINT ["yarn", "start", "--port", "3030"]