import { query } from '/lib/xp/content';
import { getCountAndStart, getFalsettConfiguration } from './searchHelpFunctions';
import getPrioritiesedElements from './getPrioritizedElements';
import getQuery from './getQuery';
import getFilters from './getFilters';
import getPaths from './getPaths';
import { calculateHighlightText, getHighLight } from './prepareHits';
import getSearchWords from './getSearchWords';

export default function enonicSearchWithoutAggregations(params) {
    const wordList = params.ord ? getSearchWords(params.ord) : []; // 1. 2.
    const prioritiesItems = getPrioritiesedElements(wordList); // 3.
    const config = getFalsettConfiguration();
    const { start, count } = getCountAndStart(params);

    // 4.
    const ESQuery = getQuery(wordList, {
        filters: getFilters(params, config, prioritiesItems), // 6
        sort: '_score DESC', // 9
        start,
        count,
    });

    let { hits = [], total = 0 } = query(ESQuery); // 10.
    // add pri to hits if the first fasett and first subfasett, and start index is missin or 0
    if (
        (!params.f || (params.f === '0' && (!params.uf || params.uf === '0'))) &&
        (!params.start || params.start === '0')
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
    return {
        total: total,
        hits: hits,
    };
}
