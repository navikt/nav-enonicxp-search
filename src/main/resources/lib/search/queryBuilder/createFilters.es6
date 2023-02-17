import { getConfig } from '../helpers/config';

export const createCommonFilters = (prioritiesItems) => ({
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
            ...(prioritiesItems?.ids.length > 0
                ? [
                      {
                          hasValue: {
                              field: 'contentId',
                              values: prioritiesItems.ids,
                          },
                      },
                  ]
                : []),
        ],
    },
    notExists: [
        {
            field: 'data.externalProductUrl',
        },
    ],
});

export const createSearchFilters = (params, prioritiesItems) => {
    const config = getConfig();
    const { f: facetKey, uf: underfacetKeys } = params;

    const filters = createCommonFilters(prioritiesItems);

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
