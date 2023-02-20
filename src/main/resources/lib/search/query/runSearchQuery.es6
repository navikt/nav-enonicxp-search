import { getSearchRepoConnection } from '../../utils/repo';
import {
    createDaterangeQueryParams,
    createSearchQueryParams,
} from './createQuery';
import {
    DaterangeParam,
    SortParam,
    withAggregationsBatchSize,
} from '../../constants';
import { processDaterangeAggregations } from './daterangeAggregations';
import { logger } from '../../utils/logger';
import { resultWithCustomScoreWeights } from '../result/customWeights';

export const runSearchQuery = (queryParams, withCustomWeights) => {
    const repo = getSearchRepoConnection();

    const queryResult = repo.query(queryParams);

    const hits = queryResult.hits.map((hit) => {
        const searchNode = repo.get(hit.id);
        return {
            ...searchNode,
            _score: hit.score,
            _id: searchNode.contentId || searchNode._id,
            _path: searchNode.contentPath || searchNode._path,
        };
    });

    const result = { ...queryResult, hits };

    return withCustomWeights ? resultWithCustomScoreWeights(result) : result;
};

export const runFullSearchQuery = (inputParams, batchSize) => {
    const { daterange, s: sorting, queryString } = inputParams;

    const withCustomWeights = sorting === SortParam.BestMatch && !!queryString;

    const queryParams = createSearchQueryParams(inputParams, batchSize);

    const result = runSearchQuery(queryParams, withCustomWeights);
    const { aggregations } = result;

    aggregations.Tidsperiode = processDaterangeAggregations(result);

    if (daterange === DaterangeParam.All) {
        return result;
    }

    const daterangeBucket = aggregations.Tidsperiode.buckets[daterange];
    if (!daterangeBucket) {
        logger.critical(`No daterange bucket found for ${daterange}!`);
        return result;
    }

    const daterangeQueryParams = createDaterangeQueryParams(
        inputParams,
        daterangeBucket,
        withAggregationsBatchSize
    );

    const daterangeResult = runSearchQuery(
        daterangeQueryParams,
        withCustomWeights
    );

    return { ...daterangeResult, aggregations };
};
