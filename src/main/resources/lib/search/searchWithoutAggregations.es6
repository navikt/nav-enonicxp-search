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
    const { wordList } = params;

    const queryParams = createSearchQueryParams(
        params,
        noAggregationsBatchSize
    );

    let { hits, total } = runSearchQuery(queryParams, true);

    hits = hits.map((hit) => {
        const highLight = getHighLight(hit, wordList);
        const highlightText = calculateHighlightText(highLight);
        const href = getPaths(hit).href;

        return {
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

    return { total, hits };
};

export const searchWithoutAggregations = (params) => {
    const tsStart = Date.now();

    const { ord, start, c: count, queryString } = params;

    const cacheKey = `${ord}-${start}-${count}`;

    const { hits, total } = getSearchWithoutAggregationsResult(cacheKey, () =>
        runSearch(params)
    );

    const tsEnd = Date.now();
    logger.info(
        `Decorator search (${
            tsEnd - tsStart
        }ms) <${ord}> => ${queryString} -- [${total}]`
    );

    return {
        total,
        hits,
    };
};
