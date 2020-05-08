/*
    ---------------- Inject the search words and count to the query and return the query --------------
 */
export default function createQuery(wordList, esQuery = {}) {
    const navApp = 'no.nav.navno:';
    const query =
        'fulltext("attachment.*, data.text, data.ingress, displayName, data.abstract, data.keywords^15, data.enhet.*, data.interface.*" ,"' +
        wordList.join(' ') +
        '", "OR") ';

    return {
        start: 0,
        count: 0,
        query: query,
        contentTypes: [
            navApp + 'main-article',
            navApp + 'section-page',
            navApp + 'page-list',
            navApp + 'office-information',
            navApp + 'main-article-chapter',
            navApp + 'large-table',
            navApp + 'external-link',
            'media:document',
            'media:spreadsheet',
            // app.name + ':search-api',
            // app.name + ':search-api2'
        ],
        aggregations: {
            fasetter: {
                terms: {
                    field: 'x.no-nav-navno.fasetter.fasett',
                },
                aggregations: {
                    underaggregeringer: {
                        terms: {
                            field: 'x.no-nav-navno.fasetter.underfasett',
                            size: 30,
                        },
                    },
                },
            } /* ,
            "Tidsperiode": {
                "dateRange": {
                    "ranges": dateranges,
                    "field": "modifiedTime",
                    "format": "dd-MM-yyyy"
                }
            } */,
        },
        ...esQuery,
    };
}
