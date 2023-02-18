import { getPrioritizedElements } from './queryBuilder/getPrioritizedElements';
import { createPreparedHit } from './resultListing/createPreparedHit';
import { runFullSearchQuery } from './runSearchQuery';
import { getFacetAggregations } from './helpers/facetAggregations';
import { logger } from '../utils/logger';
import { DaterangeParam, withAggregationsBatchSize } from '../constants';

const EMPTY_RESULT_SET = { ids: [], hits: [], count: 0, total: 0 };

const runSearch = (inputParams) => {
    const { excludePrioritized, wordList, queryString } = inputParams;

    const prioritizedItems = excludePrioritized
        ? EMPTY_RESULT_SET
        : getPrioritizedElements(queryString);

    const facetAggregations = getFacetAggregations(
        inputParams,
        prioritizedItems
    );

    const searchResult = runFullSearchQuery(
        inputParams,
        prioritizedItems,
        withAggregationsBatchSize
    );

    return {
        total: searchResult.total,
        hits: searchResult.hits.map((hit) => createPreparedHit(hit, wordList)),
        aggregations: { ...facetAggregations, ...searchResult.aggregations },
        prioritizedItems,
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

    const { hits, total, aggregations, prioritizedItems } = runSearch(params);
    // getSearchWithAggregationsResult(cacheKey, () => runSearch(params));

    const facetsLog = `${facet ? ` - ${facet}|${underfacets.join(', ')}` : ''}${
        daterange !== DaterangeParam.All ? ` / ${daterange}` : ''
    }`;

    const tsEnd = Date.now();

    logger.info(
        `Full search (${
            tsEnd - tsStart
        }ms) <${ord}${facetsLog}> => ${queryString} -- [${total} | ${
            prioritizedItems.hits.length
        }]`
    );

    return {
        total,
        hits,
        aggregations,
    };
};
