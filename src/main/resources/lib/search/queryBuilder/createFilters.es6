import { forceArray } from '../../nav-utils';

export default function createFilters(params, config, prioritiesItems) {
    const { f: facetIndex, uf: underfacetIndices } = params;

    const filters = { boolean: { must: [], mustNot: [] } };
    const facetData = config.data.fasetter[facetIndex];

    // exclude no index items
    filters.boolean.mustNot.push({
        hasValue: {
            field: 'data.noindex',
            values: [true],
        },
    });

    if (facetData) {
        filters.boolean.must.push({
            hasValue: {
                field: 'x.no-nav-navno.fasetter.fasett',
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
                    field: 'x.no-nav-navno.fasetter.underfasett',
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
            field: 'x.no-nav-navno.fasetter.fasett',
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
}
