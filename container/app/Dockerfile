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
FROM node:13-alpine as builder

ENV NODE_ENV=production


## Install build toolchain, install node deps and compile native add-ons
## (needed for node-gyp --> bcrypt)
RUN apk add --no-cache python make g++

## Create special user (good practise)
RUN addgroup -S clug && \
    adduser -S -G clug clug && \
    mkdir -p /usr/src/app && \
    chown -R clug:clug /usr/src/app

USER clug:clug

WORKDIR /usr/src/app



## --------------------- DEPENDENCIES FRONTEND APP
## Install dependencies.
COPY --chown=clug:clug ./packages/frontend/package.json ./packages/frontend/package-lock.json /usr/src/app/frontend/
WORKDIR /usr/src/app/frontend
RUN npm ci

## --------------------- DEPENDENCIES BACKEND APP
## Install dependencies.
COPY --chown=clug:clug ./packages/backend/package.json ./packages/backend/package-lock.json /usr/src/app/backend/
WORKDIR /usr/src/app/backend
RUN npm ci


## Copy source code into builder container
WORKDIR /usr/src/app
COPY --chown=clug:clug ./packages/backend/ /usr/src/app/backend/
COPY --chown=clug:clug ./packages/frontend/ /usr/src/app/frontend/

## --------------------- BUILD FRONTEND APP
WORKDIR /usr/src/app/frontend
RUN npm run build

## --------------------- BUILD BACKEND APP
WORKDIR /usr/src/app/backend
RUN npm run build:app && \ 
    # npm run build:migrations && \ we have no migration for now so it is desactivated
    npm run build:scripts


# ------------------------------- APP CONTAINER

FROM node:13-alpine as app

LABEL maintainer="team-cafet"

ENV NODE_ENV=production \
    PORT=3100 \
    DATABASE_NAME=clug-db \
    DATABASE_HOST=db \
    DATABASE_PORT=5432 \
    DATABASE_USERNAME=user \
    DATABASE_PASSWORD=password \
    DATABASE_SYNCHRONIZE=0 \
    DATABASE_DROPSCHEMA=0 \
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
COPY --chown=clug:clug --from=builder /usr/src/app/backend/node_modules /usr/src/app/node_modules
COPY --chown=clug:clug --from=builder /usr/src/app/backend/build/ /usr/src/app/build
COPY --chown=clug:clug --from=builder /usr/src/app/backend/ormconfig.js /usr/src/app/ormconfig.js
COPY --chown=clug:clug --from=builder /usr/src/app/backend/public /usr/src/app/public

EXPOSE 3100

# Copy the application's compiled files to the build directory when the
# container runs.
CMD [ "node", "build/index.js" ]
