# NAV.no - Enonic XP Search

![Build to prod](https://github.com/navikt/nav-enonicxp-search/workflows/Build%20to%20prod/badge.svg)
![Deploy to prod](https://github.com/navikt/nav-enonicxp-search/workflows/Deploy%20to%20prod/badge.svg) <br/>
![Build to dev](https://github.com/navikt/nav-enonicxp-search/workflows/Build%20to%20dev/badge.svg)
![Deploy to dev](https://github.com/navikt/nav-enonicxp-search/workflows/Deploy%20to%20dev/badge.svg) <br/>
![Build to Q6](https://github.com/navikt/nav-enonicxp-search/workflows/Build%20to%20Q6/badge.svg)
![Deploy to Q6](https://github.com/navikt/nav-enonicxp-search/workflows/Deploy%20to%20Q6/badge.svg)

Backend for søket på nav.no. Enonic XP applikasjon som må installeres sammen med [nav-enonicxp](https://github.com/navikt/nav-enonicxp).

## Lokal utvikling

Se [nav-enonicxp](https://github.com/navikt/nav-enonicxp) for hvordan komme i gang med utvikling av Enonic XP appene våre.

Obs: For at søket skal fungere er man nødt til å legge hunspell inn i XP.
```
cp hunspell $XP_HOME/repo/index/conf/
```

## Deploy

Deployes med custom actions runner: [nav-enonicxp-search-actions-runner](https://github.com/navikt/nav-enonicxp-search-actions-runner)

### Testmiljøer

Start deploy via workflow dispatch:

[dev](https://github.com/navikt/nav-enonicxp-search/actions/workflows/build-dev.yml) </br>
[dev2/q6](https://github.com/navikt/nav-enonicxp-search/actions/workflows/build-q6.yml)

### Prodsetting

Publiser en ny release på master for å starte deploy til prod
