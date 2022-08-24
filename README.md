<p align="center">
    <h1 align="center">GitHub Language Statistics<br></h1>
</p>

<a href="https://www.gnu.org/licenses/agpl-3.0.en.html"><img height="20" src="https://img.shields.io/badge/license-AGPL--3.0-brightgreen.svg" alt="License (AGPL-3.0)"></a>
<a href="https://github.com/madnight/githut/actions/workflows/CI.yml"><img src="https://img.shields.io/github/workflow/status/madnight/githut/CI" alt="Build Status" /></a>
<a href="https://codeclimate.com/github/madnight/githut"><img height="20" src="https://codeclimate.com/github/madnight/githut/badges/issue_count.svg" alt="Issue Count"></a>
<a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-blue.svg" alt="Code Style"></a>
<img src="https://i.imgur.com/WK7zKol.png" alt=""></p>

## Data Generation
### Languages
Get language top list for Github
```SQL
SELECT language.name, COUNT(language.name)
AS count FROM [bigquery-public-data:github_repos.languages]
group by language.name order by count DESC
```

Result of first 10 from 322
```JavaScript
{"language_name":"JavaScript","count":"1006022"}
{"language_name":"CSS","count":"745573"}
{"language_name":"HTML","count":"663315"}
{"language_name":"Shell","count":"593461"}
{"language_name":"Python","count":"492715"}
{"language_name":"Ruby","count":"365413"}
{"language_name":"Java","count":"340622"}
{"language_name":"PHP","count":"328907"}
{"language_name":"C","count":"286272"}
{"language_name":"C++","count":"267552"}
...
```
### Licenses
Get license top list for Github
```SQL
SELECT license, COUNT(license)
AS count FROM [bigquery-public-data:github_repos.licenses]
group by license order by count DESC
```

Full result
```JavaScript
{"license":"mit","count":"1551711"}
{"license":"apache-2.0","count":"455316"}
{"license":"gpl-2.0","count":"376453"}
{"license":"gpl-3.0","count":"284761"}
{"license":"bsd-3-clause","count":"161041"}
{"license":"bsd-2-clause","count":"57412"}
{"license":"unlicense","count":"43899"}
{"license":"lgpl-3.0","count":"38213"}
{"license":"agpl-3.0","count":"38034"}
{"license":"cc0-1.0","count":"28600"}
{"license":"epl-1.0","count":"24074"}
{"license":"lgpl-2.1","count":"23872"}
{"license":"isc","count":"17690"}
{"license":"mpl-2.0","count":"17421"}
{"license":"artistic-2.0","count":"9413"}
```

### Pull Requests
Get the number of Pull Requests per day/month/year
```SQL
SELECT language as name, year, quarter, count FROM ( SELECT * FROM (
SELECT lang as language, y as year, q as quarter, type,
COUNT(*) as count FROM (SELECT a.type type, b.lang lang, a.y y, a.q q FROM (
SELECT type, actor.login, YEAR(created_at) as y, QUARTER(created_at) as q,
STRING(REGEXP_REPLACE(repo.url, r'https:\/\/github\.com\/|https:\/\/api\.github\.com\/repos\/', '')) as name
FROM [githubarchive:month.201901] WHERE NOT LOWER(actor.login) LIKE "%bot%") a
JOIN ( SELECT repo_name as name, lang FROM ( SELECT * FROM (
SELECT *, ROW_NUMBER() OVER (PARTITION BY repo_name ORDER BY lang) as num FROM (
SELECT repo_name, FIRST_VALUE(language.name) OVER (
partition by repo_name order by language.bytes DESC) AS lang
FROM [bigquery-public-data:github_repos.languages]))
WHERE num = 1 order by repo_name)
WHERE lang != 'null') b ON a.name = b.name)
GROUP by type, language, year, quarter
order by year, quarter, count DESC)
WHERE count >= 100) WHERE type = 'PullRequestEvent'
```

### Manual
Googles BigQuery is free for public datasets like Github, Reddit or Stackoverflow. It is limited to 1000 GB query volume per month. One of the querys above takes about 50-200 MB query volume. The public dataset for Github is available here: https://cloud.google.com/bigquery/public-data/github


### URL Schema

```
madnight.github.io/githut/#/pull_requests/2021/1/Python,Lua,JavaScript
                                 ▲         ▲   ▲        ▲
                                 │         │   │        │
                pull_requests ───┘   year ─┘   │        └─ languages
                pushes                         └─ quarter
                stars
                issues
```
