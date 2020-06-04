import { run } from '/lib/xp/context';
import { get, query } from '/lib/xp/content';

export function getCountAndStart({ start: startString = '0', count: countString = '20' }) {
    let count = countString ? parseInt(countString) || 0 : 0;
    count = count ? count * 20 : 20;

    let start = startString ? parseInt(startString) || 0 : 0;
    start *= 20;
    count -= start;
    return { start, count };
}

/*
    -------------- Map and reduce the facet configuration with the aggregated result ------------
    As the aggregated result don't show hits for buckets containing zero hits, we need to manually add them to the
    aggregation result as a bucket with docCount = 0
 */
export function mapReducer(buckets) {
    return (t, el) => {
        const match = buckets.reduce((t2, e) => {
            return t2 || (e.key === el.name.toLowerCase() ? e : t2);
        }, undefined);

        const docCount = match ? match.docCount : 0;
        const under =
            'underfasetter' in el
                ? (Array.isArray(el.underfasetter) ? el.underfasetter : [el.underfasetter]).reduce(
                      mapReducer(match ? match.underaggregeringer.buckets || [] : []),
                      []
                  )
                : [];
        t.push({
            key: el.name,
            docCount: docCount,
            underaggregeringer: { buckets: under },
        });
        return t;
    };
}

export function getAggregations(ESQuery, config) {
    const { aggregations } = query(ESQuery);
    aggregations.fasetter.buckets = []
        .concat(config.data.fasetter)
        .reduce(mapReducer(aggregations.fasetter.buckets), []);
    return aggregations;
}

/*
    -------- Add the date range to query if selected ----------
 */
export function getDateRange(daterange, buckets) {
    const dateRangeValue = Number(daterange);
    if (!buckets || dateRangeValue.isNaN() || !buckets[dateRangeValue]) return '';
    let s = '';
    const e = buckets[dateRangeValue];
    if ('to' in e) {
        s += ' And modifiedTime < dateTime("' + e.to + '")';
    }
    if ('from' in e) {
        s += ' And modifiedTime > dateTime("' + e.from + '")';
    }
    return s;
}

const FACETS_CONTENT_KEY = '/www.nav.no/fasetter';

export function getFacetConfiguration() {
    return get({ key: FACETS_CONTENT_KEY });
}

export function runInContext(func, params) {
    return run(
        {
            repository: 'com.enonic.cms.default',
            branch: 'master',
            user: {
                login: 'su',
                userStore: 'system',
            },
            principals: ['role:system.admin'],
        },
        () => func(params)
    );
}