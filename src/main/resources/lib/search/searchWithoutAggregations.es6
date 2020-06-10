import { query } from '/lib/xp/content';
import { getCountAndStart, getFacetConfiguration } from './helpers/utils';
import getPrioritizedElements from './queryBuilder/getPrioritizedElements';
import createQuery from './queryBuilder/createQuery';
import createFilters from './queryBuilder/createFilters';
import getPaths from './resultListing/getPaths';
import { calculateHighlightText, getHighLight } from './resultListing/createPreparedHit';
import getSearchWords from './queryBuilder/getSearchWords';

export default function searchWithoutAggregations(params) {
    const { f: facet, uf: childFacet, ord, start } = params;
    const wordList = ord ? getSearchWords(ord) : []; // 1. 2.
    const prioritiesItems = getPrioritizedElements(wordList); // 3.
    const config = getFacetConfiguration();

    // 4.
    const ESQuery = createQuery(wordList, {
        filters: createFilters(params, config, prioritiesItems), // 6
        sort: '_score DESC', // 9
        ...getCountAndStart(params),
    });

    let { hits = [], total = 0 } = query(ESQuery); // 10.
    // add pri to hits if the first fasett and first subfasett, and start index is missin or 0
    if (
        (!facet || (facet === '0' && (!childFacet || childFacet === '0'))) &&
        (!start || start === '0')
    ) {
        hits = prioritiesItems.hits.concat(hits);
        total += prioritiesItems.hits.length;
    }
    // 11.
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
        `Decorator search <${ord}> => ${JSON.stringify(wordList)} -- [${total} | ${
            prioritiesItems.hits.length
        }]`
    );

    return {
        total: total,
        hits: hits,
    };
}
