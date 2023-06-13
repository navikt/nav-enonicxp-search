import { getUnixTimeFromDateTimeString } from '../../utils';

const oneYear = 1000 * 3600 * 24 * 365;

export const resultWithCustomScoreWeights = (result) => ({
    ...result,
    hits: result.hits
        .map((hit) => {
            const { data, language, modifiedTime, _score } = hit;

            const _nonZeroScore = _score || 0.01;

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
                _score: _nonZeroScore * scoreFactor,
                _rawScore: _score,
            };
        })
        .sort((a, b) => b._score - a._score),
});
