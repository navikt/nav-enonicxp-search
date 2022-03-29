import { run } from '/lib/xp/context';
import { get, query } from '/lib/xp/content';

export const isExactSearch = (queryString) =>
    (queryString.startsWith('"') && queryString.endsWith('"')) ||
    (queryString.startsWith("'") && queryString.endsWith("'"));

export const formatExactSearch = (queryString) => `"${queryString.replace(/["']/g, '')}"`;

export function isSchemaSearch(ord) {
    return /^\d\d-\d\d\.\d\d$/.test(ord);
}

export function getCountAndStart({ start, count, batchSize }) {
    return { start: start * batchSize, count: (count - start) * batchSize };
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

const resultWithCustomScoreWeights = (result) => ({
    ...result,
    hits: result.hits
        .map((hit) => {
            const { _score, data } = hit;
            if (!data || !_score) {
                return hit;
            }
            return {
                ...hit,
                _score: data.audience === 'person' ? _score * 1.25 : _score,
                _rawScore: _score,
            };
        })
        .sort((a, b) => b._score - a._score),
});

export function getSortedResult(ESQuery, sort) {
    if (sort === 0) {
        return resultWithCustomScoreWeights(query(ESQuery));
    }

    return query({ ...ESQuery, sort: 'publish.first DESC, createdTime DESC' });
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

// Prioritized elements should be included with the first batch for queries for the first facet + underfacet
export const shouldIncludePrioHits = (params) => {
    const { f, uf, ord, start } = params;

    return (
        !isSchemaSearch(ord) &&
        f === 0 &&
        (uf.length === 0 || (uf.length === 1 && uf[0] === 0)) &&
        start === 0
    );
};
