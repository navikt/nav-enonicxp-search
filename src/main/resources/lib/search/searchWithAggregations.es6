import { getCountAndStart, shouldIncludePrioHits } from './helpers/utils';
import { getPrioritizedElements } from './queryBuilder/getPrioritizedElements';
import { createQuery } from './queryBuilder/createQuery';
import { createFilters } from './queryBuilder/createFilters';
import { createPreparedHit } from './resultListing/createPreparedHit';
import { getDateRanges, getDateRangeQueryString } from './helpers/dateRange';
import { runSearchQuery } from './runSearchQuery';
import { getConfig } from './helpers/config';
import { getAggregations } from './helpers/aggregations';
import { logger } from '../utils/logger';
import { getSearchWithAggregationsResult } from './helpers/cache';

const EMPTY_RESULT_SET = { ids: [], hits: [], count: 0, total: 0 };

export const withAggregationsBatchSize = 20;

const runSearch = (params) => {
    const {
        start: startParam,
        excludePrioritized,
        c: countParam,
        daterange,
        s: sorting,
        wordList,
        queryString,
    } = params;

    const config = getConfig();

    const prioritiesItems = excludePrioritized
        ? EMPTY_RESULT_SET
        : getPrioritizedElements(queryString);

    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        batchSize: withAggregationsBatchSize,
    });
    const queryParams = createQuery(queryString, { start, count }, config);
    const aggregations = getAggregations(queryParams, config);

    queryParams.filters = createFilters(params, config, prioritiesItems);
    aggregations.Tidsperiode = getDateRanges(queryParams);
    queryParams.query += getDateRangeQueryString(
        daterange,
        aggregations.Tidsperiode.buckets
    );

    let { hits, total } = runSearchQuery(queryParams, sorting);

    // The first facet and its first child facet ("Innhold -> Informasjon") should have a prioritized
    // set of hits added (when sorted by best match). Handle this and update the relevant aggregation counters:
    if (sorting === 0) {
        const priorityHitCount = prioritiesItems.hits.length;

        const firstFacet = aggregations.fasetter.buckets[0];
        if (firstFacet?.docCount) {
            firstFacet.docCount += priorityHitCount;
            const firstUnderFacet = firstFacet.underaggregeringer.buckets[0];
            if (firstUnderFacet?.docCount) {
                firstUnderFacet.docCount += priorityHitCount;
            }
        }

        if (shouldIncludePrioHits(params, config)) {
            aggregations.Tidsperiode.docCount += priorityHitCount;
            if (daterange === -1) {
                hits = prioritiesItems.hits.concat(hits);
                total += priorityHitCount;
            }
        }
    }

    // prepare the hits with highlighting and such
    hits = hits.map((hit) => createPreparedHit(hit, wordList));

    return {
        hits,
        total,
        aggregations,
        prioritiesItems,
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

    const { hits, total, aggregations, prioritiesItems } =
        getSearchWithAggregationsResult(cacheKey, () => runSearch(params));

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
        prioritized: [],
    };
};
