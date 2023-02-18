export const contentRepo = 'com.enonic.cms.default';
export const searchRepo = 'nav.no.search';
export const withAggregationsBatchSize = 20;
export const noAggregationsBatchSize = 10;

export const SortParam = Object.freeze({
    BestMatch: 0,
    Date: 1,
});

export const DaterangeParam = Object.freeze({
    All: -1,
    OlderThan12M: 0,
    NewerThan12M: 1,
    NewerThan30D: 2,
    NewerThan7D: 3,
});
