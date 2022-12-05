import { validateAndTransformParams } from '../../lib/search/helpers/validateInput';
import {
    noAggregationsBatchSize,
    searchWithoutAggregations,
} from '../../lib/search/searchWithoutAggregations';
import { runInContext } from '../../lib/utils/context';
import { contentRepo, searchRepo } from '../../lib/constants';

export const get = (req) => {
    const params = validateAndTransformParams(req.params);

    const result = runInContext(
        { branch: 'master', repository: contentRepo, asAdmin: true },
        () => searchWithoutAggregations(params)
    );

    const { c: count, s: sorting, ord } = params;

    return {
        body: {
            c: count,
            isMore: count * noAggregationsBatchSize < result.total,
            isSortDate: sorting === 1,
            s: sorting,
            word: ord,
            total: result.total,
            hits: result.hits,
        },
        contentType: 'application/json',
    };
};
