import { getConfig } from '../helpers/config';

export const commonFilters = () => ({
    boolean: {
        must: [],
        mustNot: [
            {
                hasValue: {
                    field: 'data.noindex',
                    values: [true],
                },
            },
            {
                hasValue: {
                    field: 'x.no-nav-navno.previewOnly.previewOnly',
                    values: [true],
                },
            },
        ],
    },
    notExists: [
        {
            field: 'data.externalProductUrl',
        },
    ],
    exists: [
        {
            field: 'href',
        },
    ],
});

export const createSearchFilters = (params) => {
    const config = getConfig();
    const { f: facetKey, uf: underfacetKeys } = params;

    const filters = commonFilters();

    if (facetKey) {
        filters.boolean.must.push({
            hasValue: {
                field: 'facets.facet',
                values: [facetKey],
            },
        });

        if (underfacetKeys.length > 0) {
            filters.boolean.must.push({
                hasValue: {
                    field: 'facets.underfacets',
                    values: underfacetKeys,
                },
            });
        }
    } else {
        filters.boolean.must.push({
            hasValue: {
                field: 'facets.facet',
                values: [config.defaultFacetParam],
            },
        });
    }

    return filters;
};
