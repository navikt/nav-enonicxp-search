import { validateAndTransformParams } from '../../lib/search/helpers/validateInput';
import {
    searchWithAggregations,
    withAggregationsBatchSize,
} from '../../lib/search/searchWithAggregations';
import { runInContext } from '../../lib/search/helpers/utils';

const bucket = (type, params, parent) => (element, index) => {
    if (type === 'fasett') {
        element.checked = params.f === index;
        element.default = element.checked && params.uf.length === 0;
        element.underaggregeringer.buckets = element.underaggregeringer.buckets.map(
            bucket('under', params, element)
        );
    } else {
        element.checked = parent.checked && params.uf.indexOf(index) !== -1;
    }
    return element;
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
    aggs.fasetter.buckets = aggs.fasetter.buckets.map(
        bucket('fasett', params, false)
    );
    return aggs;
};

export const get = (req) => {
    const params = validateAndTransformParams(req.params);

    const result = runInContext(searchWithAggregations, params);
    const aggregations = parseAggs(result.aggregations, params);
    const fasett = aggregations.fasetter.buckets.reduce(
        (t, el) => (el.checked ? el.key : t),
        ''
    );

    const { c: count, s: sorting, daterange, ord } = params;

    return {
        body: {
            c: count,
            isSortDate: sorting === 0,
            s: sorting,
            daterange,
            isMore: count * withAggregationsBatchSize < result.total,
            word: ord,
            total: result.total,
            fasett,
            aggregations,
            hits: result.hits,
            prioritized: result.prioritized,
        },
        contentType: 'application/json',
    };
};
