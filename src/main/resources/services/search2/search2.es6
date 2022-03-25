const searchUtils = require('/lib/search');
const { parseAndValidateParams } = require('../../lib/search/helpers/validateInput');
const { noAggregationsBatchSize } = require('../../lib/search/searchWithoutAggregations');

function handleGet(req) {
    const params = parseAndValidateParams(req.params);

    const { c: count, s: sorting, ordRaw } = params;

    const result = searchUtils.runInContext(searchUtils.searchWithoutAggregations, params);

    return {
        body: {
            c: count,
            isMore: count * noAggregationsBatchSize < result.total,
            isSortDate: sorting === 1,
            s: sorting,
            word: ordRaw,
            total: result.total,
            hits: result.hits,
        },
        contentType: 'application/json',
    };
}

exports.get = handleGet;
