import { createPreparedHit } from './resultListing/createPreparedHit';
import { runFullSearchQuery } from './runSearchQuery';
import { getFacetAggregations } from './helpers/facetAggregations';
import { logger } from '../utils/logger';
import { DaterangeParam, withAggregationsBatchSize } from '../constants';
import { getSearchWithAggregationsResult } from './helpers/cache';

const runSearch = (inputParams) => {
    const { wordList } = inputParams;

    const facetAggregations = getFacetAggregations(inputParams);

    const searchResult = runFullSearchQuery(
        inputParams,
        withAggregationsBatchSize
    );

    return {
        total: searchResult.total,
        hits: searchResult.hits.map((hit) => createPreparedHit(hit, wordList)),
        aggregations: { ...facetAggregations, ...searchResult.aggregations },
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
    } = params;

    const cacheKey = `${ord}-${start}-${count}-${facet}-${underfacets}-${daterange}-${sort}`;

    const { hits, total, aggregations } = getSearchWithAggregationsResult(
        cacheKey,
        () => runSearch(params)
    );

    const facetsLog = `${facet ? ` - ${facet}|${underfacets.join(', ')}` : ''}${
        daterange !== DaterangeParam.All ? ` / ${daterange}` : ''
    }`;

    const tsEnd = Date.now();

    logger.info(
        `Full search (${
            tsEnd - tsStart
        }ms) <${ord}${facetsLog}> => ${queryString} -- [${total}]`
    );

    return {
        total,
        hits,
        aggregations,
    };
};
