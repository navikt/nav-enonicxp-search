import { generateSearchInput } from '../queryBuilder/generateSearchInput';
import { getConfig } from './config';
import { forceArray } from '../../utils';
import { DaterangeParam, SortParam } from '../../constants';

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
    const ufInputArray = ufInput ? forceArray(ufInput) : null;
    if (!ufInputArray || ufInputArray.length === 0) {
        return [];
    }

    const validUfArray = forceArray(facetData.underfasetter).map(
        (uf) => uf.facetKey
    );
    if (validUfArray.length === 0) {
        return [];
    }

    return ufInputArray.filter((uf) =>
        validUfArray.some((validUf) => validUf === uf)
    );
};

export const validateAndTransformParams = (params) => {
    const { f, uf, ord = '', start, c, daterange, s } = params;
    const config = getConfig();

    // Support max 200 characters for the search term
    const ordTrimmed = ord.substring(0, 200).trim();

    const startValid = validNumber(start, 0);
    const countMin = startValid + 1; // end batch must be at least one step above the start batch

    const { wordList, queryString } = generateSearchInput(ordTrimmed);

    const facetInput = Array.isArray(f) ? f[0] : f;
    const facetData = forceArray(config.data.fasetter).find(
        (facet) => facet.facetKey === facetInput
    );

    return {
        f: facetData ? facetInput : config.defaultFacetParam,
        uf: facetData ? validUnderfacets(facetData, uf, config) : [],
        start: startValid, // Start batch
        c: validNumber(c, countMin, countMin), // End batch/count
        s: validNumber(
            s,
            SortParam.BestMatch,
            SortParam.BestMatch,
            SortParam.Date
        ),
        daterange: validNumber(
            daterange,
            DaterangeParam.All,
            DaterangeParam.All,
            DaterangeParam.NewerThan7D
        ),
        ord: ordTrimmed,
        queryString,
        wordList,
    };
};
