import { shouldIncludePrioHits } from './helpers/utils';
import { getPrioritizedElements } from './queryBuilder/getPrioritizedElements';
import {
    createDaterangeQueryParams,
    createSearchQueryParams,
    tidsperiodeRanges,
} from './queryBuilder/createQuery';
import { createPreparedHit } from './resultListing/createPreparedHit';
import { runSearchQuery, runSearchQuery2 } from './runSearchQuery';
import { getFacetAggregations } from './helpers/aggregations';
import { logger } from '../utils/logger';
import { withAggregationsBatchSize } from '../constants';

const EMPTY_RESULT_SET = { ids: [], hits: [], count: 0, total: 0 };

const runSearch = (inputParams) => {
    const {
        excludePrioritized,
        daterange,
        s: sorting,
        wordList,
        queryString,
    } = inputParams;

    const prioritizedItems = excludePrioritized
        ? EMPTY_RESULT_SET
        : getPrioritizedElements(queryString);

    const facetAggs = getFacetAggregations(inputParams, prioritizedItems);

    let {
        hits,
        total,
        aggregations: daterangeAggs,
    } = runSearchQuery2(
        inputParams,
        prioritizedItems,
        withAggregationsBatchSize
    );

    daterangeAggs.Tidsperiode.docCount = total;

    // Sort buckets from most recent to oldest, and transform the keys
    // to what the frontend expects
    daterangeAggs.Tidsperiode.buckets = daterangeAggs.Tidsperiode.buckets
        .sort((a, b) => (a.key > b.key ? 1 : -1))
        .map((bucket, index) => ({
            ...bucket,
            key: tidsperiodeRanges[index].name,
        }));

    if (daterange !== -1) {
        const daterangeBucket = daterangeAggs.Tidsperiode.buckets[daterange];

        const queryParams = createDaterangeQueryParams(
            inputParams,
            daterangeBucket,
            withAggregationsBatchSize
        );
        const result = runSearchQuery(queryParams, sorting);

        hits = result.hits;
        total = result.total;
    }

    if (shouldIncludePrioHits(inputParams)) {
        const priorityHitCount = prioritizedItems.hits.length;
        daterangeAggs.Tidsperiode.docCount += priorityHitCount;
        if (daterange === -1) {
            hits = prioritizedItems.hits.concat(hits);
            total += priorityHitCount;
        }
    }

    return {
        total,
        hits: hits.map((hit) => createPreparedHit(hit, wordList)),
        aggregations: { ...facetAggs, ...daterangeAggs },
        prioritiesItems: prioritizedItems,
    };
};

export const searchWithAggregations = (params) => {
    const tsStart = Date.now();

    const {
        f: facet,
        uf: underfacets,
        ord,
        daterange,
        queryString,
        start,
        c: count,
        s: sort,
        excludePrioritized,
    } = params;

    const cacheKey = `${ord}-${start}-${count}-${facet}-${underfacets}-${daterange}-${sort}-${excludePrioritized}`;

    const { hits, total, aggregations, prioritiesItems } = runSearch(params);
    // getSearchWithAggregationsResult(cacheKey, () => runSearch(params));

    const facetsLog = `${facet ? ` - ${facet}|${underfacets.join(', ')}` : ''}${
        daterange !== -1 ? ` / ${daterange}` : ''
    }`;

    const tsEnd = Date.now();

    logger.info(
        `Full search (${
            tsEnd - tsStart
        }ms) <${ord}${facetsLog}> => ${queryString} -- [${total} | ${
            prioritiesItems.hits.length
        }]`
    );

    return {
        total,
        hits,
        aggregations,
    };
};
