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
        query.push(`publish.first <= dateTime("${to}")`);
    }

    if (from) {
        query.push(`publish.first > dateTime("${from}")`);
    }

    return query.join(' AND ');
};
