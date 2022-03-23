import { forceArray } from '../../nav-utils';

export default function createFilters(params, config, prioritiesItems) {
    const { f: facetIndex, uf: underfacets } = params;

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

        if (underfacets.length > 0) {
            const underfacetsData = forceArray(facetData.underfasetter);

            const values = underfacets.reduce((acc, uf) => {
                const underfasett = underfacetsData[uf];

                if (!underfasett) {
                    log.info(
                        `Invalid underfacet parameter specified - facet: ${facetIndex} - underfacet: ${uf}`
                    );
                    return acc;
                }

                return [...acc, underfasett.name];
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
