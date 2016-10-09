express = require 'express'
app = express()
MongoClient = require('mongodb').MongoClient

query = (q) ->
  return new Promise (f,r) ->
    MongoClient.connect "mongodb://localhost:27017/test", (err, db) ->
      db.collection('docs')
      .find(q)
      .count (e, val) ->
        return f(val)

app.get '/pr/:lang', (req, res) ->
  query({
    "payload.pull_request.head.repo.language":
      "#{req.params.lang}"
      })
  .then (val) ->
    res.status(200).send val.toString()

app.get '/fork/:lang', (req, res) ->
  query({
    "payload.forkee.language":
      "#{req.params.lang}"
      })
  .then (val) ->
    res.status(200).send val.toString()

app.listen 5555
