import { getSearchRepoConnection } from '../../utils/repo';
import {
    createDaterangeQueryParams,
    createSearchQueryParams,
} from './createQuery';
import { DaterangeParam, withAggregationsBatchSize } from '../../constants';
import { processDaterangeAggregations } from './daterangeAggregations';
import { logger } from '../../utils/logger';

export const runSearchQuery = (queryParams) => {
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

    return { ...queryResult, hits };
};

export const runFullSearchQuery = (inputParams, batchSize) => {
    const { daterange } = inputParams;

    const queryParams = createSearchQueryParams(inputParams, batchSize);

    const result = runSearchQuery(queryParams);
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

    const daterangeResult = runSearchQuery(daterangeQueryParams);

    return { ...daterangeResult, aggregations };
};
