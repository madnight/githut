#!/usr/bin/env bash
set -x

# mongoimport --drop -h=db --db gh --collection githubxy

for year in {2014..2016}; do
   for month in {01..12}; do
      for day in {01..31}; do
         for hour in {0..23}; do
            ( curl http://data.githubarchive.org/$year-$month-$day-$hour.json.gz \
            | gunzip \
            | jq '. | {lang: .payload.pull_request.base.repo.language, date: .created_at}' \
            | jq 'select(.lang != null)' \
            | mongoimport --upsert -h=db --db gh --collection githubxy
            ) &
         done
         wait
      done
   done
done

# curl http://data.githubarchive.org/2012-09-01-15.json.gz | gunzip | jq '. | {lang: .payload.pull_request.base.repo.language, date: .created_at}' | jq 'select(.lang != null)' | jq -s 'group_by(.lang) | map({lang:.[0].lang,date:.[0].date, count:length}) '
