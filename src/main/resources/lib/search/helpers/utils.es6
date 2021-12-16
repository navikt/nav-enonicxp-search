import { run } from '/lib/xp/context';
import { get, query } from '/lib/xp/content';

export const isExactSearch = (queryString) =>
    (queryString.startsWith('"') && queryString.endsWith('"')) ||
    (queryString.startsWith("'") && queryString.endsWith("'"));

export const formatExactSearch = (queryString) => [`"${queryString.replace(/["']/g, '')}"`];

export function isSchemaSearch(ord) {
    return /^\d\d-\d\d\.\d\d$/.test(ord);
}

export function getCountAndStart({
    start: startString = '0',
    count: countString = '1',
    block: blockSize = 20,
}) {
    let count = countString ? parseInt(countString) || 0 : 0;
    count = count ? count * blockSize : blockSize;

    let start = startString ? parseInt(startString) || 0 : 0;
    start *= blockSize;
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
    const { aggregations } = query({ ...ESQuery, count: 0 });
    aggregations.fasetter.buckets = []
        .concat(config.data.fasetter)
        .reduce(mapReducer(aggregations.fasetter.buckets), []);
    return aggregations;
}

const FACETS_CONTENT_KEY = '/www.nav.no/fasetter';

export function getFacetConfiguration() {
    return get({ key: FACETS_CONTENT_KEY });
}

export function getSortedResult(ESQuery, sort) {
    if (sort && sort !== '0') {
        return query({ ...ESQuery, sort: 'publish.first DESC, createdTime DESC' });
    }

    return query({ ...ESQuery, sort: '_score DESC' });
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
