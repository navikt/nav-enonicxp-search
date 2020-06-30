const { assertTrue, assertFalse } = require('/lib/xp/testing');
const { multipleSearch } = require('/lib/test-utils');

const mostPopularTerms = [
    'dagpenger',
    'meldekort',
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

function arrayFind(list, findFn) {
    for (let i = 0; i < list.length; i++) {
        if (findFn(list[i], i)) {
            return list[i];
        }
    }
    return undefined;
}

const testMostPopular = () => {
    const result = multipleSearch(mostPopularTerms, { debug: true });

    // no zero results
    Object.keys(result).forEach(term => {
        assertTrue(result[term].hits.length > 0, `No hits for ${term}`);
    });

    // No duplicates
    Object.keys(result).forEach(term => {
        const unique = {};
        const { hits = [], prioritized } = result[term];
        const searchResults = prioritized.concat(hits);
        searchResults.forEach(({ id, href }) => {
            assertFalse(
                !!unique[id],
                `Found a duplicate result for term: ${term}: ${href} - id: ${id}`
            );
            unique[id] = href;
        });
    });

    const normalSearchResult = multipleSearch(mostPopularTerms, {
        excludePrioritized: true,
        debug: true,
    });
    // Normal results should include the prioritized results
    Object.keys(normalSearchResult).forEach(term => {
        const { hits = [] } = normalSearchResult[term];
        const { prioritized = [] } = result[term];
        const localPrioritized = prioritized.filter(
            ({ href }) => /^http(s?):\/\//.test(href) === false
        );

        localPrioritized.forEach(({ id, displayName }) => {
            if (!arrayFind(hits, ({ id: hitId }) => hitId === id)) {
                log.info(
                    `Could not find: "${displayName}" (id: ${id}) in top results for term: ${term}`
                );
            }
        });
    });
};

module.exports = {
    testMostPopular,
};
