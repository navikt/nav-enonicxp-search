import { query } from '/lib/xp/content';
import { getSearchPriorityContent } from './searchHelpFunctions';
import { getPriorities } from './searchCache';

/*
    ----------- Retrieve the list of prioritised elements and check if the search would hit any of the elements -----
 */

export default function getPrioritiesedElements(wordList) {
    const priorityIds = getPriorities();

    // add hits on pri content and not keyword
    let hits = query({
        query:
            'fulltext("data.text, data.ingress, displayName, data.abstract, data.keywords, data.enhet.*, data.interface.*" ,"' +
            wordList.join(' ') +
            '", "OR") ',
        filters: {
            ids: {
                values: priorityIds,
            },
        },
    }).hits;

    // remove search-priority and add the content it points to instead
    hits = hits.reduce((list, el) => {
        if (el.type === 'navno.nav.no.search:search-priority') {
            const content = getSearchPriorityContent(el.data.content);
            if (content) {
                const missingContent =
                    hits.filter((a) => {
                        return a._id === content._id;
                    }).length === 0;

                if (missingContent) {
                    list.push(content);
                }
            } else {
                log.error(`Missing content for prioritized search element ${el._path}`);
            }
        } else {
            list.push(el);
        }
        return list;
    }, []);

    // return hits, and full list pri items
    return {
        ids: priorityIds,
        hits: hits.map((el) => ({
            ...el,
            priority: true,
        })),
    };
}
