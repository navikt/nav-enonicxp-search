const searchUtils = require('/lib/search');
const { validateParams } = require("../../lib/search/helpers/validateInput");

function handleGet(req) {
    const params = validateParams(req.params);

    const result = searchUtils.runInContext(searchUtils.searchWithoutAggregations, params);
    const isMore = params.c * 10 < result.total;
    const isSortDate = !params.s;

    return {
        body: {
            c: params.c,
            isMore,
            isSortDate,
            s: params.s ? params.s : '0',
            word: params.ord,
            total: result.total.toString(10),
            hits: result.hits,
        },
        contentType: 'application/json',
    };
}

exports.get = handleGet;
