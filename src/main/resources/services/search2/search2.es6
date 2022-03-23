const searchUtils = require('/lib/search');
const { validateParams } = require("../../lib/search/helpers/validateInput");
const { noAggregationsBatchSize } = require("../../lib/search/searchWithoutAggregations");


function handleGet(req) {
    const params = validateParams(req.params);

    const {c: count, s: sorting, ord} = params;

    const result = searchUtils.runInContext(searchUtils.searchWithoutAggregations, params);
    const isMore = count * noAggregationsBatchSize < result.total;
    const isSortDate = sorting === 1;

    return {
        body: {
            c: count,
            isMore,
            isSortDate,
            s: sorting,
            word: ord,
            total: result.total,
            hits: result.hits,
        },
        contentType: 'application/json',
    };
}

exports.get = handleGet;
