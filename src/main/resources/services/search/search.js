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

    if(params.uf && params.uf.indexOf('[') !== -1) {
        params.uf = JSON.parse(params.uf);
    }

    var result = searchUtils.runInContext(searchUtils.enonicSearch, params);
    var aggregations = parseAggs(result.aggregations, params);
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
        hits: result.hits
    };

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
