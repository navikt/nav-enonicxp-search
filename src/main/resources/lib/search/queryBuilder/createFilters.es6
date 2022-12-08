export const createFilters = (params, config, prioritiesItems) => {
    const { f: facetKey, uf: underfacetKeys } = params;

    const filters = {
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
    };

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

    if (prioritiesItems.ids.length > 0) {
        filters.boolean.mustNot.push({
            hasValue: {
                field: 'contentId',
                values: prioritiesItems.ids,
            },
        });
    }

    return filters;
};
