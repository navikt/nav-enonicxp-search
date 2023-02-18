import { forceArray } from '../../utils';
import { getConfig } from '../helpers/config';
import { createCommonFilters, createSearchFilters } from './createFilters';
import { getCountAndStart } from '../helpers/utils';
import {
    getDaterangeQueryStringFromBucket,
    daterangeAggregationsRanges,
} from '../helpers/dateRange';
import { pathFilter } from '../helpers/pathFilter';
import { SortParam } from '../../constants';

// Don't match content with a future scheduled publish date
const publishedOnlyQuerySegment = () =>
    `publish.from < instant("${new Date().toISOString()}")`;

const tidsperiodeAggregations = {
    Tidsperiode: {
        dateRange: {
            field: 'publish.first',
            format: 'yyyy-MM-dd',
            ranges: daterangeAggregationsRanges,
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

const createQuery = ({
    queryString,
    start,
    count,
    aggregations,
    filters,
    extraQuerySegment,
}) => {
    const config = getConfig();

    const contentTypes = forceArray(config.data.contentTypes);
    const fieldsToSearch = forceArray(config.data.fields);

    const query = `fulltext('${fieldsToSearch}', '${queryString}', 'AND') AND ${publishedOnlyQuerySegment()} AND ${pathFilter}${
        extraQuerySegment ? ` AND ${extraQuerySegment}` : ''
    }`;

    return {
        start,
        count,
        query,
        contentTypes,
        aggregations,
        filters,
    };
};

export const createFacetsAggregationsQuery = (
    queryString,
    prioritizedItems
) => {
    const filters = createCommonFilters(prioritizedItems);

    return createQuery({
        queryString,
        start: 0,
        count: 0,
        filters,
        aggregations: facetsAggregations,
    });
};

export const createSearchQueryParams = (
    params,
    prioritizedItems,
    batchSize
) => {
    const {
        start: startParam,
        c: countParam,
        queryString,
        s: sorting,
    } = params;

    const filters = createSearchFilters(params, prioritizedItems);

    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        batchSize,
    });

    return createQuery({
        queryString,
        start,
        count,
        aggregations: tidsperiodeAggregations,
        filters,
        sort:
            sorting === SortParam.Date
                ? 'publish.first DESC, createdTime DESC'
                : undefined,
    });
};

export const createDaterangeQueryParams = (
    params,
    daterangeBucket,
    batchSize
) => {
    const { start: startParam, c: countParam, queryString } = params;

    const filters = createSearchFilters(params);

    const { start, count } = getCountAndStart({
        start: startParam,
        count: countParam,
        batchSize,
    });

    const daterangeQuery = getDaterangeQueryStringFromBucket(daterangeBucket);

    return createQuery({
        queryString,
        extraQuerySegment: daterangeQuery,
        start,
        count,
        filters,
    });
};
