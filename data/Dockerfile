FROM alpine:edge
MAINTAINER Fabian Beuke <mail@beuke.org>

RUN echo "http://dl-4.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add --update bash curl gzip jq mongodb-tools

COPY provision.sh /

CMD ["/bin/bash", "/provision.sh"]
