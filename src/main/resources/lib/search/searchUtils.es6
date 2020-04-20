const libs = {
    content: require('/lib/xp/content'),
    portal: require('/lib/xp/portal'),
    context: require('/lib/xp/context'),
    searchCache: require('/lib/search/searchCache'),
    node: require('/lib/xp/node'),
    navUtils: require('/lib/nav-utils'),
};
const repo = libs.node.connect({
    repoId: 'com.enonic.cms.default',
    branch: 'master',
    principals: ['role:system.admin'],
});

const runInContext = (func, params) => {
    return libs.context.run(
        {
            repository: 'com.enonic.cms.default',
            branch: 'master',
            user: {
                login: 'su',
                userStore: 'system',
            },
            principals: ['role:system.admin'],
        },
        () => {
            return func(params);
        }
    );
};

/*
    ----------- The date ranges for date range aggregations -----
    The key property is currently ignored
 */

const dateranges = [
    {
        key: 'Siste 7 dager',
        from: 'now-7d',
    },
    {
        key: 'Siste 30 dager',
        to: 'now-7d',
        from: 'now-30d',
    },
    {
        key: 'Siste 12 måneder',
        to: 'now-30d',
        from: 'now-12M',
    },
    {
        key: 'Eldre enn 12 måneder',
        to: 'now-12M',
    },
];

const tidsperiode = {
    dateRange: {
        ranges: dateranges,
        field: 'modifiedTime',
        format: 'dd-MM-yyyy',
    },
};

/*
    ---------------- 1.1 Extract and optimize search words --------------
    1. Use the nb_NO analyzer to remove stop words and find the stemmed version of the word
    2. From the analyzed version, split the words and see if there is any misspellings and add the correct spelled word
       to the search string
    3. Return result
 */
const getSearchWords = queryWord => {
    const word = queryWord.replace(/æ/g, 'ae').replace(/ø/g, 'o');
    // run analyzer to remove stopwords
    const analyze = __.newBean('no.nav.search.elastic.Analyze');
    analyze.text = __.nullOrValue(word);
    let wordList = __.toNativeObject(analyze.analyze()).reduce((t, token) => {
        // only keep unique words from the analyzer
        if (t.indexOf(token.term) === -1) {
            t.push(token.term);
        }
        const oldWord = word.substring(token.startOffset, token.endOffset);
        if (t.indexOf(oldWord) === -1) {
            t.push(oldWord);
        }
        return t;
    }, []);

    // get suggestions
    const suggest = __.newBean('no.nav.search.elastic.Suggest');
    suggest.texts = __.nullOrValue(wordList);
    __.toNativeObject(suggest.suggest()).forEach(suggestion => {
        if (wordList.indexOf(suggestion) === -1) {
            wordList.push(suggestion);
        }
    });

    // synonyms
    const synonymMap = libs.searchCache.getSynonyms();
    wordList = wordList.reduce((list, key) => {
        if (synonymMap[key]) {
            synonymMap[key].forEach(synonym => {
                if (list.indexOf(synonym) === -1) {
                    list.push(synonym);
                }
            });
        }
        return list;
    }, wordList);

    return wordList;
};

const getSearchPriorityContent = id => {
    const content = libs.content.get({
        key: id,
    });

    if (content && content.type === 'no.nav.navno:internal-link') {
        return getSearchPriorityContent(content.data.target);
    }
    return content;
};

/*
    ----------- Retrieve the list of prioritised elements and check if the search would hit any of the elements -----
 */
const getPrioritiesedElements = wordList => {
    const priorityIds = libs.searchCache.getPriorities();

    // add hits on pri content and not keyword
    let hits = libs.content.query({
        query:
            'fulltext("data.text, data.ingress, displayName, data.abstract, data.keywords, data.enhet.*, data.interface.*" ,"' +
            wordList.join(' ') +
            '", "OR") ',
        filters: {
            ids: {
                values: priorityIds,
            },
        },
    }).hits;

    // remove search-priority and add the content it points to instead
    hits = hits.reduce((list, el) => {
        if (el.type === 'navno.nav.no.search:search-priority') {
            const content = getSearchPriorityContent(el.data.content);
            if (content) {
                const missingContent =
                    hits.filter(a => {
                        return a._id === content._id;
                    }).length === 0;

                if (missingContent) {
                    list.push(content);
                }
            } else {
                log.error(`Missing content for prioritized search element ${el._path}`);
            }
        } else {
            list.push(el);
        }
        return list;
    }, []);

    // return hits, and full list pri items
    return {
        ids: priorityIds,
        hits: hits.map(el => ({
            ...el,
            priority: true,
        })),
    };
};

/*
    ---------------- Inject the search words and count to the query and return the query --------------
 */
const getQuery = wordList => {
    const navApp = 'no.nav.navno:';
    const query =
        'fulltext("attachment.*, data.text, data.ingress, displayName, data.abstract, data.keywords, data.enhet.*, data.interface.*" ,"' +
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
    };
};

const addCountAndStart = (params, query) => {
    let count = params.c ? parseInt(params.c) || 0 : 0;
    count = count ? count * 20 : 20;

    let start = params.start ? parseInt(params.start) || 0 : 0;
    start *= 20;
    count -= start;
    return { ...query, start, count };
};

const getFilters = (params, config, prioritiesItems) => {
    let filters = { boolean: { must: [] } };

    if (params.f) {
        filters.boolean.must.push({
            hasValue: {
                field: 'x.no-nav-navno.fasetter.fasett',
                values: [config.data.fasetter[Number(params.f)].name],
            },
        });

        if (params.uf) {
            const values = [];
            (Array.isArray(params.uf) ? params.uf : [params.uf]).forEach(uf => {
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
            filters.boolean.mustNot = {
                hasValue: {
                    field: '_id',
                    values: prioritiesItems.ids,
                },
            };
        }
        return filters;
    }
    filters = {
        boolean: {
            must: {
                hasValue: {
                    field: 'x.no-nav-navno.fasetter.fasett',
                    values: [config.data.fasetter[0].name],
                },
            },
        },
    };
    if (prioritiesItems.ids.length > 0) {
        filters.boolean.mustNot = {
            hasValue: {
                field: '_id',
                values: prioritiesItems.ids,
            },
        };
    }
    return filters;
};

/*
       -------- Coarse algorithm for setting class name to an result element -------
       1. Assume the classname is information, many prioritised elements dont have class names
       2. If it is a file, set it to be pdf
       TODO check what media file it is and set class name accordingly
       3. If it has been mapped with facets, set the classname attribute as its classname

 */
const getClassName = el => {
    let className = 'informasjon';
    if (el.type.startsWith('media')) {
        className = 'pdf';
    }
    if (el.x && el.x['no-nav-navno'] && el.x['no-nav-navno'].fasetter && !el.priority) {
        if (el.x['no-nav-navno'].fasetter.className) {
            className = el.x['no-nav-navno'].fasetter.className;
        } else if (el.x['no-nav-navno'].fasetter.fasett === 'Statistikk') {
            className = 'statistikk';
        }
    }
    return className;
};

/*
     ----------- Get the url from the element ---------
     If it is a service or application, return the given url or host
     else do a portal lookup and return the url
 */
const getPaths = el => {
    const paths = {
        href: '',
        displayPath: '',
    };
    // find href for prioritised items
    if (
        el.type === app.name + ':search-api' ||
        el.type === app.name + ':search-api2' ||
        el.type === 'no.nav.navno:external-link'
    ) {
        paths.href = el.data.host || el.data.url;
        // href for media/files
    } else if (
        el.type === 'media:document' ||
        el.type === 'media:spreadsheet' ||
        el.type === 'media:image'
    ) {
        paths.href = libs.portal.attachmentUrl({
            id: el._id,
        });
    } else {
        // href for everything else
        paths.href = libs.portal.pageUrl({
            id: el._id,
        });
    }

    // find display path for media/files
    if (
        el.type === 'media:document' ||
        el.type === 'media:spreadsheet' ||
        el.type === 'media:image'
    ) {
        paths.displayPath = libs.portal
            .pageUrl({
                id: el._id,
            })
            .split('/')
            .slice(0, -1)
            .join('/');
    } else if (paths.href.indexOf('http') === 0) {
        // find display path for absolute urls
        if (paths.href.indexOf('https://www.nav.no/') === 0) {
            paths.displayPath = paths.href.replace('https://www.nav.no/', '/');
        } else {
            paths.displayPath = paths.href;
        }
    } else {
        // display path for everything else
        paths.displayPath = paths.href
            .split('/')
            .slice(0, -1)
            .join('/');
    }

    return paths;
};

const calculateHighlightText = highLight => {
    if (highLight.ingress.highlighted) {
        return highLight.ingress.text;
    }
    if (highLight.text.highlighted) {
        return highLight.text.text;
    }
    if (highLight.ingress.text) {
        return highLight.ingress.text;
    }
    if (highLight.text.text) {
        return highLight.text.text;
    }
    return '';
};

/*
  -------- 'substring' substitute -----------
  This function make sure that a word is not cut in the middle
  It subtracts or/and add the length of the substring method
*/
const substreng = (text, start, stopp) => {
    let trueStart = start >= 0 ? start : text.length + start;
    let trueStop = stopp;
    let tstopc = text.charAt(trueStop);
    let tc = text.charAt(trueStart);
    while (tc && tc !== ' ') {
        trueStart--;
        tc = text.charAt(trueStart);
    }
    while (tstopc !== ' ' && trueStop < text.length) {
        trueStop++;
        tstopc = text.charAt(trueStop);
    }
    return start >= 0 ? text.substring(trueStart, trueStop) : text.substring(trueStart);
};

const removeHTMLTags = text => {
    return text.replace(/<\/?[^>]+(>|$)/g, '');
};

/*
  --------- Test and replace ---------
  Find the match from any word character + word + any word character and surround the hits with <b> tag
*/
const addBoldTag = (word, text) => {
    return text.replace(new RegExp('\\w*' + word + '\\w*', 'gi'), e => {
        return '<b>' + e + '</b>';
    });
};

/*
    ---------------- Algorithm for finding and highlighting a text fragment ---------------
    11.2.1. Remove any HTML tags with attributes, except the bold tags. The bold tags indicates earlier highlights
    11.2.2. Test the text for the word that should be highlighted and surround the whole word with a <b>tag
    11.2.3. Find the index of the word in text
    11.2.4. If there is no occurrence of the word in text, return false
    11.2.5. Do a check where the index of the word is in the text, if it exceed 200 of length add a trailing (...)
    TODO multiple (...) is added for multiparsed highlights
 */
const findSubstring = (word, text) => {
    const replaceText = addBoldTag(word, text); // 11.2.2.
    const index = text.indexOf(word); // 11.2.3.
    if (index === -1) return false; // 11.2.4.
    if (index < 100) {
        // 11.2.5.
        return text.length > 200 ? substreng(replaceText, 0, 200) + ' (...)' : replaceText;
    }
    if (index > text.length - 100) {
        return text.length > 200 ? substreng(replaceText, -200) + ' (...)' : replaceText;
    }
    return text.length > 200
        ? substreng(replaceText, index - 100, index + 100) + ' (...)'
        : replaceText;
};

/*
     -------------- Algorithm for highlighting ---------------
     11.1. Take the text and split the search words for highlighting
     11.2. Find first occurrence of a word in text
     11.3. If there is an occurrence of a word in text, do the rest of the highlighting from that fragment of text
     11.4. Return a highlighted fragment of text or false
 */
const highLightFragment = (searchText, wordList) => {
    let text = removeHTMLTags(searchText);
    const highligthedText = wordList.reduce((t, word) => {
        let currentText = t;
        if (word.length < 2) {
            return currentText;
        }
        // 11.2
        if (!currentText) {
            currentText = findSubstring(word, text);
        } else {
            const res = findSubstring(word, currentText); // 11.3
            currentText = res || currentText;
        }
        return currentText; // 11.4
    }, false);

    if (highligthedText) {
        return {
            highlighted: true,
            text: highligthedText,
        };
    }

    if (text) {
        text = text.length > 200 ? text.substring(0, 200) + ' (...)' : text;
    }
    return {
        highlighted: false,
        text: text || '',
    };
};

const getHighLight = (el, wordList) => {
    if (el.type === 'media:document') {
        const media = repo.get(el._id);
        if (media && media.attachment) {
            return {
                text: highLightFragment(media.attachment.text || '', wordList),
                ingress: highLightFragment('', wordList),
            };
        }
    }
    return {
        text: highLightFragment(el.data.text || '', wordList),
        ingress: highLightFragment(el.data.ingress || el.data.description || '', wordList),
    };
};

/*
    -------------- Map and reduce the facet configuration with the aggregated result ------------
    As the aggregated result don't show hits for buckets containing zero hits, we need to manually add them to the
    aggregation result as a bucket with docCount = 0
 */
const mapReducer = buckets => {
    return (t, el) => {
        const match = buckets.reduce((t2, e) => {
            return t2 || (e.key === el.name.toLowerCase() ? e : t2);
        }, undefined);

        const docCount = match ? match.docCount : 0;
        const under =
            'underfasetter' in el
                ? (Array.isArray(el.underfasetter) ? el.underfasetter : [el.underfasetter]).reduce(
                      mapReducer(match ? match.underaggregeringer.buckets || [] : []),
                      []
                  )
                : [];
        t.push({
            key: el.name,
            docCount: docCount,
            underaggregeringer: { buckets: under },
        });
        return t;
    };
};

/*
    ------------ Retrieve the aggregations from the query before query filters is applied and map the results ----------

 */
const getAggregations = (query, config) => {
    const agg = libs.content.query(query).aggregations;
    agg.fasetter.buckets = libs.navUtils
        .forceArray(config.data.fasetter)
        .reduce(mapReducer(agg.fasetter.buckets), []);
    return agg;
};

/*
    -------- Add the date range to query if selected ----------
 */
const getDateRange = (daterange, buckets) => {
    const dateRangeValue = Number(daterange);
    if (!buckets || dateRangeValue.isNaN() || !buckets[dateRangeValue]) return '';
    let s = '';
    const e = buckets[dateRangeValue];
    if ('to' in e) {
        s += ' And modifiedTime < dateTime("' + e.to + '")';
    }
    if ('from' in e) {
        s += ' And modifiedTime > dateTime("' + e.from + '")';
    }
    return s;
};

const enonicSearchWithoutAggregations = params => {
    const wordList = params.ord ? getSearchWords(params.ord) : []; // 1. 2.
    const prioritiesItems = getPrioritiesedElements(wordList); // 3.
    let query = getQuery(wordList); // 4.
    const config = libs.content.get({ key: '/www.nav.no/fasetter' });
    query.filters = getFilters(params, config, prioritiesItems); // 6.
    query.sort = '_score DESC'; // 9.
    query = addCountAndStart(params, query);

    const res = libs.content.query(query); // 10.
    let hits = res.hits;

    // add pri to hits if the first fasett and first subfasett, and start index is missin or 0
    let total = res.total;
    if (
        (!params.f || (params.f === '0' && (!params.uf || params.uf === '0'))) &&
        (!params.start || params.start === '0')
    ) {
        hits = prioritiesItems.hits.concat(hits);
        total += prioritiesItems.hits.length;
    }

    hits = hits.map(el => {
        // 11.
        const highLight = getHighLight(el, wordList);
        const highlightText = calculateHighlightText(highLight);
        const href = getPaths(el).href;

        return {
            priority: !!el.priority,
            displayName: el.displayName,
            href: href,
            highlight: highlightText,
            publish: el.publish,
            modifiedTime: el.modifiedTime,
        };
    });
    return {
        total: total,
        hits: hits,
    };
};

const prepareHits = (hit, wordList) => {
    // 11. Join the prioritised search with the result and map the contents with: highlighting,
    // href, displayName and so on

    const highLight = getHighLight(hit, wordList);
    const highlightText = calculateHighlightText(highLight);
    const paths = getPaths(hit);
    const href = paths.href;
    const displayPath = paths.displayPath;
    const className = getClassName(hit);

    let officeInformation;
    if (hit.type === 'no.nav.navno:office-information') {
        officeInformation = {
            phone:
                hit.data.kontaktinformasjon && hit.data.kontaktinformasjon.telefonnummer
                    ? hit.data.kontaktinformasjon.telefonnummer
                    : '',
            audienceReceptions:
                hit.data.kontaktinformasjon &&
                hit.data.kontaktinformasjon.publikumsmottak &&
                hit.data.kontaktinformasjon.publikumsmottak.length > 0
                    ? hit.data.kontaktinformasjon.publikumsmottak.map(a => {
                          return a.besoeksadresse && a.besoeksadresse.poststed
                              ? a.besoeksadresse.poststed
                              : '';
                      })
                    : [],
        };
    }

    let publishedString = null;
    if (hit.type === 'no.nav.navno:main-article') {
        publishedString = libs.navUtils.dateTimePublished(hit, hit.language || 'no');
    }

    return {
        priority: !!hit.priority,
        displayName: hit.displayName,
        href: href,
        displayPath: displayPath,
        highlight: highlightText,
        publish: hit.publish,
        modifiedTime: hit.modifiedTime,
        className: className,
        officeInformation: officeInformation,
        publishedString: publishedString,
    };
};

/*
  ------------ NAV search --------------
  Here follows the current algorithm of the nav.no search
  1. Take the raw search words and analyze them with elasticSearch analyzer (see 1.1)
  2. Apply suggestions with elasticSearch suggest query (see 2. in 1.1)
  3. Check for any prioritised elements from the search words and store them
  4. Create a query based on the search word and facet parameters
  5. Get the facet configuration and generate the aggregations based on the pre filtered query and configuration
  6. Apply filters and Tidsperiode aggregations.
  7. Do a first pass to create Tidsperiode buckets
  8. If the search is limited by a time range, apply it to the query
  9. If the search is sorted by date, apply it to the query
  10. Run the query and store it
  11. Join the prioritised search with the result and map the contents with: highlighting, href, displayName and so on
*/
const enonicSearch = (params, skipCache) => {
    const wordList = params.ord ? getSearchWords(params.ord) : []; // 1. 2.

    // get empty search from cache, or fallback to trying again but with forced skip cache bit
    if (wordList.length === 0 && !skipCache) {
        return libs.searchCache.getEmptySearchResult(JSON.stringify(params), () => {
            return enonicSearch(params, true);
        });
    }

    const prioritiesItems = getPrioritiesedElements(wordList); // 3.

    let query = getQuery(wordList); // 4.
    const config = libs.content.get({ key: '/www.nav.no/fasetter' });
    const aggregations = getAggregations(query, config); // 5.

    query.filters = getFilters(params, config, prioritiesItems); // 6.
    query.aggregations.Tidsperiode = tidsperiode;
    // run time period query, or fetch from cache if its an empty search with an earlier used combination on facet and subfacet
    let q;
    if (wordList.length > 0) {
        q = libs.content.query(query);
    } else {
        q = libs.searchCache.getEmptyTimePeriod(params.f + '_' + JSON.stringify(params.uf), () => {
            return libs.content.query(query);
        });
    }
    aggregations.Tidsperiode = q.aggregations.Tidsperiode; // 7.

    if (params.daterange) {
        const dateRange = getDateRange(params.daterange, aggregations.Tidsperiode.buckets); // 8.
        query.query += dateRange;
    }

    query.sort = params.s && params.s !== '0' ? 'publish.from DESC' : '_score DESC'; // 9.
    query = addCountAndStart(params, query);

    const res = libs.content.query(query); // 10.
    let hits = res.hits;

    // add pri to hits if the first fasett and first subfasett, and start index is missin or 0
    let total = res.total;
    if (
        params.debug !== 'true' &&
        (!params.f || (params.f === '0' && (!params.uf || params.uf === '0'))) &&
        (!params.start || params.start === '0')
    ) {
        hits = prioritiesItems.hits.concat(hits);
        total += prioritiesItems.hits.length;

        // add pri count to aggregations as well
        aggregations.fasetter.buckets[0].docCount += prioritiesItems.hits.length;
        aggregations.fasetter.buckets[0].underaggregeringer.buckets[0].docCount +=
            prioritiesItems.hits.length;
    }

    let scores = {};
    let prioritized = [];
    if (params.debug) {
        prioritized = prioritiesItems.hits;
        scores = repo.query({ ...query, explain: true });
        scores = scores.hits.reduce((agg, hit) => {
            return { ...agg, [hit.id]: hit.score };
        }, {});
    }
    // prepare the hits with highlighting and such
    hits = hits.map(hit => {
        let preparedHit = prepareHits(hit, wordList);
        if (params.debug) {
            // if debug on, add
            // 1. score
            // 2. id
            preparedHit = { ...preparedHit, id: hit._id || 0, score: scores[hit._id] || 0 };
        }
        return preparedHit;
    });
    // Logging of search
    // <queryString - mainfacet|subfacets / timeInterval> => [searchWords] -- [numberOfHits | prioritizedHits]
    let facetsLog = '';
    if (params.f) {
        facetsLog = ` - ${params.f}|${
            params.uf ? libs.navUtils.forceArray(params.uf).join(', ') : ''
        }`;
    }
    if (params.daterange && params.daterange !== '-1') {
        facetsLog += ` / ${params.daterange}`;
    }
    log.info(
        `<${params.ord}${facetsLog}> => ${JSON.stringify(wordList)} -- [${res.total} | ${
            prioritiesItems.hits.length
        }]`
    );

    return {
        total,
        hits,
        aggregations,
        prioritized,
    };
};

module.exports = {
    enonicSearch,
    enonicSearchWithoutAggregations,
    runInContext,
};
