import { sanitize } from '/lib/xp/common';
import { formatExactSearch, isExactSearch } from './utils';

const sanitizeTerm = (term) => {
    if (!term) {
        return '';
    }

    const sanitizedTerm = sanitize(term).substring(0, 200);

    if (isExactSearch(term)) {
        return formatExactSearch(sanitizedTerm);
    }

    return sanitizedTerm;
};

const validNumber = (rawValue, defaultValue, min = 0, max = 255) => {
    const numberValue = Number(rawValue);
    return numberValue.isNaN() ? defaultValue : Math.max(Math.min(numberValue, max), min);
};

const validUnderfacets = (ufInput) => {
    try {
        const parsed = JSON.parse(ufInput);
        if (Array.isArray(parsed)) {
            return parsed
                .map((value) => validNumber(value))
                .filter(
                    (value, index, array) => value !== undefined && array.indexOf(value) === index
                ); // remove undefined and duplicates
        }
    } catch (e) {}

    const numberValue = validNumber(ufInput);

    if (typeof numberValue === 'number') {
        return [numberValue];
    }

    return [];
};

export const parseAndValidateParams = (params) => {
    const { f, uf, ord, start, excludePrioritized, c, daterange, s } = params;

    return {
        f: validNumber(f, 0), // Facet (valid range can vary depending on nav.no app settings)
        uf: validUnderfacets(uf), // Underfacet(s) - input can be a number or array of numbers (valid range, see above)
        start: validNumber(start, 0), // Start batch
        c: validNumber(c, 1, 1), // Number of batches
        s: validNumber(s, 0, 0, 1), // Sorting (0 = by best match, 1 = by date)
        daterange: validNumber(daterange, -1, -1, 3), // Date range (-1: all, 0: > 12 months, 1: < 12 months, 2: < 30 days, 3: < 7 days)
        excludePrioritized: excludePrioritized === 'true',
        ord: sanitizeTerm(ord),
    };
};
