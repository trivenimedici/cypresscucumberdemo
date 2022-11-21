#FROM cypress/base:16.13.0
FROM cypress/included:10.11.0

WORKDIR /ecomr4
COPY package.json .
RUN npm install
RUN npx cypress verify
COPY . ./
ENV NO_COLOR=1
ENV CI=1

ENTRYPOINT [ "npm", "run"]
CMD ["test"] 
