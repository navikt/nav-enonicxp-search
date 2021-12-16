import pathFilter from '../helpers/pathFilter';
import { fieldsToSearch } from '../helpers/searchFields';
/*
    ---------------- Inject the search words and count to the query and return the query --------------
 */

const navApp = 'no.nav.navno:';

export default function createQuery(wordList, esQuery = {}) {
    log.info(`Word list: ${JSON.stringify(wordList)}`);

    const query = `fulltext('${fieldsToSearch}', '${wordList.join(' ')}', 'AND') ${pathFilter}`;

    log.info(`Query: ${query}`);

    return {
        start: 0,
        count: 0,
        query: query,
        contentTypes: [
            navApp + 'main-article',
            navApp + 'section-page',
            navApp + 'page-list',
            navApp + 'office-information',
            navApp + 'main-article-chapter',
            navApp + 'large-table',
            navApp + 'external-link',
            navApp + 'dynamic-page',
            navApp + 'content-page-with-sidemenus',
            navApp + 'situation-page',
            navApp + 'employer-situation-page',
            'media:document',
            'media:spreadsheet',
        ],
        aggregations: {
            fasetter: {
                terms: {
                    field: 'x.no-nav-navno.fasetter.fasett',
                },
                aggregations: {
                    underaggregeringer: {
                        terms: {
                            field: 'x.no-nav-navno.fasetter.underfasett',
                            size: 30,
                        },
                    },
                },
            },
        },
        ...esQuery,
    };
}
