export default function createFilters(params, config, prioritiesItems) {
    const filters = { boolean: { must: [], mustNot: [] } };

    // exclude no index items
    filters.boolean.mustNot.push({
        hasValue: {
            field: 'data.noindex',
            values: [true],
        },
    });

    if (params.f) {
        filters.boolean.must.push({
            hasValue: {
                field: 'x.no-nav-navno.fasetter.fasett',
                values: [config.data.fasetter[Number(params.f)].name],
            },
        });

        if (params.uf) {
            const values = [];
            (Array.isArray(params.uf) ? params.uf : [params.uf]).forEach((uf) => {
                const undf = Array.isArray(config.data.fasetter[Number(params.f)].underfasetter)
                    ? config.data.fasetter[Number(params.f)].underfasetter
                    : [config.data.fasetter[Number(params.f)].underfasetter];
                values.push(undf[Number(uf)].name);
            });
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
