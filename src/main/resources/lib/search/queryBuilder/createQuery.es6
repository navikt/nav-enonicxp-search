import getPathFilter from '../helpers/pathFilter';
import { componentFieldsToSearch, dataFieldsToSearch } from '../helpers/components';
/*
    ---------------- Inject the search words and count to the query and return the query --------------
 */
export default function createQuery(wordList, esQuery = {}) {
    const navApp = 'no.nav.navno:';
    let query =
        "fulltext('attachment.*, displayName^2, " +
        dataFieldsToSearch + " ," + componentFieldsToSearch + "' ,'" +
        wordList.join(' ') +
        "', 'AND') ";

    log.info(`Query: ${query}`)

    // add path filter
    query += getPathFilter();

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
