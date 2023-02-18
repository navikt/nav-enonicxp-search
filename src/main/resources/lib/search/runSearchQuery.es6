import { getUnixTimeFromDateTimeString } from '../utils';
import { getSearchRepoConnection } from './helpers/repo';
import {
    createDaterangeQueryParams,
    createSearchQueryParams,
} from './queryBuilder/createQuery';
import {
    DaterangeParam,
    SortParam,
    withAggregationsBatchSize,
} from '../constants';
import { processDaterangeAggregations } from './helpers/daterangeAggregations';
import { shouldIncludePrioHits } from './helpers/utils';
import { logger } from '../utils/logger';

const oneYear = 1000 * 3600 * 24 * 365;

const resultWithCustomScoreWeights = (result) => ({
    ...result,
    hits: result.hits
        .map((hit) => {
            const { _score: _rawScore, data, language, modifiedTime } = hit;
            if (!_rawScore) {
                return hit;
            }

            let scoreFactor = 1;

            // Pages targeted towards private individuals should be weighted higher
            if (data?.audience === 'person') {
                scoreFactor *= 1.25;
            }

            // Norwegian languages should be weighted slightly higher
            if (language === 'no') {
                scoreFactor *= 1.1;
            } else if (language === 'nn') {
                scoreFactor *= 1.05;
            }

            const currentTime = Date.now();
            const modifiedUnixTime =
                getUnixTimeFromDateTimeString(modifiedTime);
            const modifiedDelta = currentTime - modifiedUnixTime;

            // If the content was last modified more than one year ago, apply a gradually lower weight
            // down to a lower bound of 0.5 if last modified more than two years ago
            if (modifiedDelta > oneYear) {
                const twoYearsAgo = currentTime - oneYear * 2;
                const timeFactor =
                    0.5 +
                    (0.5 * Math.max(modifiedUnixTime - twoYearsAgo, 0)) /
                        oneYear;
                scoreFactor *= timeFactor;
            }

            return {
                ...hit,
                _score: _rawScore * scoreFactor,
                _rawScore,
            };
        })
        .sort((a, b) => b._score - a._score),
});

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

export const runFullSearchQuery = (
    inputParams,
    prioritizedItems,
    batchSize
) => {
    const { daterange, s: sorting } = inputParams;

    const queryParams = createSearchQueryParams(
        inputParams,
        prioritizedItems,
        batchSize
    );

    const withCustomWeights = sorting === SortParam.BestMatch;
    const withPrioritizedHits = shouldIncludePrioHits(inputParams);
    const priorityHitCount = prioritizedItems.hits.length;

    const result = runSearchQuery(queryParams, withCustomWeights);
    const { aggregations } = result;

    aggregations.Tidsperiode = processDaterangeAggregations(result);

    if (withPrioritizedHits) {
        aggregations.Tidsperiode.docCount += priorityHitCount;
    }

    if (daterange === DaterangeParam.All) {
        return withPrioritizedHits
            ? {
                  ...result,
                  hits: [...prioritizedItems.hits, ...result.hits],
                  total: result.total + priorityHitCount,
              }
            : result;
    }

    const daterangeBucket = aggregations.Tidsperiode.buckets[daterange];
    if (!daterangeBucket) {
        logger.info('No daterange bucket');
        return result;
    }

    const daterangeQueryParams = createDaterangeQueryParams(
        inputParams,
        daterangeBucket,
        withAggregationsBatchSize
    );

    logger.info(JSON.stringify(daterangeQueryParams));

    const daterangeResult = runSearchQuery(
        daterangeQueryParams,
        withCustomWeights
    );

    return { ...daterangeResult, aggregations };
};
