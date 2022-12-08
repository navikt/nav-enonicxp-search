import moment from '/assets/momentjs/2.29.1/min/moment-with-locales.min.js';
import { runSearchQuery } from '../runSearchQuery';

const dateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

const getDateRangeQueryStringFromBucket = (bucket) => {
    const { to, from } = bucket;
    let s = '';
    if (to) {
        s +=
            ' AND (publish.first <= dateTime("' +
            to +
            '") OR publish.first NOT LIKE "*") AND (createdTime <= dateTime("' +
            to +
            '") OR createdTime NOT LIKE "*")';
    }
    if (from) {
        s +=
            ' AND (publish.first > dateTime("' +
            from +
            '") OR createdTime > dateTime("' +
            from +
            '"))';
    }
    return s;
};

export const getDateRangeQueryString = (daterange, buckets) => {
    if (!buckets) {
        return '';
    }

    const selectedBucket = buckets[daterange];
    if (!selectedBucket) {
        return '';
    }

    return getDateRangeQueryStringFromBucket(selectedBucket);
};

const getDocCount = (queryParams, bucket) => {
    const query = `${queryParams.query}${getDateRangeQueryStringFromBucket(
        bucket
    )}`;

    const result = runSearchQuery({
        ...queryParams,
        count: 0,
        start: undefined,
        aggregations: undefined,
        query,
    });

    return Number(result.total) || 0;
};

export const getDateRanges = (queryParams) => {
    const now = moment();
    const sevenDaysAgo = now.subtract(7, 'day').format(dateTimeFormat);
    const thirtyDaysAgo = now.subtract(30, 'day').format(dateTimeFormat);
    const oneYearAgo = now.subtract(1, 'year').format(dateTimeFormat);

    const buckets = [
        {
            key: 'Eldre enn 12 måneder',
            to: oneYearAgo,
        },
        {
            key: 'Siste 12 måneder',
            from: oneYearAgo,
        },
        {
            key: 'Siste 30 dager',
            from: thirtyDaysAgo,
        },
        {
            key: 'Siste 7 dager',
            from: sevenDaysAgo,
        },
    ].map((bucket) => ({
        ...bucket,
        docCount: getDocCount(queryParams, bucket),
    }));

    const totalCount = buckets[0].docCount + buckets[1].docCount;

    return {
        buckets,
        docCount: totalCount,
    };
};
