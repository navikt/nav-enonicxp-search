const t = require('/lib/xp/testing');

const libs = {
    utils: require('/lib/test-utils'),
};

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
    const result = libs.utils.multipleSearch(mostPopularTerms);

    // no zero results
    Object.keys(result).forEach(term => {
        t.assertTrue(result[term].length > 0, `No hits for ${term}`);
    });
};

// const noDuplicates = () => {
//     const searchTerms = mostPopularTerms.slice(0, 5);
// };
module.exports = {
    testMostPopular,
};
