import getPathFilter from '../helpers/pathFilter';
import componentFieldsToSearch from '../helpers/components';
/*
    ---------------- Inject the search words and count to the query and return the query --------------
 */
export default function createQuery(wordList, esQuery = {}) {
    const navApp = 'no.nav.navno:';
    let query =
        'fulltext("attachment.*, data.title^5, data.text, data.ingress, data.description, displayName^2, data.abstract, data.keywords^15, data.enhet.*, data.interface.*, ' +
        componentFieldsToSearch.join(', ') + '" ,"' +
        wordList.join(' ') +
        '", "AND") ';

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
