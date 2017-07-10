# Setup

```bash
gcloud beta auth application-default login
# Set the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS environment variables.
export GCLOUD_PROJECT=coral-firefly-151914
export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/gcloud/application_default_credentials.json
yarn install
```

# Run example

### Help
```bash
node query.js -h
```

### Run example command
Please note this command takes a while to execute
```bash
npm start
```

### Output
```bash
PullRequestEvent.json successfully written
WatchEvent.json successfully written
PushEvent.json successfully written
IssuesEvent.json successfully written
```

### Result
```bash
cat PullRequestEvent.json
{"name":"JavaScript","year":"2013","quarter":"1","count":"364"}
{"name":"Ruby","year":"2013","quarter":"1","count":"347"}
{"name":"Python","year":"2013","quarter":"1","count":"335"}
{"name":"PHP","year":"2013","quarter":"1","count":"287"}
{"name":"Java","year":"2013","quarter":"1","count":"228"}
{"name":"C","year":"2013","quarter":"1","count":"123"}
{"name":"JavaScript","year":"2014","quarter":"1","count":"489"}
{"name":"Ruby","year":"2014","quarter":"1","count":"372"}
{"name":"PHP","year":"2014","quarter":"1","count":"372"}
{"name":"Python","year":"2014","quarter":"1","count":"342"}
{"name":"Java","year":"2014","quarter":"1","count":"211"}
{"name":"C++","year":"2014","quarter":"1","count":"207"}
```

# Query quarter datasets

WARNING: the above example run a query for two days, querying a full quarter consumes many GB from the (1000 GB) free query volume, only use if you are sure

```bash
# Fetch the Data for 2017/Q2 (months 4,5,6)
node query.js --tables "[githubarchive:month.201704], [githubarchive:month.201705], [githubarchive:month.201706]"
```
