export const daterangeAggregationsRanges = [
    {
        name: 'Eldre enn 12 måneder',
        to: 'now-12M',
    },
    {
        name: 'Siste 12 måneder',
        from: 'now-12M',
    },
    {
        name: 'Siste 30 dager',
        from: 'now-30d',
    },
    {
        name: 'Siste 7 dager',
        from: 'now-7d',
    },
];

export const getDaterangeQueryStringFromBucket = (bucket) => {
    const { to, from } = bucket;
    const query = [];

    if (to) {
        query.push({
            range: {
                field: 'publish.from',
                type: 'dateTime',
                lte: to,
            },
        });
    }

    if (from) {
        query.push({
            range: {
                field: 'publish.first',
                type: 'dateTime',
                gt: from,
            },
        });
    }

    return query;
};

export const processDaterangeAggregations = (result) => {
    const { aggregations, total } = result;
    const { Tidsperiode } = aggregations;

    if (!Tidsperiode) {
        return { docCount: 0, buckets: [] };
    }

    Tidsperiode.docCount = total;

    // Sort buckets from most recent to oldest ranges, and transform the keys
    // to what the frontend expects
    Tidsperiode.buckets = Tidsperiode.buckets
        .sort((a, b) => (a.key > b.key ? 1 : -1))
        .map((bucket, index) => ({
            ...bucket,
            key: daterangeAggregationsRanges[index].name,
        }));

    return Tidsperiode;
};
