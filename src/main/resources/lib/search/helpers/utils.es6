import contentLib from '/lib/xp/content';
import { forceArray } from '../../utils';
import { runSearchQuery } from '../runSearchQuery';

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
        const common = {
            key: facet.name,
        };

        const foundBucket = buckets.find((bucket) => {
            return bucket.key === facet.name.toLowerCase();
        });
        if (!foundBucket) {
            return {
                ...common,
                docCount: 0,
                underaggregeringer: { buckets: [] },
            };
        }

        const foundUnderBuckets = foundBucket.underaggregeringer?.buckets;
        const underBuckets = foundUnderBuckets
            ? addZeroHitsFacetsToBuckets(foundUnderBuckets, facet.underfasetter)
            : [];

        return {
            ...common,
            docCount: foundBucket.docCount,
            underaggregeringer: { buckets: underBuckets },
        };
    });

export const getAggregations = (queryParams, config) => {
    const { aggregations } = runSearchQuery({ ...queryParams, count: 0 });

    aggregations.fasetter.buckets = addZeroHitsFacetsToBuckets(
        aggregations.fasetter.buckets,
        config.data.fasetter
    );

    return aggregations;
};

export const getFacetConfiguration = () => {
    return contentLib.get({ key: FACETS_CONTENT_KEY });
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
