# ################################################################
# ###                        Base image                        ###
# ################################################################
FROM node:alpine as base

WORKDIR /opt

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

# ################################################################
# ###                     development image                    ###
# ################################################################
FROM base as development

WORKDIR /opt/backend

RUN npm install --quiet --unsafe-perm --no-progress --no-audit

CMD npm run run:dev

# ################################################################
# ###                    backend build image                   ###
# ################################################################

FROM base as backendbuild

RUN pwd && ls -la

WORKDIR /opt/backend

RUN pwd && ls -la

RUN npx tsc -p ./tsconfig.json

# ################################################################
# ###                   frontend build image                   ###
# ################################################################

FROM base as frontendbuild

WORKDIR /opt/frontend

RUN npm i --include=dev

ENV PATH /opt/frontend/node_modules:$PATH

RUN npm run build

# ################################################################
# ###                     production image                     ###
# ################################################################

FROM base as production

COPY --from=frontendbuild --chown=node:node /opt/frontend/build /opt/frontend/build
COPY --from=backendbuild --chown=node:node /opt/backend/dist/ /opt/backend/dist/

WORKDIR /opt/backend

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --omit=dev

CMD npm run run:prod
