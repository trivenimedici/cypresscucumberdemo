FROM cypress/included:8.7.0

WORKDIR /app

COPY ./cypress ./cypress
COPY ./cypress.json ./cypress.json

RUN node_modules/.bin/cypress-tags run -e TAGS='@smoke'