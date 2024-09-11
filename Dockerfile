FROM node:18-alpine AS deps

WORKDIR /app

COPY ./src ./src
COPY package.json tsconfig.json tsconfig.build.json nest-cli.json ./


RUN yarn install
RUN yarn build

EXPOSE 3000
CMD yarn start:prod