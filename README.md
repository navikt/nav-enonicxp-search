# NAV.no - Enonic XP Search
[![Deploy to prod](https://github.com/navikt/nav-enonicxp-search/actions/workflows/deploy-to-prod.yml/badge.svg)](https://github.com/navikt/nav-enonicxp-search/actions/workflows/deploy-to-prod.yml)
[![Deploy to dev](https://github.com/navikt/nav-enonicxp-search/actions/workflows/deploy-to-dev.yml/badge.svg)](https://github.com/navikt/nav-enonicxp-search/actions/workflows/deploy-to-dev.yml)
[![Deploy to dev2/q6](https://github.com/navikt/nav-enonicxp-search/actions/workflows/deploy-to-q6.yml/badge.svg)](https://github.com/navikt/nav-enonicxp-search/actions/workflows/deploy-to-q6.yml)

Backend for søket på nav.no. Enonic XP applikasjon som må installeres sammen med [nav-enonicxp](https://github.com/navikt/nav-enonicxp).

## Lokal utvikling

Se [nav-enonicxp](https://github.com/navikt/nav-enonicxp) for hvordan komme i gang med utvikling av XP-appene våre.

Obs: For at søket skal fungere er man nødt til å legge hunspell inn i XP:
```
cp hunspell $XP_HOME/repo/index/conf/
```

## Deploy

### Testmiljøer

Start deploy via workflow dispatch:

[dev](https://github.com/navikt/nav-enonicxp-search/actions/workflows/build-dev.yml) </br>
[dev2/q6](https://github.com/navikt/nav-enonicxp-search/actions/workflows/build-q6.yml)

### Prodsetting

Publiser en ny release på master for å starte deploy til prod
