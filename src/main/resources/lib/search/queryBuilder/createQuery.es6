import { pathFilter } from '../helpers/pathFilter';
import { forceArray } from '../../utils';

export const createQuery = (queryString, queryParams = {}, config) => {
    const contentTypes = forceArray(config.data.contentTypes);
    const fieldsToSearch = forceArray(config.data.fields);

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
