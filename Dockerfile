FROM node
MAINTAINER Fabian Beuke <mail@beuke.org>

RUN mkdir web
COPY package.json /web

WORKDIR /web

RUN npm install
RUN npm install -g forever coffee coffee-script nodemon

EXPOSE 5555

CMD npm test
