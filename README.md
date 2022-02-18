# NAV.no - Enonic XP Search

![Build to prod](https://github.com/navikt/nav-enonicxp-search/workflows/Build%20to%20prod/badge.svg)
![Deploy to prod](https://github.com/navikt/nav-enonicxp-search/workflows/Deploy%20to%20prod/badge.svg) <br>
![Build to dev](https://github.com/navikt/nav-enonicxp-search/workflows/Build%20to%20dev/badge.svg)
![Deploy to dev](https://github.com/navikt/nav-enonicxp-search/workflows/Deploy%20to%20dev/badge.svg) <br>
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

- **dev/Q6** Run **trigger-deploy-(dev|q6).sh** located in the .github folder <br>
`.github/trigger-deploy-dev.sh`
- **P:**  Make a PR between master and your feature branch and create a release at <br />
https://github.com/navikt/nav-enonicxp-search/releases <br />

#### Obs

For at søket skal fungere er man nødt til å legge hunspell inn i XP.
```
cp hunspell $XP_HOME/repo/index/conf/
```
- For mer info se: https://confluence.adeo.no/pages/viewpage.action?pageId=314051832

## Troubleshooting

#### Facet handling

The facet handler has a locking mechanism which is stored in enonic under 'Data Toolbox / Data Tree /
no.nav.navno/ master / root / facetValidation'. In case of a crash during deploy this lock could have been set during the crash. The error handling can't manage to release the lock so this might have to be done manually.

1. Delete the facetValidation from data tool box
2. Restart the search app, this will make the master recreate the structure during startup.
