import { getEmptySearchResult } from './helpers/cache';
import {
    getAggregations,
    getCountAndStart,
    getFacetConfiguration,
    getSortedResult,
    isSchemaSearch,
} from './helpers/utils';
import getPrioritizedElements from './queryBuilder/getPrioritizedElements';
import createQuery from './queryBuilder/createQuery';
import createFilters from './queryBuilder/createFilters';
import createPreparedHit from './resultListing/createPreparedHit';
import getRepository from './helpers/repo';
import getSearchWords from './queryBuilder/getSearchWords';
import { getDateRanges, getDateRangeQueryString } from './helpers/dateRange';

const EMPTY_RESULT_SET = { ids: [], hits: [], count: 0, total: 0 };

export default function search(params, skipCache) {
    const {
        f: facet,
        uf: childFacet,
        ord,
        start: startParam,
        debug,
        excludePrioritized: excludePrioritizedParam = 'false',
        c: countParam,
        daterange,
    } = params;

    let wordList = [];
    if (isSchemaSearch(ord)) {
        wordList = [ord];
    } else {
        wordList = ord ? getSearchWords(ord) : []; // 1. 2.
    }
    const excludePrioritized = excludePrioritizedParam === 'true' || isSchemaSearch(ord);

    // get empty search from cache, or fallback to trying again but with forced skip cache bit
    if (wordList.length === 0 && !skipCache) {
        return getEmptySearchResult(JSON.stringify(params), () => search(params, true));
    }
    const config = getFacetConfiguration();
    const prioritiesItems = excludePrioritized
        ? EMPTY_RESULT_SET
        : getPrioritizedElements(wordList); // 3.

    const { start, count } = getCountAndStart({ start: startParam, count: countParam });
    const ESQuery = createQuery(wordList, { start, count }); // 4.
    const aggregations = getAggregations(ESQuery, config); // 5
    ESQuery.filters = createFilters(params, config, prioritiesItems); // 6.
    aggregations.Tidsperiode = getDateRanges(ESQuery); // 7.

    if (daterange) {
        ESQuery.query += getDateRangeQueryString(daterange, aggregations.Tidsperiode.buckets); // 8.
    }

    let { hits, total } = getSortedResult(ESQuery, params.s, count); // 9. 10.

    // The first facet and its first child facet ("Innhold -> Informasjon") should have a prioritized
    // set of hits added. Handle this and update the relevant aggregation counters:
    const priHitCount = prioritiesItems.hits.length;
    aggregations.fasetter.buckets[0].docCount += priHitCount;
    aggregations.fasetter.buckets[0].underaggregeringer.buckets[0].docCount += priHitCount;
    if (
        params.debug !== 'true' &&
        (!facet || (facet === '0' && (!childFacet || childFacet === '0'))) &&
        (!startParam || startParam === '0')
    ) {
        hits = prioritiesItems.hits.concat(hits);
        total += priHitCount;

        aggregations.Tidsperiode.buckets = aggregations.Tidsperiode.buckets.map((bucket) => ({
            ...bucket,
            docCount: bucket.docCount + priHitCount,
        }));
        aggregations.Tidsperiode.docCount += priHitCount;
    }

    let scores = {};
    let prioritized = [];
    if (debug === 'true') {
        prioritized = prioritiesItems.hits.map((hit) => ({
            ...createPreparedHit(hit, wordList),
            id: hit._id || 0,
            keywords: hit.data.keywords || [],
        }));
        scores = getRepository().query({
            ...ESQuery,
            explain: true,
        });
        scores = scores.hits.reduce((agg, hit) => {
            return { ...agg, [hit.id]: hit.score };
        }, {});
    }

    // prepare the hits with highlighting and such
    hits = hits.map((hit) => {
        let preparedHit = createPreparedHit(hit, wordList);
        if (params.debug) {
            // if debug on, add
            // 1. score
            // 2. id
            preparedHit = {
                ...preparedHit,
                id: hit._id || 0,
                score: scores[hit._id] || 0,
                keywords: hit.data.keywords || [],
            };
        }
        return preparedHit;
    });
    // Logging of search
    // <queryString - mainfacet|subfacets / timeInterval> => [searchWords] -- [numberOfHits | prioritizedHits]
    let facetsLog = '';
    if (facet) {
        facetsLog = ` - ${facet}|${childFacet ? [].concat(childFacet).join(', ') : ''}`;
    }
    if (daterange && daterange !== '-1') {
        facetsLog += ` / ${daterange}`;
    }
    log.info(
        `Full search <${ord}${facetsLog}> => ${JSON.stringify(wordList)} -- [${total} | ${
            prioritiesItems.hits.length
        }]`
    );

    return {
        total,
        hits,
        aggregations,
        prioritized,
    };
}
