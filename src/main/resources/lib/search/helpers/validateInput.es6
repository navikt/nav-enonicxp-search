import { isFormSearch } from './utils';
import { generateSearchInput } from '../queryBuilder/generateSearchInput';
import { getConfig } from './config';
import { forceArray } from '../../utils';

const validNumber = (
    rawValue,
    defaultValue = undefined,
    min = 0,
    max = 255
) => {
    const numberValue = Number(rawValue);
    return numberValue.isNaN()
        ? defaultValue
        : Math.max(Math.min(numberValue, max), min);
};

const validUnderfacets = (facetData, ufInput) => {
    const validUfArray = forceArray(facetData.underfasetter).map(
        (uf) => uf.facetKey
    );
    if (validUfArray.length === 0) {
        return [];
    }

    const ufInputArray = ufInput ? forceArray(ufInput) : null;
    if (!ufInputArray || ufInputArray.length === 0) {
        return validUfArray;
    }

    return ufInputArray.filter((uf) =>
        validUfArray.some((validUf) => validUf === uf)
    );
};

export const validateAndTransformParams = (params) => {
    const {
        f,
        uf,
        ord = '',
        start,
        excludePrioritized,
        c,
        daterange,
        s,
    } = params;
    const config = getConfig();

    // Support max 200 characters for the search term
    const ordTrimmed = ord.substring(0, 200).trim();

    const startValid = validNumber(start, 0);
    const countMin = startValid + 1; // end batch must be at least one step above the start batch

    const { wordList, queryString } = generateSearchInput(ordTrimmed);

    const facetData = forceArray(config.data.fasetter).find(
        (facet) => facet.facetKey === f
    );

    return {
        f: facetData ? f : config.data.fasetter[0]?.facetKey,
        uf: facetData
            ? validUnderfacets(facetData, uf, config)
            : config.data.fasetter[0]?.underfasetter.map((uf) => uf.facetKey),
        start: startValid, // Start batch
        c: validNumber(c, countMin, countMin), // End batch/count
        s: validNumber(s, 0, 0, 1), // Sorting (0: by best match, 1: by date)
        daterange: validNumber(daterange, -1, -1, 3), // Date range (-1: all, 0: > 12 months, 1: < 12 months, 2: < 30 days, 3: < 7 days)
        excludePrioritized: excludePrioritized === 'true' || isFormSearch(ord),
        ord: ordTrimmed,
        queryString,
        wordList,
    };
};
