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
FROM node:14.0.0-alpine3.11 as builder

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


## 
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





# # ------------------------------- APP CONTAINER

# FROM node:14.0.0-alpine3.11 as app


# # create user
# # At the end, set the user to use when running this image
# RUN addgroup -S clug && \
#     adduser -S -G clug clug && \
#     chown -R mapsparty:mapsparty /usr/src/app

# USER clug:clug

# ## Copy built node modules and binaries without including the toolchain
# COPY --from=builder node_modules .

FROM node:14.0.0-alpine3.11 as app

LABEL maintainer="team-cafet"

ENV NODE_ENV=production \
    PORT=4200

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
COPY --chown=clug:clug --from=builder /usr/src/app/backend/build/ /usr/src/app/

EXPOSE 4200

# Copy the application's compiled files to the build directory when the
# container runs.
CMD [ "node", "index.js" ]
