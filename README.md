# NAV.no - Enonic XP Search

![Build to prod](https://github.com/navikt/nav-enonicxp-search/workflows/Build%20to%20prod/badge.svg)
![Deploy to prod](https://github.com/navikt/nav-enonicxp-search/workflows/Deploy%20to%20prod/badge.svg) <br>
![Build to Q1](https://github.com/navikt/nav-enonicxp-search/workflows/Build%20to%20Q1/badge.svg)
![Deploy to Q1](https://github.com/navikt/nav-enonicxp-search/workflows/Deploy%20to%20Q1/badge.svg) |
![Build to Q6](https://github.com/navikt/nav-enonicxp-search/workflows/Build%20to%20Q6/badge.svg)
![Deploy to Q6](https://github.com/navikt/nav-enonicxp-search/workflows/Deploy%20to%20Q6/badge.svg)

Deployed by [nav-enonicxp-search-actions-runner
](https://github.com/navikt/nav-enonicxp-search-actions-runner)

## How to get started

1. Install Enonic by following the guide at https://developer.enonic.com/start
2. Create a sandbox
```
enonic sandbox start
```
3. Launch admin console
```
open http://localhost:8080/admin
```
4. Download the NAV.no - XP Search Application
```
git clone https://github.com/navikt/nav-enonicxp-search.git
```

## Development

```
enonic project deploy
``` 

## Deploy

- **Q6:** Run **trigger-deploy-q6.sh** located in the .github folder <br>
`.github/trigger-deploy-q6.sh`
- **Q1:** Merge to develop
- **P:**  Make a PR between master and develop __*__ and create a release at <br /> 
https://github.com/navikt/nav-enonicxp-search/releases <br />
**Obs:** Release must be formatted as **vX.X.X** (e.g v1.2.1)
 
 __*__ PR between master and develop
1. Make a pull request between master and develop
2. Name it "Release: < iso-date of the release> "
3. Write release notes in the comment. Remember to get links to the jira tasks.
  Optimally we get the whole text from Jira when doing the release there. For
  now just check how a previous release pull request looks. Bullet list with
  link to issue and short description.
4. Set the label **Release** on the pull request.
5. After code review merge the pull request to master
6. Deploy the code to production


#### Obs

For at søket skal fungere er man nødt til å legge hunspell inn i XP.
```
cp hunspell $XP_HOME/repo/index/conf/
```
- For mer info se: https://confluence.adeo.no/pages/viewpage.action?pageId=314051832
