import { getConfig } from './config';
import { SortParam } from '../../constants';

export const isExactSearch = (queryString) =>
    (queryString.startsWith('"') && queryString.endsWith('"')) ||
    (queryString.startsWith("'") && queryString.endsWith("'"));

export const formatExactSearch = (queryString) =>
    `"${queryString.replace(/["']/g, '')}"`;

// Matches form numbers
export const isFormSearch = (ord) => {
    return /^\d\d-\d\d\.\d\d$/.test(ord);
};

export const getCountAndStart = ({ start, count, batchSize }) => {
    return { start: start * batchSize, count: (count - start) * batchSize };
};

// Prioritized elements should be included with the first batch for queries for the first facet + underfacet
export const shouldIncludePrioHits = (params) => {
    const { f, uf, ord, start, s: sorting } = params;

    const { facetWithPrioHits, ufWithPrioHits } = getConfig();

    return (
        !isFormSearch(ord) &&
        sorting === SortParam.BestMatch &&
        f === facetWithPrioHits &&
        (uf.length === 0 || (uf.length === 1 && uf[0] === ufWithPrioHits)) &&
        start === 0
    );
};
