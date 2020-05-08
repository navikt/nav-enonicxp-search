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

// function arrayFind(list, findFn) {
//     for (let i = 0; i < list.length; i++) {
//         if (findFn(list[i], i)) {
//             return list[i];
//         }
//     }
//     return undefined;
// }

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
            assertFalse(
                !!unique[id],
                `Found a duplicate result for term: ${term}: ${href} - id: ${id}`
            );
            unique[id] = href;
        });
    });

    // Normal results should include the prioritized results
    // Object.keys(result).forEach((term) => {
    //     const { hits = [], prioritized = [] } = result[term];
    //     const top10 = hits.slice(0, 10); // top 10 normal results
    //     log.info('top 10');
    //     log.info(JSON.stringify(top10, null , 4));
    //
    //     log.info('Prioritized');
    //     log.info(JSON.stringify(top10, null , 4));
    //
    //     prioritized.forEach(({ id }) =>
    //         assertTrue(
    //             !!arrayFind(top10, ({ id: hitId }) => hitId === id),
    //             `Could not find id: ${id} in top 10 results for term: ${term}`
    //         )
    //     );
    // });
};

module.exports = {
    testMostPopular,
};
