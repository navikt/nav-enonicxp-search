import { shouldIncludePrioHits } from './helpers/utils';
import { getPrioritizedElements } from './queryBuilder/getPrioritizedElements';
import { getPaths } from './resultListing/getPaths';
import {
    calculateHighlightText,
    getAudienceForHit,
    getHighLight,
} from './resultListing/createPreparedHit';
import { runSearchQuery } from './runSearchQuery';
import { logger } from '../utils/logger';
import { getSearchWithoutAggregationsResult } from './helpers/cache';
import { noAggregationsBatchSize } from '../constants';
import { createSearchQueryParams } from './queryBuilder/createQuery';

const runSearch = (params) => {
    const { wordList, queryString } = params;

    const prioritiesItems = getPrioritizedElements(queryString);

    const queryParams = createSearchQueryParams(
        params,
        prioritiesItems,
        noAggregationsBatchSize
    );

    let { hits, total } = runSearchQuery(queryParams, true);

    if (shouldIncludePrioHits(params)) {
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
            audience: getAudienceForHit(hit, href),
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
