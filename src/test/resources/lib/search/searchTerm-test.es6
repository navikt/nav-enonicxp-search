const { assertTrue, assertFalse } = require('/lib/xp/testing');
const { multipleSearch } = require('/lib/test-utils');

const mostPopularTerms = [
    'meldekort',
    'dagpenger',
    'ledige stillinger',
    'chat',
    'forskudd',
    'permittering',
    'omsorgspenger',
    'cv',
    'sosialhjelp',
    'foreldrepenger',
    'sykepenger',
    'aap',
    'klage',
    'utbetaling',
    'uføretrygd',
    'kontakt',
    'arbeidsavklaringspenger',
    'pensjon',
    'aktivitetsplan',
];

const testMostPopular = () => {
    const result = multipleSearch(mostPopularTerms);

    // no zero results
    Object.keys(result).forEach((term) => {
        assertTrue(result[term].hits.length > 0, `No hits for ${term}`);
    });

    // No duplicates
    Object.keys(result).forEach((term) => {
        const unique = {};
        const { hits = [], prioritized } = result[term];
        const searchResults = prioritized.concat(hits);
        searchResults.forEach(({ id, href }) => {
            assertFalse(!!unique[href], `Found a duplicate result: ${href} - id: ${id}`);
            unique[href] = id;
        });
    });
};

module.exports = {
    testMostPopular,
};
