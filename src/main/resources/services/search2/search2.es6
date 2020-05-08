const searchUtils = require('/lib/search');

function handleGet(req) {
    const params = req.params || {};

    if (!params.ord) {
        params.ord = '';
    }
    if (params.ord.length > 200) {
        params.ord = params.ord.substring(0, 200);
    }

    const result = searchUtils.runInContext(searchUtils.searchWithoutAggregations, params);
    let c = 1;
    if (params.c) {
        c = !Number(params.c).isNaN() ? Number(params.c) : 1;
    }
    const isMore = c * 20 < result.total;
    const isSortDate = !params.s || params.s === '0';

    const model = {
        c,
        isMore,
        isSortDate,
        s: params.s ? params.s : '0',
        word: params.ord,
        total: result.total.toString(10),
        hits: result.hits,
    };

    return {
        body: model,
        contentType: 'application/json',
    };
}

exports.get = handleGet;
