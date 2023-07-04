import { forceArray } from '../../utils';
import { getConfig } from '../helpers/config';
import { commonFilters, createSearchFilters } from './createFilters';
import {
    getDaterangeQueryStringFromBucket,
    daterangeAggregationsRanges,
} from './daterangeAggregations';
import { DaterangeParam, SortParam } from '../../constants';
import { createDslQuery } from './dslQuery';

const getCountAndStart = ({ start, count, batchSize }) => {
    return { start: start * batchSize, count: (count - start) * batchSize };
};

// Sort by date if sorting is set to date, or query is empty
const getSortString = (params) => {
    if (params.s === SortParam.Date) {
        return 'publish.first DESC, createdTime DESC';
    }

    if (!params.queryString) {
        return 'x.no-nav-navno.searchOrder.searchOrder ASC, publish.first DESC, createdTime DESC';
    }

    return undefined;
};

const daterangeAggregations = {
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
    sort,
    additionalQuery,
}) => {
    const config = getConfig();

    const contentTypes = forceArray(config.data.contentTypes);
    const fieldsToSearch = forceArray(config.data.fields);

    const dslQuery = createDslQuery(
        queryString,
        fieldsToSearch,
        additionalQuery
    );

    return {
        start,
        count,
        query: dslQuery,
        contentTypes,
        aggregations,
        sort,
        filters,
    };
};

export const createFacetsAggregationsQuery = (queryString) => {
    const filters = commonFilters();

    return createQuery({
        queryString,
        start: 0,
        count: 0,
        filters,
        aggregations: facetsAggregations,
    });
};

export const createSearchQueryParams = (params, batchSize) => {
    const { start: startParam, c: countParam, queryString, daterange } = params;

    const filters = createSearchFilters(params);

    // If the query is for a specific daterange, we need to do an additional query later to retrieve the content
    // In this case the present query will only be for aggregations, so we optimize by not returning any results
    const { start, count } =
        daterange === DaterangeParam.All
            ? getCountAndStart({
                  start: startParam,
                  count: countParam,
                  batchSize,
              })
            : { start: 0, count: 0 };

    return createQuery({
        queryString,
        start,
        count,
        aggregations: daterangeAggregations,
        filters,
        sort: getSortString(params),
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
        additionalQuery: daterangeQuery,
        start,
        count,
        filters,
        sort: getSortString(params),
    });
};
