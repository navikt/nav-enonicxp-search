import { query } from '/lib/xp/content';
import { getEmptySearchResult, getEmptyTimePeriod } from './helpers/cache';
import {
    getAggregations,
    getCountAndStart,
    getDateRange,
    getFacetConfiguration,
} from './helpers/utils';
import { tidsperiode } from './helpers/constants';
import getPrioritizedElements from './queryBuilder/getPrioritizedElements';
import createQuery from './queryBuilder/createQuery';
import createFilters from './queryBuilder/createFilters';
import createPreparedHit from './resultListing/createPreparedHit';
import getRepository from './helpers/repo';
import getSearchWords from './queryBuilder/getSearchWords';

export default function search(params, skipCache) {
    const { f: facet, uf: childFacet, ord, start, debug, c: count, daterange } = params;
    const wordList = ord ? getSearchWords(ord) : []; // 1. 2.

    // get empty search from cache, or fallback to trying again but with forced skip cache bit
    if (wordList.length === 0 && !skipCache) {
        return getEmptySearchResult(JSON.stringify(params), () => search(params, true));
    }
    const config = getFacetConfiguration();
    const prioritiesItems = getPrioritizedElements(wordList); // 3.
    const { start: startQuery, count: countQuery } = getCountAndStart({ start, count });
    const ESQuery = createQuery(wordList); // 4.
    const aggregations = getAggregations(ESQuery, config); // 5
    ESQuery.filters = createFilters(params, config, prioritiesItems); // 6.
    ESQuery.aggregations.Tidsperiode = tidsperiode;
    ESQuery.start = startQuery;
    ESQuery.count = countQuery;
    // run time period query, or fetch from cache if its an empty search with an earlier used combination on facet and subfacet
    let enonicResultSet;
    if (wordList.length > 0) {
        enonicResultSet = query(ESQuery);
    } else {
        const timePeriodKey = facet + '_' + JSON.stringify(childFacet);
        enonicResultSet = getEmptyTimePeriod(timePeriodKey, () => query(ESQuery));
    }
    aggregations.Tidsperiode = enonicResultSet.aggregations.Tidsperiode; // 7.

    if (daterange) {
        ESQuery.query += getDateRange(daterange, aggregations.Tidsperiode.buckets); // 8.;
    }

    ESQuery.sort = params.s && params.s !== '0' ? 'publish.from DESC' : '_score DESC'; // 9.

    let { hits, total } = query({
        ...ESQuery,
    }); // 10.

    // add pri to hits if the first fasett and first subfasett, and start index is missin or 0
    if (
        params.debug !== 'true' &&
        (!facet || (facet === '0' && (!childFacet || childFacet === '0'))) &&
        (!start || start === '0')
    ) {
        hits = prioritiesItems.hits.concat(hits);
        total += prioritiesItems.hits.length;

        // add pri count to aggregations as well
        aggregations.fasetter.buckets[0].docCount += prioritiesItems.hits.length;
        aggregations.fasetter.buckets[0].underaggregeringer.buckets[0].docCount +=
            prioritiesItems.hits.length;
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
        `<${ord}${facetsLog}> => ${JSON.stringify(wordList)} -- [${total} | ${
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
