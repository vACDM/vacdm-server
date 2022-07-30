# ################################################################
# ###                        Base image                        ###
# ################################################################
FROM node:alpine as base

WORKDIR /opt

COPY ./* ./

WORKDIR /opt/backend

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --only=production

# ################################################################
# ###                     development image                    ###
# ################################################################
FROM base as development

RUN npm install --quiet --unsafe-perm --no-progress --no-audit

CMD npm run run:dev

# ################################################################
# ###                        build image                       ###
# ################################################################

FROM base as build

RUN npx tsc -p ./tsconfig.json

# ################################################################
# ###                     production image                     ###
# ################################################################

FROM base as production

CMD npm run run:prod
