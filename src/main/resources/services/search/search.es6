import { validateAndTransformParams } from '../../lib/search/helpers/validateInput';
import {
    searchWithAggregations,
    withAggregationsBatchSize,
} from '../../lib/search/searchWithAggregations';
import { runInContext } from '../../lib/utils/context';
import { contentRepo } from '../../lib/constants';

const processBucket = (type, params, parent, element) => {
    if (type === 'fasett') {
        element.checked = params.f === element.key;
        element.default = element.checked && params.uf.length === 0;
        element.underaggregeringer.buckets =
            element.underaggregeringer.buckets.reduce((acc, ufBucket) => {
                const processedBucket = processBucket(
                    'under',
                    params,
                    element,
                    ufBucket
                );
                return processedBucket ? [...acc, processedBucket] : acc;
            }, []);
    } else {
        element.checked = parent.checked && params.uf.includes(element.key);
        if (!element.docCount && !element.checked) {
            return null;
        }
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
    aggs.fasetter.buckets = aggs.fasetter.buckets.reduce((acc, bucket) => {
        const processedBucket = processBucket('fasett', params, false, bucket);
        return processedBucket ? [...acc, processedBucket] : acc;
    }, []);
    return aggs;
};

export const get = (req) => {
    const params = validateAndTransformParams(req.params);

    const result = runInContext(
        { branch: 'master', repository: contentRepo, asAdmin: true },
        () => searchWithAggregations(params)
    );

    const aggregations = parseAggs(result.aggregations, params);
    const facetChecked = aggregations.fasetter.buckets.find(
        (bucket) => bucket.checked
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
            fasett: facetChecked?.name,
            fasettKey: facetChecked?.key,
            aggregations,
            hits: result.hits,
            prioritized: result.prioritized,
        },
        contentType: 'application/json',
    };
};
