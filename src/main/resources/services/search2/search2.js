var searchUtils = require('/lib/search2/searchUtils2');
var context = require('/lib/xp/context');

exports.get = handleGet;

function runInContext(func, params) {
    return context.run(
        {
            repository: 'com.enonic.cms.default',
            branch: 'master',
            user: {
                login: 'pad',
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
            daterange: params.daterange ? params.daterange : '',
            isMore: isMore,
            word: params.ord,
            total: result.total.toString(10),
            hits: result.hits

            /*result.hits.hits.map(function (el) {
                return { displayName: el._source.displayname[0], href: portal.pageUrl({
                        id: el._id
                    }), highlight: (el.highlight['data.ingress'] || el.highlight['data.text._analyzed'] || el.highlight.displayname)[0].replace(/<(\/?strong)>/g, function(e, r) {
                        return '##' + r + '##'
                    }).replace(/<([\/0-9a-zA-Z\s\\="\-:;+%&.#()_]*)>|&nbsp;|[.,?():"”;]/g, '').replace(/##(\/?strong)##/g, function (e, r) {
                        return '<' + r + '>';
                    }) }
            })*/
            /*suggest: result.suggest['ss'][0].options.reduce(function (t, el) {
                if (!t || t.freq < el.freq) t = el;
                return t;
            }, false)*/
        };
    }

    return {
        body: model,
        contentType: 'application/json'
    };
}