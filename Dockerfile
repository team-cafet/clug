###########################################################
#
# This Dockerfile purspose is to dockerize the app
# into a single container
#
# The container is build in two step:
# 1) A container is going to install all dependencies
#    and build the project
# 2) A second container copy the results of those builds
#    and is the container that contain our app
#
###########################################################


# ------------------------------- BUILDER CONTAINER
# Node alpine is the smallest build for node js
FROM node:12-alpine as builder

ENV NODE_ENV=production


## Install build toolchain, install node deps and compile native add-ons
## (needed for node-gyp --> bcrypt)
RUN apk add --no-cache python make g++ curl

## Create special user (good practise)
RUN addgroup -S clug && \
    adduser -S -G clug clug && \
    mkdir -p /usr/src/app && \
    chown -R clug:clug /usr/src/app

WORKDIR /usr/src/app

USER clug:clug


## --------------------- DEPENDENCIES FRONTEND APP
## Install dependencies.
COPY --chown=clug:clug ./packages/frontend/package.json ./packages/frontend/package-lock.json /usr/src/app/frontend/
WORKDIR /usr/src/app/frontend
RUN npm ci --dev


## --------------------- DEPENDENCIES BACKEND APP
## Install dependencies.
COPY --chown=clug:clug ./packages/backend/package.json ./packages/backend/package-lock.json /usr/src/app/backend/
WORKDIR /usr/src/app/backend
RUN npm ci --dev


## Copy source code into builder container
WORKDIR /usr/src/app/
COPY --chown=clug:clug ./packages/backend/ /usr/src/app/backend/
COPY --chown=clug:clug ./packages/frontend/ /usr/src/app/frontend/

## --------------------- BUILD FRONTEND APP
WORKDIR /usr/src/app/frontend/
RUN npm run build

## --------------------- BUILD BACKEND APP
WORKDIR /usr/src/app/backend/
RUN npm run build:app && \ 
    npm run build:migrations && \
    npm run build:scripts

# ------------------------------- APP CONTAINER

FROM node:12-alpine as app

LABEL maintainer="team-cafet"

RUN apk add --no-cache openssl

# ENV DOCKERIZE_VERSION v0.6.1
# RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ENV NODE_ENV=production \
    PORT=3100 \
    DATABASE_NAME=clug-db \
    DATABASE_HOST=db \
    DATABASE_PORT=5432 \
    DATABASE_USERNAME=user \
    DATABASE_PASSWORD=password \
    SETTINGS_JWT_SECRET_OR_PUBLIC_KEY=secret

# * Create build && app directory.
# * Create clug user & group.
RUN mkdir -p /build /usr/src/app && \
    addgroup -S clug && \
    adduser -S -G clug clug && \
    chown -R clug:clug /build /usr/src/app

USER clug:clug

WORKDIR /usr/src/app


# Copy the application's compiled files from the builder image.
COPY --chown=clug:clug --from=builder /usr/src/app/backend/package.json /usr/src/app/package.json
COPY --chown=clug:clug --from=builder /usr/src/app/backend/package-lock.json /usr/src/app/package-lock.json
COPY --chown=clug:clug --from=builder /usr/src/app/backend/node_modules /usr/src/app/node_modules
COPY --chown=clug:clug --from=builder /usr/src/app/backend/build/ /usr/src/app/build
COPY --chown=clug:clug --from=builder /usr/src/app/backend/ormconfig.js /usr/src/app/ormconfig.js
COPY --chown=clug:clug --from=builder /usr/src/app/backend/public /usr/src/app/public


# RUN dockerize -wait tcp://${DATABASE_HOST}:${DATABASE_PORT}
# RUN npm run migration:run

EXPOSE 3100

# CMD [ "npm run start" ]
CMD npm run migration:run && npm run start
