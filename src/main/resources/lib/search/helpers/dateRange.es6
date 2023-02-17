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
