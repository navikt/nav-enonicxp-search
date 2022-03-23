import { sanitize } from '/lib/xp/common';
import { formatExactSearch, isExactSearch } from "./utils";

const sanitizeTerm = (term) => {
    if (!term) {
        return '';
    }

    const sanitizedTerm = sanitize(term).substring(0, 200);

    if (isExactSearch(term)) {
        return formatExactSearch(sanitizedTerm);
    }

    return sanitizedTerm;
}

const validNumber = (rawValue, defaultValue, min = 0, max = 255) => {
    const numberValue = Number(rawValue);
    return numberValue.isNaN() ? defaultValue : Math.max(Math.min(numberValue, max ), min);
}

const validateParams = (params) => {
    const { f, uf, ord, start, excludePrioritized, c, daterange, s } = params;

    return {
        f: validNumber(f, 0), // Facet (valid range can vary depending on nav.no app settings)
        uf: validNumber(uf, 0), // Underfacet (valid range can vary depending on nav.no app settings)
        start: validNumber(start, 0), // Start batch
        c: validNumber(c, 1, 1), // Number of batches
        s: validNumber(s, 0, 0, 1), // Sorting (0 = by best match, 1 = by date)
        daterange: validNumber(daterange, -1, -1, 3), // Date range (-1: all, 0: > 12 months, 1: < 12 months, 2: < 30 days, 3: < 7 days)
        excludePrioritized: excludePrioritized === 'true',
        ord: sanitizeTerm(ord),
    }
}

module.exports = {
    validateParams
}
