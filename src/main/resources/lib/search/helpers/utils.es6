import contextLib from '/lib/xp/context';
import contentLib from '/lib/xp/content';
import { forceArray, getUnixTimeFromDateTimeString } from '../../nav-utils';

const oneYear = 1000 * 3600 * 24 * 365;

const FACETS_CONTENT_KEY = '/www.nav.no/fasetter';

export const isExactSearch = (queryString) =>
    (queryString.startsWith('"') && queryString.endsWith('"')) ||
    (queryString.startsWith("'") && queryString.endsWith("'"));

export const formatExactSearch = (queryString) =>
    `"${queryString.replace(/["']/g, '')}"`;

// Matches form numbers
export const isFormSearch = (ord) => {
    return /^\d\d-\d\d\.\d\d$/.test(ord);
};

export const getCountAndStart = ({ start, count, batchSize }) => {
    return { start: start * batchSize, count: (count - start) * batchSize };
};

// As the aggregated result don't show hits for buckets containing zero hits, we need to manually add them to the
// aggregation result as a bucket with docCount = 0
const addZeroHitsFacetsToBuckets = (buckets, facets) =>
    forceArray(facets).map((facet) => {
        const foundBucketIndex = buckets.indexOf(
            (bucket) => bucket.key === facet.name.toLowerCase()
        );
        if (foundBucketIndex === -1) {
            return {
                key: facet.name,
                docCount: 0,
                underaggregeringer: { buckets: [] },
            };
        }

        const foundBucket = buckets[foundBucketIndex];

        const foundUnderBuckets = foundBucket.underaggregeringer?.buckets;
        const underBuckets = foundUnderBuckets
            ? addZeroHitsFacetsToBuckets(foundUnderBuckets, facet.underfasetter)
            : [];

        return {
            key: facet.name,
            docCount: foundBucket.docCount,
            underaggregeringer: { buckets: underBuckets },
        };
    });

export const getAggregations = (ESQuery, config) => {
    const { aggregations } = contentLib.query({ ...ESQuery, count: 0 });
    aggregations.fasetter.buckets = addZeroHitsFacetsToBuckets(
        aggregations.fasetter.buckets,
        config.data.fasetter
    );
    return aggregations;
};

export const getFacetConfiguration = () => {
    return contentLib.get({ key: FACETS_CONTENT_KEY });
};

const resultWithCustomScoreWeights = (result) => ({
    ...result,
    hits: result.hits
        .map((hit) => {
            const { _score: _rawScore, data, language, modifiedTime } = hit;
            if (!_rawScore) {
                return hit;
            }

            let scoreFactor = 1;

            // Pages targeted towards private individuals should be weighted higher
            if (data && data.audience === 'person') {
                scoreFactor *= 1.25;
            }

            // Norwegian languages should be weighted slightly higher
            if (language === 'no') {
                scoreFactor *= 1.1;
            } else if (language === 'nn') {
                scoreFactor *= 1.05;
            }

            const currentTime = Date.now();
            const modifiedUnixTime = getUnixTimeFromDateTimeString(
                modifiedTime
            );
            const modifiedDelta = currentTime - modifiedUnixTime;

            // If the content was last modified more than one year ago, apply a gradually lower weight
            // down to a lower bound of 0.5 if last modified more than two years ago
            if (modifiedDelta > oneYear) {
                const twoYearsAgo = currentTime - oneYear * 2;
                const timeFactor =
                    0.5 +
                    (0.5 * Math.max(modifiedUnixTime - twoYearsAgo, 0)) /
                        oneYear;
                scoreFactor *= timeFactor;
            }

            return {
                ...hit,
                _score: _rawScore * scoreFactor,
                _rawScore,
            };
        })
        .sort((a, b) => b._score - a._score),
});

export const getSortedResult = (ESQuery, sort) => {
    if (sort === 0) {
        return resultWithCustomScoreWeights(contentLib.query(ESQuery));
    }

    return contentLib.query({
        ...ESQuery,
        sort: 'publish.first DESC, createdTime DESC',
    });
};

export const runInContext = (func, params) => {
    return contextLib.run(
        {
            repository: 'com.enonic.cms.default',
            branch: 'master',
            user: {
                login: 'su',
                userStore: 'system',
            },
            principals: ['role:system.admin'],
        },
        () => func(params)
    );
};

// Prioritized elements should be included with the first batch for queries for the first facet + underfacet
export const shouldIncludePrioHits = (params) => {
    const { f, uf, ord, start } = params;

    return (
        !isFormSearch(ord) &&
        f === 0 &&
        (uf.length === 0 || (uf.length === 1 && uf[0] === 0)) &&
        start === 0
    );
};
