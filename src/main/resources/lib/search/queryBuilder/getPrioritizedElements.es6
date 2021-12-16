import { query, get } from '/lib/xp/content';
import { getPriorities } from '../helpers/cache';
import { fieldsToSearch } from '../helpers/searchFields';

function getSearchPriorityContent(id) {
    const content = get({
        key: id,
    });

    if (content && content.type === 'no.nav.navno:internal-link') {
        return getSearchPriorityContent(content.data.target);
    }
    return content;
}

/*
    ----------- Retrieve the list of prioritised elements and check if the search would hit any of the elements -----
 */
export default function getPrioritizedElements(wordList) {
    const priorityIds = getPriorities();

    // add hits on pri content and not keyword
    let { hits } = query({
        query: `fulltext('${fieldsToSearch}', '${wordList.join(' ')}', 'OR')`,
        filters: {
            ids: {
                values: priorityIds,
            },
        },
    });

    // remove search-priority and add the content it points to instead
    hits = hits.reduce((list, el) => {
        if (el.type === 'navno.nav.no.search:search-priority') {
            const content = getSearchPriorityContent(el.data.content);
            if (content) {
                const missingContent = hits.filter((a) => a._id === content._id);
                const missingListContent = list.filter(({ _id }) => _id === content._id);
                if (missingContent.length === 0 && missingListContent.length === 0) {
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
    const ids = hits
        .map(({ _id }) => _id)
        .concat(priorityIds)
        .filter((value, index, self) => self.indexOf(value) === index); // Filter duplicates
    // return hits, and full list pri items
    return {
        ids,
        hits: hits.map((el) => ({
            ...el,
            priority: true,
        })),
    };
}
