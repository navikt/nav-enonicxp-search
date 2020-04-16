const httpClientLib = require('/lib/http-client');

export function getDisplayNames(hits) {
    return hits.map(hit => hit.displayName);
}

export function simpleSearch(searchTerm) {
    const url = `http://localhost:8080/sok/_/service/navno.nav.no.search/search?ord="${searchTerm}"`;
    const result = httpClientLib.request({
        url: url,
        method: 'GET',
        contentType: 'application/json',
    });
    // add better error handling
    return JSON.parse(result.body);
}

export function multipleSearch(searchTerms) {
    return searchTerms.reduce((acc, searchTerm) => {
        const results = simpleSearch(searchTerm);
        log.info(JSON.stringify(Object.keys(results), null, 4));

        const { hits } = results;
        acc[searchTerm] = hits;

        return acc;
    }, {});
}
