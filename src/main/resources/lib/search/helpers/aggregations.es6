import { forceArray } from '../../utils';
import { runSearchQuery } from '../runSearchQuery';

// As the aggregated result don't show hits for buckets containing zero hits, we need to manually add them to the
// aggregation result as a bucket with docCount = 0
const addZeroHitsFacetsToBuckets = (buckets, facets) =>
    forceArray(facets).map((facet) => {
        const common = {
            key: facet.name,
        };

        const foundBucket = buckets.find((bucket) => {
            return bucket.key.toLowerCase() === facet.facetKey.toLowerCase();
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
