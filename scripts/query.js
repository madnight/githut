'use strict'

const BigQuery = require('@google-cloud/bigquery')
const {flow, map, first} = require('lodash/fp')

const query = (sql) => {
  const options = {
    query: sql,
    timeoutMs: 1000000,
    useLegacySql: true
  }
  return BigQuery({ projectId: process.env.GCLOUD_PROJECT }).query(options)
}

const main = async () => {
  const types = ["PullRequestEvent", "IssuesEvent", "PushEvent", "WatchEvent"]
  const sqlQuery = (type) =>
        `SELECT language as name, year, quarter, count FROM ( SELECT * FROM (
        SELECT lang as language, y as year, q as quarter, type,
        COUNT(*) as count FROM (SELECT a.type type, b.lang lang, a.y y, a.q q FROM (
        SELECT type, YEAR(created_at) as y, QUARTER(created_at) as q,
        STRING(REGEXP_REPLACE(repo.url, r'(https:\/\/github\.com\/|
        https:\/\/api\.github\.com\/repos\/)', '')) as name
        FROM [githubarchive:day.20130118] ) a
        JOIN ( SELECT repo_name as name, lang FROM ( SELECT * FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY repo_name ORDER BY lang) as num FROM (
        SELECT repo_name, FIRST_VALUE(language.name) OVER (
        partition by repo_name order by language.bytes DESC) AS lang
        FROM [bigquery-public-data:github_repos.languages]))
        WHERE num = 1 order by repo_name)
        WHERE lang != 'null') b ON a.name = b.name)
        GROUP by type, language, year, quarter
        order by year, quarter, count DESC)
        WHERE count >= 100) WHERE type = '${type}'`

  const queries = map(sqlQuery)(types)

  const exec = async (q) =>
    flow(
        first,
        map(JSON.stringify),
        map(console.log)
    )(await query(q))

  await Promise.all(map(exec)(queries))
  }

main()
