import pathFilter from '../helpers/pathFilter';
import { fieldsToSearch } from '../helpers/searchFields';

const navApp = 'no.nav.navno';

const contentTypes = [
    'media:document',
    'media:spreadsheet',
    ...[
        'main-article',
        'section-page',
        'page-list',
        'office-information',
        'main-article-chapter',
        'large-table',
        'external-link',
        'dynamic-page',
        'content-page-with-sidemenus',
        'situation-page',
        'guide-page',
        'themed-article-page',
        'overview',
    ].map((item) => `${navApp}:${item}`),
];

export default function createQuery(queryString, esQuery = {}) {
    const query = `fulltext('${fieldsToSearch}', '${queryString}', 'AND') ${pathFilter}`;

    return {
        start: 0,
        count: 0,
        query,
        contentTypes,
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
