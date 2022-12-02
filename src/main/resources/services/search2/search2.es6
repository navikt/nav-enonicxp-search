const searchUtils = require('/lib/search');
const {
    validateAndTransformParams,
} = require('../../lib/search/helpers/validateInput');
const {
    noAggregationsBatchSize,
} = require('../../lib/search/searchWithoutAggregations');

export const get = (req) => {
    const params = validateAndTransformParams(req.params);

    const result = searchUtils.runInContext(
        searchUtils.searchWithoutAggregations,
        params
    );

    const { c: count, s: sorting, ord } = params;

    return {
        body: {
            c: count,
            isMore: count * noAggregationsBatchSize < result.total,
            isSortDate: sorting === 1,
            s: sorting,
            word: ord,
            total: result.total,
            hits: result.hits,
        },
        contentType: 'application/json',
    };
};
