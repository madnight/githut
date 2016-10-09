FROM alpine:edge
MAINTAINER Fabian Beuke <mail@beuke.org>

RUN echo "http://dl-4.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add --update bash wget gzip mongodb-tools

# Downloading the Archive Files up to 2020
RUN bash -c "wget http://data.githubarchive.org/{2012..2020}-{01..12}-01-5.json.gz; exit 0"

# Extract the Archive Files
RUN gunzip *.json.gz

# Import the Data into the Mongo Database if env provision is set
# CMD [[ -z "${PROVISION}" ]] && echo "database already provisioned" || \
CMD mongoimport --drop -h=db --db gh --collection github && \
    ls -1 *.json | while read jsonfile; do \
    mongoimport --upsert -h=db --db gh --collection github \
    --numInsertionWorkers 8 --file $jsonfile; done
