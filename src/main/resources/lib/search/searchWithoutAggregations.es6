import { getCountAndStart, shouldIncludePrioHits } from './helpers/utils';
import { getPrioritizedElements } from './queryBuilder/getPrioritizedElements';
import { createQuery } from './queryBuilder/createQuery';
import { createFilters } from './queryBuilder/createFilters';
import getPaths from './resultListing/getPaths';
import {
    calculateHighlightText,
    getHighLight,
} from './resultListing/createPreparedHit';
import { runSearchQuery } from './runSearchQuery';
import { getFacetsConfig } from './helpers/facetsConfig';

export const noAggregationsBatchSize = 10;

export const searchWithoutAggregations = (params) => {
    const tsStart = Date.now();

    const {
        ord,
        start: startParam,
        c: countParam,
        wordList,
        queryString,
    } = params;

    const prioritiesItems = getPrioritizedElements(queryString);
    const config = getFacetsConfig();
    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        batchSize: noAggregationsBatchSize,
    });
    const ESQuery = createQuery(queryString, {
        filters: createFilters(params, config, prioritiesItems),
        start,
        count,
    });

    let { hits = [], total = 0 } = runSearchQuery(ESQuery, 0);

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
        };
    });

    const tsEnd = Date.now();
    log.info(
        `Decorator search (${
            tsEnd - tsStart
        }ms) <${ord}> => ${queryString} -- [${total} | ${
            prioritiesItems.hits.length
        }]`
    );

    return {
        total: total,
        hits: hits,
    };
};
