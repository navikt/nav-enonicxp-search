import { pathFilter } from '../helpers/pathFilter';
import { forceArray } from '../../utils';

// Don't match content with a future scheduled publish date
const publishedOnlyQuerySegment = () =>
    `publish.from < instant("${new Date().toISOString()}")`;

export const createQuery = (queryString, queryParams = {}, config) => {
    const contentTypes = forceArray(config.data.contentTypes);
    const fieldsToSearch = forceArray(config.data.fields);

    const query = `fulltext('${fieldsToSearch}', '${queryString}', 'AND') AND ${publishedOnlyQuerySegment()} ${pathFilter}`;

    return {
        start: 0,
        count: 0,
        ...queryParams,
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
            Tidsperiode: {
                dateRange: {
                    field: 'publish.first',
                    format: 'dd-MM-yyy',
                    ranges: [
                        {
                            from: 'now-7d',
                        },
                        {
                            from: 'now-30d',
                        },
                        {
                            from: 'now-12M',
                        },
                        {
                            to: 'now-12M',
                        },
                    ],
                },
            },
        },
    };
};
