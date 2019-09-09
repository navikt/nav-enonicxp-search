var searchUtils = require('/lib/search3/searchUtils3');
var context = require('/lib/xp/context');

exports.get = handleGet;

function runInContext(func, params) {
    return context.run(
        {
            repository: 'com.enonic.cms.default',
            branch: 'master',
            user: {
                login: 'su',
                userStore: 'system'
            },
            principals: ['role:system.admin']
        },
        function() {
            return func(params);
        }
    );
}

function handleGet(req) {
    var params = req.params || {};

    // log.info(JSON.stringify(params, null, 4));
    var model = {
        word: false
    };

    if (params.ord) {
        var result = runInContext(searchUtils.enonicSearch, params)
        // var result = searchUtils.enonicSearch(params);

        //   log.info(JSON.stringify(result.aggregations, null, 4));
        //  log.info(JSON.stringify(result, null, 4));

        var c = params.c ? (!isNaN(Number(params.c)) ? Number(params.c) : 1) : 1;
        var isMore = c * 20 < result.total;
        var isSortDate = !params.s || params.s === '0';

        model = {
            c: c,
            isSortDate: isSortDate,
            s: params.s ? params.s : '0',
            isMore: isMore,
            word: params.ord,
            total: result.total.toString(10),
            hits:
                result.hits
        };
    }

    return {
        body: model,
        contentType: 'application/json'
    };
}
