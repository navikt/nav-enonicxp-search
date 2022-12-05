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

export const createQuery = (queryString, queryParams = {}) => {
    const query = `fulltext('${fieldsToSearch}', '${queryString}', 'AND') ${pathFilter}`;

    return {
        start: 0,
        count: 0,
        query,
        contentTypes,
        aggregations: {
            fasetter: {
                terms: {
                    field: 'facets.facet',
                },
                aggregations: {
                    underaggregeringer: {
                        terms: {
                            field: 'facets.underfacets',
                            size: 30,
                        },
                    },
                },
            },
        },
        ...queryParams,
    };
};
