"use strict"

const { BigQuery } = require("@google-cloud/bigquery")
const fs = require("fs")
const param = require("commander")
const { flatten, flow, map, first, isNumber, defaultTo } = require("lodash/fp")

const query = (sql) => {
    const options_query = {
        query: sql,
        timeoutMs: 1000000,
        useLegacySql: true,
    }

    const options = {
        keyFilename: process.env.GCLOUD_KEY_PATH,
        projectId: process.env.GCLOUD_PROJECT_ID
    }

    const bigqueryClient = new BigQuery(options)
    const client = bigqueryClient.query(options_query)
    return client
}

const getAppendFileName = (eventName) => {
    if (eventName.includes("PullRequestEvent"))
       return "gh-pull-request.json"

    if (eventName.includes("PushEvent"))
       return "gh-push-event.json"

    if (eventName.includes("IssuesEvent"))
       return "gh-issue-event.json"

    if (eventName.includes("WatchEvent"))
       return "gh-star-event.json"
}

const writeJsonToFile = (q) => async (j) => {
    const fN = "../src/data/" + getAppendFileName(q)
    fs.readFile(fN, (err, data) => {
        const json = JSON.parse(data)
        if (err) throw new Error("could not append file")
        json.push(j)
        fs.writeFile(fN, JSON.stringify(flatten(json), null, 2), (err) => {
            if (err) throw err
        })
    })
}

const queryBuilder = (tables) => {
    const types = ["PullRequestEvent", "IssuesEvent", "PushEvent", "WatchEvent"]

    /* eslint-disable no-useless-escape */
    const sqlQuery = (type) =>
        ` SELECT name, year, quarter, SUM(count) AS count FROM (
          SELECT language as name, year, quarter, actor.login, count FROM ( SELECT * FROM (
          SELECT lang as language, y as year, q as quarter, type, actor.login,
          COUNT(*) as count FROM (SELECT a.type type, actor.login, b.lang lang, a.y y, a.q q FROM (
          SELECT type, actor.login, YEAR(created_at) as y, QUARTER(created_at) as q,
          STRING(REGEXP_REPLACE(repo.url, r'https:\/\/github\.com\/|https:\/\/api\.github\.com\/repos\/', '')) as name
          FROM ${tables} WHERE NOT LOWER(actor.login) LIKE "%bot%") a
          JOIN ( SELECT repo_name as name, lang FROM ( SELECT * FROM (
          SELECT *, ROW_NUMBER() OVER (PARTITION BY repo_name ORDER BY lang) as num FROM (
          SELECT repo_name, FIRST_VALUE(language.name) OVER (
          partition by repo_name order by language.bytes DESC) AS lang
          FROM [bigquery-public-data:github_repos.languages]))
          WHERE num = 1 order by repo_name)
          WHERE lang != 'null') b ON a.name = b.name)
          GROUP by type, language, year, quarter, actor.login
          ORDER by year, quarter, count DESC)
          WHERE count <= 1000) WHERE type = '${type}')
          GROUP BY name, year, quarter
          ORDER BY year, quarter, count DESC LIMIT 100`
    /* eslint-enable no-useless-escape */
    return map(sqlQuery)(types)
}

const numToStrReplacer = (key, value) =>
    isNumber(value) ? JSON.stringify(value) : value
const stringifyFP = (x) => (y) => JSON.stringify(y, x)

const exec = async (q) => {
    const res = flow(
        first,
        stringifyFP(numToStrReplacer),
        JSON.parse,
        writeJsonToFile(q)
    )(await query(q))
    return res
}

const main = async () => {
    param
        .version("1.0.0")
        .option(
            "-t, --tables <string>",
            "The GitHub Archive tables that you want query example usage:" +
                'node query.js -t "[githubarchive:day.20130818], [githubarchive:day.20140118]"'
        )
        .parse(process.argv)

    const tables = defaultTo(
        "[githubarchive:day.20130118], [githubarchive:day.20140118]"
    )(param.tables)
    const queries = queryBuilder(tables)

    try {
        await Promise.all(map(exec)(queries))
    } catch (err) {
        process.stdout.write(
            "Error while querying the BigQuery Google API " + err + "\n"
        )
    }
}

main()
