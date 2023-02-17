import { pathFilter } from '../helpers/pathFilter';
import { forceArray } from '../../utils';
import { getConfig } from '../helpers/config';
import { createFilters } from './createFilters';
import { getCountAndStart } from '../helpers/utils';
import { withAggregationsBatchSize } from '../../constants';

// Don't match content with a future scheduled publish date
const publishedOnlyQuerySegment = () =>
    `publish.from < instant("${new Date().toISOString()}")`;

export const tidsperiodeRanges = [
    {
        name: 'Siste 7 dager',
        from: 'now-7d',
    },
    {
        name: 'Siste 30 dager',
        from: 'now-30d',
    },
    {
        name: 'Siste 12 måneder',
        from: 'now-12M',
    },
    {
        name: 'Eldre enn 12 måneder',
        to: 'now-12M',
    },
];

const tidsperiodeAggregations = {
    Tidsperiode: {
        dateRange: {
            field: 'publish.first',
            format: 'dd-MM-yyy',
            ranges: tidsperiodeRanges,
        },
    },
};

const facetsAggregations = {
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
};

const createQuery = ({ queryString, start, count, aggregations, filters }) => {
    const config = getConfig();

    const contentTypes = forceArray(config.data.contentTypes);
    const fieldsToSearch = forceArray(config.data.fields);

    const query = `fulltext('${fieldsToSearch}', '${queryString}', 'AND') AND ${publishedOnlyQuerySegment()} ${pathFilter}`;

    return {
        start,
        count,
        query,
        contentTypes,
        aggregations,
        filters,
    };
};

export const createFacetsAggregationsQuery = (queryString) => {
    return createQuery({
        queryString,
        start: 0,
        count: 0,
        aggregations: facetsAggregations,
    });
};

export const createSearchQueryParams = (params, prioritizedItems) => {
    const { start: startParam, c: countParam, queryString } = params;

    const filters = createFilters(params, prioritizedItems);

    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        batchSize: withAggregationsBatchSize,
    });

    return createQuery({
        queryString,
        start,
        count,
        aggregations: tidsperiodeAggregations,
        filters,
    });
};
