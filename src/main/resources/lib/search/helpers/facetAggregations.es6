import { forceArray } from '../../utils';
import { runSearchQuery } from '../runSearchQuery';
import { createFacetsAggregationsQuery } from '../queryBuilder/createQuery';
import { getConfig } from './config';

// As the aggregated result don't show hits for buckets containing zero hits, we need to manually add them to the
// aggregation result as a bucket with docCount = 0
const addNamesAndDocCountToFacetBuckets = (buckets, facets) =>
    forceArray(facets).map((facet) => {
        const common = {
            key: facet.facetKey,
            name: facet.name,
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
            ? addNamesAndDocCountToFacetBuckets(
                  foundUnderBuckets,
                  facet.underfasetter
              )
            : [];

        return {
            ...common,
            docCount: foundBucket.docCount,
            underaggregeringer: { buckets: underBuckets },
        };
    });

export const getFacetAggregations = (inputParams) => {
    const { queryString } = inputParams;

    const config = getConfig();

    const queryParams = createFacetsAggregationsQuery(queryString);

    const { aggregations } = runSearchQuery(queryParams);

    aggregations.fasetter.buckets = addNamesAndDocCountToFacetBuckets(
        aggregations.fasetter.buckets,
        config.data.fasetter
    );

    return aggregations;
};
