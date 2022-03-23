import { getEmptySearchResult } from './helpers/cache';
import {
    getAggregations,
    getCountAndStart,
    getFacetConfiguration,
    getSortedResult,
    isSchemaSearch,
    shouldIncludePrioHits,
} from './helpers/utils';
import getPrioritizedElements from './queryBuilder/getPrioritizedElements';
import createQuery from './queryBuilder/createQuery';
import createFilters from './queryBuilder/createFilters';
import createPreparedHit from './resultListing/createPreparedHit';
import { generateSearchTerms } from './queryBuilder/generateSearchTerms';
import { getDateRanges, getDateRangeQueryString } from './helpers/dateRange';
import { parseAndValidateParams } from './helpers/validateInput';

const EMPTY_RESULT_SET = { ids: [], hits: [], count: 0, total: 0 };

export default function search(params, skipCache) {
    const tsStart = Date.now();

    const {
        f: facet,
        uf: underfacets,
        ord,
        start: startParam,
        excludePrioritized: excludePrioritizedParam,
        c: countParam,
        daterange,
        s: sorting,
    } = parseAndValidateParams(params);

    const { wordList, queryString } = generateSearchTerms(ord);
    const excludePrioritized = excludePrioritizedParam || isSchemaSearch(ord);

    // get empty search from cache, or fallback to trying again but with forced skip cache bit
    if (wordList.length === 0 && !skipCache) {
        return getEmptySearchResult(JSON.stringify(params), () => search(params, true));
    }
    const config = getFacetConfiguration();
    const prioritiesItems = excludePrioritized
        ? EMPTY_RESULT_SET
        : getPrioritizedElements(queryString);

    const { start, count } = getCountAndStart({ start: startParam, count: countParam, block: 20 });
    const ESQuery = createQuery(queryString, { start, count });
    const aggregations = getAggregations(ESQuery, config);
    ESQuery.filters = createFilters(params, config, prioritiesItems);
    aggregations.Tidsperiode = getDateRanges(ESQuery);

    if (daterange) {
        ESQuery.query += getDateRangeQueryString(daterange, aggregations.Tidsperiode.buckets);
    }

    let { hits, total } = getSortedResult(ESQuery, sorting);

    // The first facet and its first child facet ("Innhold -> Informasjon") should have a prioritized
    // set of hits added (when sorted by best match). Handle this and update the relevant aggregation counters:
    if (sorting === 0) {
        const priorityHitCount = prioritiesItems.hits.length;
        aggregations.fasetter.buckets[0].docCount += priorityHitCount;
        aggregations.fasetter.buckets[0].underaggregeringer.buckets[0].docCount += priorityHitCount;

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
        `Full search (${tsEnd - tsStart}ms) <${ord}${facetsLog}> => ${queryString} -- [${total} | ${
            prioritiesItems.hits.length
        }]`
    );

    return {
        total,
        hits,
        aggregations,
        prioritized: [],
    };
}
