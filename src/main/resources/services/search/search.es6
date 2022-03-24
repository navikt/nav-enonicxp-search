const searchUtils = require('/lib/search');
const { parseAndValidateParams } = require('../../lib/search/helpers/validateInput');
const { withAggregationsBatchSize } = require('../../lib/search/search');

const bucket = (type, params, parent) => {
    return (element, index) => {
        const el = element;
        if (type === 'fasett') {
            el.checked = params.f === index;
            el.default = el.checked && params.uf.length === 0;
            el.underaggregeringer.buckets = el.underaggregeringer.buckets.map(
                bucket('under', params, el)
            );
        } else {
            el.checked = parent.checked && params.uf.indexOf(index) !== -1;
        }
        return el;
    };
};

const parseAggs = (aggregations, params) => {
    const aggs = aggregations;
    const { daterange } = params;

    let tc = true;
    aggs.Tidsperiode.buckets = aggs.Tidsperiode.buckets.map((el, index) => {
        if (el.checked) {
            tc = false;
        }
        return { ...el, checked: daterange === index };
    });

    aggs.Tidsperiode.checked = tc;
    aggs.fasetter.buckets = aggs.fasetter.buckets.map(bucket('fasett', params, false));
    return aggs;
};

const handleGet = (req) => {
    log.info(`Params raw: ${JSON.stringify(req.params)}`);
    const params = parseAndValidateParams(req.params);
    log.info(`Params validated: ${JSON.stringify(params)}`);

    const { c: count, s: sorting, daterange, ord } = params;

    const result = searchUtils.runInContext(searchUtils.search, params);
    const aggregations = parseAggs(result.aggregations, params);

    return {
        body: {
            c: count,
            isSortDate: sorting === 0,
            s: sorting,
            daterange,
            isMore: count * withAggregationsBatchSize < result.total,
            word: ord,
            total: result.total,
            fasett: aggregations.fasetter.buckets.reduce((t, el) => {
                if (el.checked) return el.key;
                return t;
            }, ''),
            aggregations,
            hits: result.hits,
            prioritized: result.prioritized,
        },
        contentType: 'application/json',
    };
};

exports.get = handleGet;
