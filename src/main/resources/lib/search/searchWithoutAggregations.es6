import { query } from '/lib/xp/content';
import { getCountAndStart, getFacetConfiguration, shouldIncludePrioHits } from './helpers/utils';
import getPrioritizedElements from './queryBuilder/getPrioritizedElements';
import createQuery from './queryBuilder/createQuery';
import createFilters from './queryBuilder/createFilters';
import getPaths from './resultListing/getPaths';
import { calculateHighlightText, getHighLight } from './resultListing/createPreparedHit';
import { generateSearchTerms } from './queryBuilder/generateSearchTerms';

export const noAggregationsBatchSize = 10;

export default function searchWithoutAggregations(params) {
    const tsStart = Date.now();

    const { ord, start: startParam, c: countParam } = params;
    const { wordList, queryString } = generateSearchTerms(ord);
    const prioritiesItems = getPrioritizedElements(queryString);
    const config = getFacetConfiguration();
    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        batchSize: noAggregationsBatchSize,
    });
    const ESQuery = createQuery(queryString, {
        filters: createFilters(params, config, prioritiesItems),
        sort: '_score DESC',
        start,
        count,
    });
    let { hits = [], total = 0 } = query(ESQuery);

    if (shouldIncludePrioHits(params)) {
        hits = prioritiesItems.hits.concat(hits);
        total += prioritiesItems.hits.length;
    }

    hits = hits.map((el) => {
        const highLight = getHighLight(el, wordList);
        const highlightText = calculateHighlightText(highLight);
        const href = getPaths(el).href;

        return {
            priority: !!el.priority,
            displayName: el.displayName,
            href: href,
            highlight: highlightText,
            publish: el.publish,
            modifiedTime: el.modifiedTime,
        };
    });
    const tsEnd = Date.now();
    log.info(
        `Decorator search (${tsEnd - tsStart}ms) <${ord}> => ${queryString} -- [${total} | ${
            prioritiesItems.hits.length
        }]`
    );

    return {
        total: total,
        hits: hits,
    };
}
