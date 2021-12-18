import { query } from '/lib/xp/content';
import { getCountAndStart, getFacetConfiguration, isSchemaSearch } from './helpers/utils';
import getPrioritizedElements from './queryBuilder/getPrioritizedElements';
import createQuery from './queryBuilder/createQuery';
import createFilters from './queryBuilder/createFilters';
import getPaths from './resultListing/getPaths';
import { calculateHighlightText, getHighLight } from './resultListing/createPreparedHit';
import { generateSearchTerms } from './queryBuilder/generateSearchTerms';

export default function searchWithoutAggregations(params) {
    const { f: facet, uf: childFacet, ord, start: startParam, c: countParam } = params;

    const { wordList, queryString } = generateSearchTerms(ord);

    const prioritiesItems = getPrioritizedElements(queryString);
    const config = getFacetConfiguration();

    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        block: 10,
    });

    const ESQuery = createQuery(queryString, {
        filters: createFilters(params, config, prioritiesItems),
        sort: '_score DESC', // 9
        start,
        count,
    });

    let { hits = [], total = 0 } = query(ESQuery);

    // add pri to hits if the first fasett and first subfasett, and start index is missin or 0
    if (
        !isSchemaSearch(ord) &&
        (!facet || (facet === '0' && (!childFacet || childFacet === '0'))) &&
        (!startParam || startParam === '0')
    ) {
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

    // Logging of search
    // <queryString> => [searchWords] -- [numberOfHits | prioritizedHits]
    log.info(
        `Decorator search <${ord}> => ${queryString} -- [${total} | ${prioritiesItems.hits.length}]`
    );

    return {
        total: total,
        hits: hits,
    };
}
