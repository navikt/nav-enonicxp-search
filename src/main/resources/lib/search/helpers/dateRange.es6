import { query } from '/lib/xp/content';

const moment = require('/assets/momentjs/2.24.0/min/moment-with-locales.min.js');

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

const getDateRangeQueryString = (daterange, buckets) => {
    const dateRangeValue = Number(daterange);
    if (!buckets || dateRangeValue.isNaN() || !buckets[dateRangeValue]) {
        return '';
    }
    const selectedBucket = buckets[dateRangeValue];
    return getDateRangeQueryStringFromBucket(selectedBucket);
};

const getDocCount = (ESQuery, bucket) =>
    Number(
        query({
            ...ESQuery,
            count: 0,
            start: undefined,
            aggregations: undefined,
            query: ESQuery.query + getDateRangeQueryStringFromBucket(bucket),
        }).total
    ) || 0;

const getDateRanges = (ESQuery) => {
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
        docCount: getDocCount(ESQuery, bucket),
    }));

    const totalCount = buckets[0].docCount + buckets[1].docCount;

    return {
        buckets,
        docCount: totalCount,
    };
};

export { getDateRanges, getDateRangeQueryString };
