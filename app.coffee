express = require 'express'
MongoClient = require('mongodb').MongoClient
app = express()

query = (q) -> return new Promise (f,r) ->
  MongoClient.connect "mongodb://db:27017/gh", (err, db) ->
    db.collection('github').find(q)
    .count (e, val) -> f(val)

aggr = (q) -> return new Promise (f,r) ->
  MongoClient.connect "mongodb://db:27017/gh", (err, db) ->
    db.collection('github').aggregate q, (e, val) -> f(val)

# create indexes for fast search
MongoClient.connect "mongodb://db:27017/gh", (err, db) ->
  db.collection('github').createIndex({ "payload.pull_request.base.repo.language": 1 })
  db.collection('github').createIndex({ "payload.forkee.language": 1 })

app.use '/', express.static(__dirname)

app.get '/pr/:lang', (req, res) ->
  query({ "payload.pull_request.base.repo.language": "#{req.params.lang}" })
  .then (val) -> res.send val.toString()

app.get '/fork/:lang', (req, res) ->
  query({ "payload.forkee.language": "#{req.params.lang}" })
  .then (val) -> res.send val.toString()

app.get '/all/:lang', (req, res) ->
  query({ $or : [
    { "payload.pull_request.base.repo.language": "#{req.params.lang}" },
    { "payload.forkee.language": "#{req.params.lang}" }
    ]}).then (val) -> res.send val.toString()

app.get '/top', (req, res) ->
  aggr([{
    "$match": {
      "payload.pull_request.base.repo.language": { "$exists": true, "$ne": null }
    }}, { "$group": {
      "_id": "$payload.pull_request.base.repo.language",
      "count": { "$sum": 1 }
    }}, {$sort: {"count": -1}}, {$limit: 30}
  ]).then (val) -> res.send val

app.get '/rangetop', (req, res) ->
  aggr([ {
    "$match": {
      "payload.pull_request.base.repo.language": { "$exists": true, "$ne": null },
      $and : [ {"created_at":{$gte:"2015-09-01T00:00:09Z"}},
      {"created_at":{$lt:"2016-12-30T00:00:09Z"}} ]
    }}, { "$group": {
      "_id": "$payload.pull_request.base.repo.language",
      "count": { "$sum": 1 }
    }}, {$sort: {"count": -1}}, {$limit: 30}
  ]).then (val) -> res.send val


app.get '/datetop', (req, res) ->
  aggr([ {
    "$match": {
      "payload.pull_request.base.repo.language": { "$exists": true, "$ne": null },
      $or: [
        { "payload.pull_request.base.repo.language": 'C++' }
        { "payload.pull_request.base.repo.language": 'C' }
        { "payload.pull_request.base.repo.language": 'Objective-C' }
      "payload.pull_request.base.repo.language": {$in : [/\b(Ruby|Java|JavaScript|Go|PHP|Python|Shell)\b/]},],
      # "payload.pull_request.base.repo.language": "C++",
      "created_at" : {$in : [/201/]},
      }}, { $group : {
        _id: {
          lang: "$payload.pull_request.base.repo.language",
          year : { $substr : ["$created_at", 0, 4 ] },
          month : { $substr : ["$created_at", 5, 2 ] }
        }, count: { $sum: 1 }
    }},{$sort: { "_id.year": 1, "_id.month": 1}}
  ]).then (val) -> res.send val



app.listen 5555
