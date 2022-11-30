import pathFilter from '../helpers/pathFilter';
import { fieldsToSearch } from '../helpers/searchFields';

const navApp = 'no.nav.navno';

const contentTypes = [
    'media:document',
    'media:spreadsheet',
    ...[
        'content-page-with-sidemenus',
        'current-topic-page',
        'dynamic-page',
        'external-link',
        'guide-page',
        'large-table',
        'main-article',
        'main-article-chapter',
        'office-information',
        'overview',
        'page-list',
        'section-page',
        'situation-page',
        'themed-article-page',
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
