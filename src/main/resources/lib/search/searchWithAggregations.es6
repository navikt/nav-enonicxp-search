import { getCountAndStart, shouldIncludePrioHits } from './helpers/utils';
import { getPrioritizedElements } from './queryBuilder/getPrioritizedElements';
import { createQuery } from './queryBuilder/createQuery';
import { createFilters } from './queryBuilder/createFilters';
import createPreparedHit from './resultListing/createPreparedHit';
import { getDateRanges, getDateRangeQueryString } from './helpers/dateRange';
import { runSearchQuery } from './runSearchQuery';
import { getFacetsConfig } from './helpers/facetsConfig';
import { getAggregations } from './helpers/aggregations';

const EMPTY_RESULT_SET = { ids: [], hits: [], count: 0, total: 0 };

export const withAggregationsBatchSize = 20;

export const searchWithAggregations = (params, skipCache) => {
    const tsStart = Date.now();

    const {
        f: facet,
        uf: underfacets,
        ord,
        start: startParam,
        excludePrioritized,
        c: countParam,
        daterange,
        s: sorting,
        wordList,
        queryString,
    } = params;

    // get empty search from cache, or fallback to trying again but with forced skip cache bit
    // if (wordList.length === 0 && !skipCache) {
    //     return getEmptySearchResult(JSON.stringify(params), () =>
    //         searchWithAggregations(params, true)
    //     );
    // }

    const config = getFacetsConfig();

    const prioritiesItems = excludePrioritized
        ? EMPTY_RESULT_SET
        : getPrioritizedElements(queryString);

    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        batchSize: withAggregationsBatchSize,
    });
    const queryParams = createQuery(queryString, { start, count });
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

        if (shouldIncludePrioHits(params)) {
            aggregations.Tidsperiode.docCount += priorityHitCount;
            if (daterange === -1) {
                hits = prioritiesItems.hits.concat(hits);
                total += priorityHitCount;
            }
        }
    }

    // prepare the hits with highlighting and such
    hits = hits.map((hit) => createPreparedHit(hit, wordList));

    let facetsLog = '';
    if (facet) {
        facetsLog = ` - ${facet}|${underfacets.join(', ')}`;
    }

    if (daterange !== -1) {
        facetsLog += ` / ${daterange}`;
    }

    const tsEnd = Date.now();
    log.info(
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
