# ################################################################
# ###                        Base image                        ###
# ################################################################
FROM node:16-alpine as base

WORKDIR /opt

ENV NODE_ENV production

RUN apk update && \
    apk upgrade && \
    npm i npm@latest -g && \
    chown node:node -R /opt
    
    # && \
    # apk add --no-cache bash && \
    # apk add --no-cache git && \

COPY --chown=node:node package*.json ./

USER node

# ################################################################
# ###                        build image                       ###
# ################################################################

FROM base as build

ENV NODE_ENV development

COPY --chown=node:node . .

RUN npm install && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

RUN tsc -p ./tsconfig.node.json && \
    resolve-tspaths --out "dist" && \
    npm run spa-build

# ################################################################
# ###                      modules image                       ###
# ################################################################

FROM base as modules

RUN npm install && npm cache clean --force

# ################################################################
# ###                     production image                     ###
# ################################################################

FROM base as production

COPY --from=build --chown=node:node /opt/dist ./dist
COPY --from=modules --chown=node:node /opt/node_modules ./node_modules

CMD node dist/backend/app.js
