const httpClientLib = require('/lib/http-client');

const localBaseURL = 'http://localhost:8080/sok/_/service/navno.nav.no.search/search';
const prodBaseURL = 'https://www.nav.no/sok/_/service/navno.nav.no.search/search';

const getDisplayNames = hits => {
    return hits.map(hit => hit.displayName);
};

const simpleSearch = (searchTerm, prod = false) => {
    const url = `${prod ? prodBaseURL : localBaseURL}?ord="${searchTerm}&debug=true`;
    const result = httpClientLib.request({
        url: url,
        method: 'GET',
        contentType: 'application/json',
    });
    // add better error handling
    return JSON.parse(result.body);
};

const multipleSearch = searchTerms => {
    return searchTerms.reduce((acc, searchTerm) => {
        const results = simpleSearch(searchTerm);
        const { hits, prioritized } = results;
        acc[searchTerm] = { hits, prioritized };

        return acc;
    }, {});
};

const compareResultsReport = (result1, result2) => {
    return false;
};

module.exports = {
    simpleSearch,
    multipleSearch,
    compareResultsReport,
    getDisplayNames,
};
