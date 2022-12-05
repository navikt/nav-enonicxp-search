import { forceArray } from '../../utils';

export const createFilters = (params, config, prioritiesItems) => {
    const { f: facetIndex, uf: underfacetIndices } = params;

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
    const facetData = config.data.fasetter[facetIndex];

    if (facetData) {
        filters.boolean.must.push({
            hasValue: {
                field: 'facets.facet',
                values: [facetData.name],
            },
        });

        if (underfacetIndices.length > 0) {
            const ufDataArray = forceArray(facetData.underfasetter);

            const values = underfacetIndices.reduce((acc, ufIndex) => {
                const ufData = ufDataArray[ufIndex];

                if (!ufData) {
                    log.info(
                        `Invalid underfacet parameter specified - facet: ${facetIndex} - underfacet: ${ufIndex}`
                    );
                    return acc;
                }

                return [...acc, ufData.name];
            }, []);

            filters.boolean.must.push({
                hasValue: {
                    field: 'facets.underfacets',
                    values: values,
                },
            });
        }

        if (prioritiesItems.ids.length > 0) {
            filters.boolean.mustNot.push({
                hasValue: {
                    field: '_id',
                    values: prioritiesItems.ids,
                },
            });
        }
        return filters;
    }

    filters.boolean.must.push({
        hasValue: {
            field: 'facets.facet',
            values: [config.data.fasetter[0].name],
        },
    });
    if (prioritiesItems.ids.length > 0) {
        filters.boolean.mustNot.push({
            hasValue: {
                field: '_id',
                values: prioritiesItems.ids,
            },
        });
    }
    return filters;
};
