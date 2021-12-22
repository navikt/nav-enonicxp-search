import { forceArray } from '../../nav-utils';

export default function createFilters(params, config, prioritiesItems) {
    const filters = { boolean: { must: [], mustNot: [] } };
    const fasett = config.data.fasetter[Number(params.f)];

    // exclude no index items
    filters.boolean.mustNot.push({
        hasValue: {
            field: 'data.noindex',
            values: [true],
        },
    });

    if (fasett) {
        filters.boolean.must.push({
            hasValue: {
                field: 'x.no-nav-navno.fasetter.fasett',
                values: [fasett.name],
            },
        });

        if (params.uf) {
            const ufParams = forceArray(params.uf);
            const underfasetter = forceArray(fasett.underfasetter);

            const values = ufParams.reduce((acc, uf) => {
                const underfasett = underfasetter[Number(uf)];

                if (!underfasett) {
                    log.info(
                        `Invalid underfacet parameter specified - facet: ${params.f} - underfacet: ${uf}`
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
