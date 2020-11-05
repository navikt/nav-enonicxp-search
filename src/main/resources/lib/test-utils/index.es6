const httpClientLib = require('/lib/http-client');

const localBaseURL = 'http://localhost:8080/_/service/navno.nav.no.search/search';
const prodBaseURL = 'https://www.nav.no/_/service/navno.nav.no.search/search';

const getDisplayNames = (hits) => {
    return hits.map((hit) => hit.displayName);
};

const simpleSearch = (searchTerm, prod = false, params = null) => {
    const paramString = params
        ? Object.keys(params).reduce((memo, item) => `${memo}&${item}=${params[item]}`, '')
        : '';
    const url = `${prod ? prodBaseURL : localBaseURL}?ord=${searchTerm}${paramString}`;
    const result = httpClientLib.request({
        url: url,
        method: 'GET',
        contentType: 'application/json',
    });
    // add better error handling
    return JSON.parse(result.body);
};

const multipleSearch = (searchTerms, params) => {
    return searchTerms.reduce((acc, searchTerm) => {
        const results = simpleSearch(searchTerm, false, params);
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
