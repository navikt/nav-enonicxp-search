var searchUtils = require('/lib/search/searchUtils');

exports.get = handleGet;

function handleGet(req) {
    var params = req.params || {};

    var model = {
        word: false
    };

    if (!params.ord) {
        params.ord = '';
    }
    if (params.ord.length > 200) {
        params.ord = params.ord.substring(0, 200);
    }

    var result = searchUtils.runInContext(searchUtils.enonicSearchWithoutAggregations, params);

    var c = params.c ? (!isNaN(Number(params.c)) ? Number(params.c) : 1) : 1;
    var isMore = c * 20 < result.total;
    var isSortDate = !params.s || params.s === '0';

    model = {
        c: c,
        isMore: isMore,
        isSortDate: isSortDate,
        s: params.s ? params.s : '0',
        word: params.ord,
        total: result.total.toString(10),
        hits: result.hits
    };

    return {
        body: model,
        contentType: 'application/json'
    };
}