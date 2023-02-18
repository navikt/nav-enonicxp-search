import { validateAndTransformParams } from '../../lib/search/helpers/validateInput';
import {
    noAggregationsBatchSize,
    searchWithoutAggregations,
} from '../../lib/search/searchWithoutAggregations';
import { runInContext } from '../../lib/utils/context';
import { contentRepo } from '../../lib/constants';

export const get = (req) => {
    const params = validateAndTransformParams(req.params);

    const result = runInContext(
        { branch: 'master', repository: contentRepo, asAdmin: true },
        () => searchWithoutAggregations(params)
    );

    const { c: count, s, ord } = params;

    return {
        body: {
            c: count,
            isMore: count * noAggregationsBatchSize < result.total,
            s,
            word: ord,
            total: result.total,
            hits: result.hits,
        },
        contentType: 'application/json',
    };
};
