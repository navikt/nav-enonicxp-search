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

    const hits = queryResult.hits.reduce((acc, hit) => {
        const searchNode = repo.get(hit.id);
        if (searchNode) {
            acc.push({
                ...searchNode,
                _score: hit.score,
            });
        } else {
            logger.error(`Search node not found - ${JSON.stringify(hit)}`);
        }

        return acc;
    }, []);

    const result = { ...queryResult, hits };

    return withCustomWeights ? resultWithCustomScoreWeights(result) : result;
};

export const runFullSearchQuery = (inputParams, batchSize) => {
    const { daterange, s: sorting } = inputParams;

    const withCustomWeights = sorting === SortParam.BestMatch;

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
