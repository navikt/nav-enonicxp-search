import { query } from '/lib/xp/content';
import { getEmptySearchResult, getEmptyTimePeriod } from './searchCache';
import {
    getAggregations,
    getCountAndStart,
    getDateRange,
    getFalsettConfiguration,
    getSearchWords,
} from './searchHelpFunctions';
import { tidsperiode } from './searchConstants';
import getPrioritiesedElements from './getPrioritizedElements';
import getQuery from './getQuery';
import getFilters from './getFilters';
import prepareHits from './prepareHits';
import getRepository from './repo';

export default function enonicSearch(params, skipCache) {
    const { f: falsett, uf: underFalsett, ord, start, debug, c: count, daterange } = params;
    const wordList = ord ? getSearchWords(ord) : []; // 1. 2.

    // get empty search from cache, or fallback to trying again but with forced skip cache bit
    if (wordList.length === 0 && !skipCache) {
        return getEmptySearchResult(JSON.stringify(params), () => enonicSearch(params, true));
    }
    const config = getFalsettConfiguration();
    const prioritiesItems = getPrioritiesedElements(wordList); // 3.
    const { start: startQuery, count: countQuery } = getCountAndStart({ start, count });
    const ESQuery = getQuery(wordList); // 4.
    const aggregations = getAggregations(ESQuery, config); // 5
    ESQuery.filters = getFilters(params, config, prioritiesItems); // 6.
    ESQuery.aggregations.Tidsperiode = tidsperiode;
    ESQuery.start = startQuery;
    ESQuery.count = countQuery;
    // run time period query, or fetch from cache if its an empty search with an earlier used combination on facet and subfacet
    let enonicResultSet;
    if (wordList.length > 0) {
        enonicResultSet = query(ESQuery);
    } else {
        const timePeriodKey = falsett + '_' + JSON.stringify(underFalsett);
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
        (!falsett || (falsett === '0' && (!underFalsett || underFalsett === '0'))) &&
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
            ...prepareHits(hit, wordList),
            id: hit._id || 0,
            keywords: hit.data.keywords || [],
        }));
        scores = getRepository().query({
            ...ESQuery,
            ...getCountAndStart({ start, count }),
            explain: true,
        });
        scores = scores.hits.reduce((agg, hit) => {
            return { ...agg, [hit.id]: hit.score };
        }, {});
    }
    // prepare the hits with highlighting and such
    hits = hits.map((hit) => {
        let preparedHit = prepareHits(hit, wordList);
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
    if (falsett) {
        facetsLog = ` - ${falsett}|${underFalsett ? [].concat(underFalsett).join(', ') : ''}`;
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
