/*
    ----------- The date ranges for date range aggregations -----
    The key property is currently ignored
 */
const dateranges = [
    {
        key: 'Siste 7 dager',
        from: 'now-7d',
    },
    {
        key: 'Siste 30 dager',
        from: 'now-30d',
    },
    {
        key: 'Siste 12 måneder',
        from: 'now-12M',
    },
    {
        key: 'Eldre enn 12 måneder',
        to: 'now-12M',
    },
];

const tidsperiode = {
    dateRange: {
        ranges: dateranges,
        field: 'modifiedTime',
        format: 'dd-MM-yyyy',
    },
};

export { dateranges, tidsperiode };
