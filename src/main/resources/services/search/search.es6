const searchUtils = require('/lib/search');

const bucket = (type, params, parent) => {
    return (element, index) => {
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
                parent.key === 'Innhold'
                    ? el.key.split(' ')[0].toLowerCase() + ' '
                    : parent.key.split(' ')[0].toLowerCase() + ' ';
            el.className += cname;
        }
        el.className += el.checked ? 'erValgt' : '';
        return el;
    };
};

const parseAggs = (aggregations, params) => {
    const aggs = aggregations;
    const d = params.daterange ? Number(params.daterange) : -1;
    let tc = true;
    aggs.Tidsperiode.buckets = aggs.Tidsperiode.buckets.map((el, index) => {
        if (el.checked) tc = false;
        return { ...el, checked: d === index };
    });

    aggs.Tidsperiode.checked = tc;
    aggs.fasetter.buckets = aggs.fasetter.buckets.map(bucket('fasett', params, false));
    return aggs;
};

const handleGet = (req) => {
    const params = req.params || {};

    if (!params.ord) {
        params.ord = '';
    }

    if (params.ord.length > 200) {
        params.ord = params.ord.substring(0, 200);
    }

    if (params.uf && params.uf.indexOf('[') !== -1) {
        params.uf = JSON.parse(params.uf);
    }

    params.debug = params.debug || false;

    const result = searchUtils.runInContext(searchUtils.search, params);

    const timeStart = Date.now();
    for (let i = 0; i < 100; i++) {
        searchUtils.runInContext(searchUtils.search, params);
    }
    log.info(`Time spent: ${(Date.now() - timeStart) / 1000}`);

    const aggregations = parseAggs(result.aggregations, params);
    const c = params.c ? parseInt(params.c) || 1 : 1;
    const isMore = c * 20 < result.total;
    const isSortDate = !params.s || params.s === '0';
    const model = {
        c,
        isSortDate,
        s: params.s ? params.s : '0',
        daterange: params.daterange ? params.daterange : '',
        isMore,
        word: params.ord,
        total: result.total.toString(10),
        fasett: aggregations.fasetter.buckets.reduce((t, el) => {
            if (el.checked) return el.key;
            return t;
        }, ''),
        aggregations,
        hits: result.hits,
        prioritized: result.prioritized,
    };

    return {
        body: model,
        contentType: 'application/json',
    };
};

exports.get = handleGet;
