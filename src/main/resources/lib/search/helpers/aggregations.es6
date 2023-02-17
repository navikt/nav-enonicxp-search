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

export const getFacetAggregations = (inputParams, prioritizedItems) => {
    const { queryString, s: sorting } = inputParams;

    const config = getConfig();

    const queryParams = createFacetsAggregationsQuery(
        queryString,
        prioritizedItems
    );

    const { aggregations } = runSearchQuery(queryParams);

    aggregations.fasetter.buckets = addNamesAndDocCountToFacetBuckets(
        aggregations.fasetter.buckets,
        config.data.fasetter
    );

    // The first facet and its first child facet ("Innhold -> Informasjon") should have a prioritized
    // set of hits added (when sorted by best match). Handle this and update the relevant aggregation counters:
    if (sorting === 0) {
        const priorityHitCount = prioritizedItems.hits.length;

        const firstFacet = aggregations.fasetter.buckets[0];
        if (firstFacet?.docCount) {
            firstFacet.docCount += priorityHitCount;
            const firstUnderFacet = firstFacet.underaggregeringer.buckets[0];
            if (firstUnderFacet?.docCount) {
                firstUnderFacet.docCount += priorityHitCount;
            }
        }
    }

    return aggregations;
};
