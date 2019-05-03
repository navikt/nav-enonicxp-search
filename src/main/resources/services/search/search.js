var searchUtils = require('/lib/search/searchUtils');
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
        var aggregations = parseAggs(result.aggregations, params);
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
            fasett: aggregations.fasetter.buckets.reduce(function(t, el) {
                if (el.checked) t = el.key;
                return t;
            }, ''),
            aggregations: aggregations,
            hits:
                result.hits /*result.hits.hits.map(function (el) {
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

var ta = ['Eldre enn 12 måneder', 'Siste 12 måneder', 'Siste 30 dager', 'Siste 7 dager'];
function parseAggs(aggs, params) {
    var d = params.daterange ? Number(params.daterange) : -1;
    var tp = 0;
    var tc = true;
    aggs.Tidsperiode.buckets = aggs.Tidsperiode.buckets
        .map(function(el, index) {
            el.key = ta[index];
            el.checked = d === aggs.Tidsperiode.buckets.length - 1 - index;
            tp = tp + el.docCount;
            if (el.checked) tc = false;
            return el;
        })
        .reverse();
    aggs.Tidsperiode.docCount = tp.toString(10);
    aggs.Tidsperiode.checked = tc;
    aggs.fasetter.buckets = aggs.fasetter.buckets.map(bucket('fasett', params, false));
    return aggs;
}

function bucket(type, params, parent) {
    return function(el, index) {
        el.className = '';
        if (type === 'fasett') {
            el.checked = Number(params.f || 0) === index;
            el.default = el.checked && (!params.uf || Number(params.uf) === -1);
            el.defaultClassName = el.default ? 'erValgt' : '';
            el.underaggregeringer.buckets = el.underaggregeringer.buckets.map(bucket('under', params, el));
        } else {
            el.checked = parent.checked && (Array.isArray(params.uf) ? params.uf : [params.uf]).indexOf(String(index)) > -1;
            var cname = parent.key === 'Sentralt Innhold' ? el.key.split(' ')[0].toLowerCase() + ' ' : parent.key.split(' ')[0].toLowerCase() + ' ';
            el.className += cname;
        }
        el.className += el.checked ? 'erValgt' : '';
        return el;
    };
}
