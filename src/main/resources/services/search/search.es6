const searchUtils = require('/lib/search/searchUtils');

// const ta = ['Eldre enn 12 måneder', 'Siste 12 måneder', 'Siste 30 dager', 'Siste 7 dager'];

function bucket(type, params, parent) {
    return function(element, index) {
        const el = element;
        el.className = '';
        if (type === 'fasett') {
            el.checked = Number(params.f || 0) === index;
            el.default = el.checked && (!params.uf || Number(params.uf) === -1);
            el.defaultClassName = el.default ? 'erValgt' : '';
            el.underaggregeringer.buckets = el.underaggregeringer.buckets.map(
                bucket('under', params, el)
            );
        } else {
            el.checked =
                parent.checked &&
                (Array.isArray(params.uf) ? params.uf : [params.uf]).indexOf(String(index)) > -1;
            const cname =
                parent.key === 'Sentralt Innhold'
                    ? el.key.split(' ')[0].toLowerCase() + ' '
                    : parent.key.split(' ')[0].toLowerCase() + ' ';
            el.className += cname;
        }
        el.className += el.checked ? 'erValgt' : '';
        return el;
    };
}
function parseAggs(aggregations, params) {
    const aggs = aggregations;
    const d = params.daterange ? Number(params.daterange) : -1;
    let tp = 0;
    let tc = true;
    aggs.Tidsperiode.buckets = aggs.Tidsperiode.buckets.map((el, index) => {
        tp += el.docCount;
        if (el.checked) tc = false;
        return { ...el, checked: d === index };
    });

    aggs.Tidsperiode.docCount = tp.toString(10);
    aggs.Tidsperiode.checked = tc;
    aggs.fasetter.buckets = aggs.fasetter.buckets.map(bucket('fasett', params, false));
    return aggs;
}

function handleGet(req) {
    const params = req.params || {};

    let model = {
        word: false,
    };
    if (!params.ord) {
        params.ord = '';
    }

    if (params.ord.length > 200) {
        params.ord = params.ord.substring(0, 200);
    }

    if (params.uf && params.uf.indexOf('[') !== -1) {
        params.uf = JSON.parse(params.uf);
    }

    const result = searchUtils.runInContext(searchUtils.enonicSearch, params);
    const aggregations = parseAggs(result.aggregations, params);
    const c = params.c ? parseInt(params.c) || 1 : 1;
    const isMore = c * 20 < result.total;
    const isSortDate = !params.s || params.s === '0';
    model = {
        c,
        isSortDate,
        s: params.s ? params.s : '0',
        daterange: params.daterange ? params.daterange : '',
        isMore,
        word: params.ord,
        total: result.total.toString(10),
        fasett: aggregations.fasetter.buckets.reduce(function(t, el) {
            if (el.checked) return el.key;
            return t;
        }, ''),
        aggregations,
        hits: result.hits,
    };

    return {
        body: model,
        contentType: 'application/json',
    };
}
exports.get = handleGet;
