MongoClient = require('mongodb').MongoClient
express = require 'express'
app = express()

query = (q) -> return new Promise (f,r) ->
  MongoClient.connect "mongodb://db:27017/gh", (err, db) ->
    db.collection('github') .find(q)
    .count (e, val) -> f(val)

# create indexes for fast search
MongoClient.connect "mongodb://db:27017/gh", (err, db) ->
  db.collection('github').createIndex({ "payload.pull_request.head.repo.language": 1 })
  db.collection('github').createIndex({ "payload.forkee.language": 1 })

app.use '/', express.static(__dirname)

app.get '/pr/:lang', (req, res) ->
  query({ "payload.pull_request.head.repo.language": "#{req.params.lang}" })
  .then (val) -> res.send val.toString()

app.get '/fork/:lang', (req, res) ->
  query({ "payload.forkee.language": "#{req.params.lang}" })
  .then (val) -> res.send val.toString()

app.get '/all/:lang', (req, res) ->
  query({ $or : [
    { "payload.pull_request.head.repo.language": "#{req.params.lang}" },
    { "payload.forkee.language": "#{req.params.lang}" }
    ]}).then (val) -> res.send val.toString()


# Get all Java Forks and PullRequest for 2016/Q4
# db.getCollection('docs').find( {
  # $and : [
    # { $or : [ {"payload.forkee.language":"Java"}, {"payload.pull_request.head.repo.language":"Java"} ] },
    # { $and : [ {"created_at":{$gte:"2016-09-01T00:00:09Z"}}, {"created_at":{$lt:"2016-12-30T00:00:09Z"}} ] } ]
# } ).count()


app.listen 5555
