FROM alpine:edge
MAINTAINER Fabian Beuke <mail@beuke.org>

RUN echo "http://dl-4.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add --update bash curl gzip mongodb-tools

CMD bash -c "mongoimport --drop -h=db --db gh --collection github && \
    curl http://data.githubarchive.org/{2012..2020}-{01..12}-{02}-15.json.gz \
    | gunzip \
    | mongoimport --upsert -h=db --db gh --collection github"
