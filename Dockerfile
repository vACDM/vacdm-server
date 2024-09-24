# ################################################################
# ###                        Base image                        ###
# ################################################################
FROM node:18-alpine as base

WORKDIR /opt

ENV NODE_ENV production

RUN apk update && \
    apk upgrade && \
    npm i npm@next-10 -g && \
    chown node:node -R /opt
    
    # && \
    # apk add --no-cache bash && \
    # apk add --no-cache git && \

COPY --chown=node:node package*.json ./
COPY --chown=node:node assets ./assets

USER node

# ################################################################
# ###                        build image                       ###
# ################################################################

FROM base as build

COPY --chown=node:node . .

RUN npm install --include=dev && npm cache clean --force
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

CMD ["node", "dist/backend/main.js"]
