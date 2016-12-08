# Data Generating

Get language top list from Github
```SQL
SELECT language.name, COUNT(language.name) AS count FROM [bigquery-public-data:github_repos.languages] group by language.name order by count DESC
```

Result of first 10 from 322 
```Javascript
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
