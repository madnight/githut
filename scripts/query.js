'use strict'

const BigQuery = require('@google-cloud/bigquery')
const fs = require('fs')
const param = require('commander')
const {flow, map, first, isNumber, defaultTo} = require('lodash/fp')

const query = (sql) => {
    const options = {
        query: sql,
        timeoutMs: 1000000,
        useLegacySql: true
    }
    return BigQuery({ projectId: process.env.GCLOUD_PROJECT }).query(options)
}

const writeJsonToFile = q => async (json) => {
    const format = string => string.split(' ').pop().replace(/'/g,'')
    const fileName = format(q) + '.json'
    const lineEndings = (json) => String(json).replace(/},{/g, '}\r\n{')
    await fs.writeFile(fileName, lineEndings(json), (err) => {
        if (err)
            process.stdout.write('Could not write to ' + fileName + ' File ' + err + '\n')
        else
            process.stdout.write(fileName + ' successfully written\n')
    }
  )
}

const queryBuilder = (tables) => {
    const types = ['PullRequestEvent', 'IssuesEvent', 'PushEvent', 'WatchEvent']
    const sqlQuery = (type) =>
          `SELECT language as name, year, quarter, count FROM ( SELECT * FROM (
          SELECT lang as language, y as year, q as quarter, type,
          COUNT(*) as count FROM (SELECT a.type type, b.lang lang, a.y y, a.q q FROM (
          SELECT type, YEAR(created_at) as y, QUARTER(created_at) as q,
          STRING(REGEXP_REPLACE(repo.url, r'https:\/\/github\.com\/|https:\/\/api\.github\.com\/repos\/', '')) as name
          FROM ${tables} ) a
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
    return map(sqlQuery)(types)
}

const main = async () => {
    param
      .version('1.0.0')
      .option('-t, --tables <string>',
        'The GitHub Archive tables that you want query example usage:' +
        'node query.js -t "[githubarchive:day.20130818], [githubarchive:day.20140118]"')
      .parse(process.argv)

    const tables = defaultTo('[githubarchive:day.20130118], [githubarchive:day.20140118]')(param.tables)
    const queries = queryBuilder(tables)
    const numToStrReplacer = (key, value) => isNumber(value) ? JSON.stringify(value) : value
    const stringifyFP = x => y => JSON.stringify(y, x)

    const stringify = x => flow(
          JSON.stringify,
          JSON.parse,
          stringifyFP(numToStrReplacer)
          )(x)

    const exec = async (q) =>
      flow(
          first,
          map(stringify),
          writeJsonToFile(q)
      )(await query(q))

    try {
        await Promise.all(map(exec)(queries))
    } catch (err) {
        process.stdout.write('Error while querying the BigQuery Google API ' + err + '\n')
    }
}

main()
