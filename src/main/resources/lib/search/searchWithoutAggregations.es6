import { getCountAndStart, shouldIncludePrioHits } from './helpers/utils';
import { getPrioritizedElements } from './queryBuilder/getPrioritizedElements';
import { createQuery } from './queryBuilder/createQuery';
import { createFilters } from './queryBuilder/createFilters';
import { getPaths } from './resultListing/getPaths';
import {
    calculateHighlightText,
    getHighLight,
} from './resultListing/createPreparedHit';
import { runSearchQuery } from './runSearchQuery';
import { getConfig } from './helpers/config';
import { logger } from '../utils/logger';
import { getSearchWithoutAggregationsResult } from './helpers/cache';

export const noAggregationsBatchSize = 10;

const runSearch = (params) => {
    const { start: startParam, c: countParam, wordList, queryString } = params;

    const prioritiesItems = getPrioritizedElements(queryString);
    const config = getConfig();
    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        batchSize: noAggregationsBatchSize,
    });
    const queryParams = createQuery(
        queryString,
        {
            filters: createFilters(params, config, prioritiesItems),
            start,
            count,
        },
        config
    );

    let { hits = [], total = 0 } = runSearchQuery(queryParams, 0);

    if (shouldIncludePrioHits(params, config)) {
        hits = prioritiesItems.hits.concat(hits);
        total += prioritiesItems.hits.length;
    }

    hits = hits.map((hit) => {
        const highLight = getHighLight(hit, wordList);
        const highlightText = calculateHighlightText(highLight);
        const href = getPaths(hit).href;

        return {
            priority: !!hit.priority,
            displayName: hit.displayName,
            href: href,
            highlight: highlightText,
            publish: hit.publish,
            modifiedTime: hit.modifiedTime,
            score: hit._score,
            rawScore: hit._rawScore,
        };
    });

    return { total, hits, prioritiesItems };
};

export const searchWithoutAggregations = (params) => {
    const tsStart = Date.now();

    const { ord, start, c: count, queryString } = params;

    const cacheKey = `${ord}-${start}-${count}`;

    const { hits, total, prioritiesItems } = getSearchWithoutAggregationsResult(
        cacheKey,
        () => runSearch(params)
    );

    const tsEnd = Date.now();
    logger.info(
        `Decorator search (${
            tsEnd - tsStart
        }ms) <${ord}> => ${queryString} -- [${total} | ${
            prioritiesItems.hits.length
        }]`
    );

    return {
        total,
        hits,
    };
};
