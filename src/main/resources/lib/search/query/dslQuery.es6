const ONE_YEAR = 1000 * 3600 * 24 * 365;

export const createDslQuery = (
    queryString,
    fieldsToSearch,
    additionalQuery
) => {
    const now = new Date().toISOString();
    const oneYearAgo = new Date(Date.now() - ONE_YEAR).toISOString();
    const twoYearsAgo = new Date(Date.now() - ONE_YEAR * 2).toISOString();

    return {
        boolean: {
            // Main query block
            must: [
                {
                    ...(queryString
                        ? {
                              fulltext: {
                                  fields: fieldsToSearch,
                                  query: queryString,
                                  operator: 'AND',
                              },
                          }
                        : { matchAll: {} }),
                },
                additionalQuery,
            ],

            // Prevent pre-published/pre-unpublished content from appearing in results
            mustNot: [
                {
                    range: {
                        field: 'publish.from',
                        type: 'dateTime',
                        gt: now,
                    },
                },
                {
                    range: {
                        field: 'publish.to',
                        type: 'dateTime',
                        lt: now,
                    },
                },
            ],

            // Boosting for certain fields
            should: [
                // Boost content targeted towards private persons
                {
                    boolean: {
                        should: [
                            {
                                term: {
                                    field: 'data.audience._selected',
                                    value: 'person',
                                },
                            },
                            {
                                term: {
                                    field: 'data.audience',
                                    value: 'person',
                                },
                            },
                        ],
                        boost: 10,
                    },
                },

                // Boost Norwegian languages
                {
                    term: {
                        field: 'language',
                        value: 'no',
                        boost: 10,
                    },
                },
                {
                    term: {
                        field: 'language',
                        value: 'nn',
                        boost: 5,
                    },
                },

                // Negative boost to content which has not been maintained
                {
                    range: {
                        field: 'modifiedTime',
                        gt: oneYearAgo,
                        boost: 0.5,
                    },
                },
                {
                    range: {
                        field: 'modifiedTime',
                        gt: twoYearsAgo,
                        boost: 0.25,
                    },
                },

                // This block is for boosting only, and should match all
                {
                    matchAll: {},
                },
            ],
        },
    };
};
