import dayjs from 'dayjs.min.js';
import { query } from '/lib/xp/content';

const dateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

const getDateRangeQueryStringFromBucket = (bucket) => {
    const { to, from } = bucket;
    let s = '';
    if (to) {
        s +=
            ' AND (publish.from <= dateTime("' +
            to +
            '") OR publish.from NOT LIKE "*") AND (modifiedTime <= dateTime("' +
            to +
            '") OR modifiedTime NOT LIKE "*")';
    }
    if (from) {
        s +=
            ' AND (publish.from > dateTime("' +
            from +
            '") OR modifiedTime > dateTime("' +
            from +
            '"))';
    }
    return s;
};

const getDateRangeQueryString = (daterange, buckets) => {
    const dateRangeValue = Number(daterange);
    if (!buckets || dateRangeValue.isNaN() || !buckets[dateRangeValue]) return '';
    const selectedBucket = buckets[dateRangeValue];
    return getDateRangeQueryStringFromBucket(selectedBucket);
};

const setDocCount = (ESQuery, bucket) => ({
    ...bucket,
    docCount: Number(
        query({
            ...ESQuery,
            count: 0,
            start: undefined,
            aggregations: undefined,
            query: ESQuery.query + getDateRangeQueryStringFromBucket(bucket),
        }).total
    ),
});

const getDateRanges = (ESQuery) => {
    const now = dayjs();
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
    ].map((bucket) => setDocCount(ESQuery, bucket));

    const totalCount = buckets[0].docCount + buckets[1].docCount;

    return {
        buckets: buckets,
        docCount: totalCount,
    };
};

export { getDateRanges, getDateRangeQueryString };
