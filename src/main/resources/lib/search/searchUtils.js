var content = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var http = require('/lib/http-client');
var R = require('/lib/ramda');
var cacheLib = require('/lib/cache');
var cache = cacheLib.newCache({
    size: 1000,
    expire: 3600 * 24 /* One day */
})

var query = {
    start: 0,
    count: 100000
};
var priorityQuery = R.merge({
    contentTypes: [
        app.name + ':search-priority'
    ]
}, query);


var indexedApi = R.merge({
    contentTypes: [
        app.name + ':search-api'
    ],
    filters: {
        boolean: {
            must: {
                hasValue: {
                    field: 'data.interface._selected',
                    values: [ 'url' ]
                }
            }
        }
    }
}, query);



var hitsLens = R.lensProp('hits');
var hitsView = R.view(hitsLens);
var priorityReducer = R.reduce(priorityReduce, []);
var priorityReducerComposedWithHitsView = R.compose(priorityReducer, hitsView);
var prioritySort = R.sort(prioritySorter);

function priorityReduce(to, el) {
    var e = R.flatten([el.data.elements]);
    return to.concat(e.reduce(function (t, elem) {
        t.push( elem.content );
        return t
    }, []));
}
function prioritySorter(a, b) {
    if (a.priority && !b.priority) return -1;
    else if (!a.priority && b.priority) return 1;
    return 0
}
function allQuery(word) {
    return R.merge({
        query: 'fulltext("displayName, data.ingress, data.text", "' + word + '", "OR")',
        contentTypes: [
            'no.nav.navno:main-article',
            'no.nav.navno:oppslagstavle',
            'no.nav.navno:tavleliste',
            'no.nav.navno:transport'
        ]
    }, query);
}
function mapHref(href, el) {

    return { _id: el._id, displayName: el.displayName, href: href, type: el.type, date: el.createdTime, modified: el.modifiedTime }
}
function allQueryMap(el) {
    if (typeof el === 'function' || Array.isArray(el)) {
        return function (e) {
            return R.merge(mapHref(portal.pageUrl({ id: e._id }), e), { ld: getLD(el, e) })
        }
    }
    return mapHref(portal.pageUrl({ id: el._id }), el)
}
function dataHost(el) {
    return mapHref(el.data.host, el);
}

function apiQuery(word) {
    return R.merge({
        start: 0,
        count: 100000,
        contentTypes: [
            app.name + ':search-api'
        ],
        query: 'fulltext("data.interface.index.body", "' + word + '", "OR")',
        // sort: '_score DESC'
    }, query)
}

function concater(a) {
    return R.flatten(a)

}

function apiMap(word) {
    return function (el) {
        var options = el.data.interface.url.options;
        var host = el.data.host;
        var method = options._selected;
        var query = options[method].body;
        var resultKey = el.data.resultkeys;
        var reqOpts = {
            url: host,
            method: method.toUpperCase(),
            contentType: 'application/json'
        }
        var params = {};
        params[query] = word;
        if (method === 'get') {
            reqOpts.params = params
        }
        else {
            reqOpts.body = JSON.stringify(params)
        }
        var res = {};
        try {
            res = http.request(reqOpts);
        } catch (e) {
            res.status = 404
        }

        return res.status !== 404 ? {
            _id: el._id,
            displayName: el.displayName,
            href: JSON.parse(res.body)[resultKey].link
        } : undefined;
    }
}

function mapHitsViewWithMap(querried, map) {
    return R.map(map, hitsView(querried))
}

function hasPriorityPrimer(priorities) {
    return function(val) {
        return !!R.find(R.propEq('_id', val._id))(priorities);
    }
}

function setPriorityPrimer(hasPriority) {
    return function setPriority(val) {
        return R.assoc('priority', hasPriority(val), val);
    }
}


function reducerPrimer(setPriority) {
    return R.reduce(function (acc, val) {
        return acc.concat(setPriority(val));
    }, []);
}

function injectWordToContent(word) {
    return function (f) {
        return content.query(f(word))
    }
}

module.exports = {
    injectWordToContent: injectWordToContent,
    reducerPrimer: reducerPrimer,
    setPriorityPrimer: setPriorityPrimer,
    hasPriorityPrimer: hasPriorityPrimer,
    mapHitsViewWithMap: mapHitsViewWithMap,
    apiQuery: apiQuery,
    allQuery: allQuery,
    allQueryMap: allQueryMap,
    apiMap: apiMap,
    concater: concater,
    dataHost: dataHost,
    getFacetts: getFacetts,
    priorityReducerComposedWithHitsView: priorityReducerComposedWithHitsView,
    indexedApi: indexedApi,
    priorityQuery: priorityQuery,
    prioritySort: prioritySort,
    removeStopWords: removeStopWords,
    addLevenstein: addLevenstein,
    computeLevensteinDistance: computeLevensteinDistance,
    search: search,
    searchBuilder: searchBuilder,
    substituteAndSearch: substituteAndSearch,
    enonicSearch: enonicSearch
}

function removeStopWords(word, l) {
    l = l || 'no';
    var stop = cache.get('stopwords'+l, function() {
        return hitsView(content.query(R.merge({
            contentTypes: [
                app.name + ':search-stopwords'
            ],
            query: 'language LIKE "' + l + '"'
        }, query)))[0].data.csv;
    });

    var rejectStop = R.reject(function (n) {
        return R.indexOf(n, stop) > -1;
    })
    return rejectStop(word.split(' '))
}

function stem(word) {
    var vowels = [ 'a', 'e', 'i', 'o', 'u', 'y', 'æ', 'ø', 'å'];
    var r1 = function(w) {
        var isIn = function (n) {
            return R.indexOf(n, vowels) > -1
        }
        return R.findIndex(isIn)(w)
    }

    var r = r1(word);

}

function addLevenstein(word) {
    return R.reduce(function (t, e) { return t.concat(e.join('')) }, '' , R.map(R.append("~2 "))(word.split(' '))).trim()
}

function computeLevensteinDistance (s, t) {


    if (s.split(' ').length > 1) {
        return s.split(' ').reduce(function (tot, el) {
            tot.push(computeLevensteinDistance(el, t));
            return tot;
        },[])
    }
    if (s.indexOf('~') !== -1) {
        s = s.substr(0, s.indexOf('~'));
    }
    if (t === '') return -1;
    if (t === undefined) {
        return function (nt) {
            return computeLevensteinDistance(s, nt);
        }
    }
    // matrix
    var n = s.length; // length of s
    var m = t.length; // length of t

    if ((!n || !m) || Math.abs(n - m) > 2) return -1;


    var d = R.times(function (nr) {
        return nr === 0 ? R.times(R.identity, m+1) : R.times(function (mr) {
            return mr === 0 ? nr : 1000;
        }, m+1)
    }, n+1);


    d.forEach(function (e, ind) {
        if (ind === 0) d[ind] = e;
        else {
            var s_in = s.charAt(ind - 1);
            d[ind].forEach(function (el, j) {
                var cost = (s_in === t.charAt(j - 1)) ? 0 : 1;
                if (j === 0) {
                    d[ind][j] = el
                }
                else {
                    d[ind][j] = Math.min(d[ind - 1][j] + 1, d[ind][j - 1] + 1, d[ind - 1][j - 1] + cost)
                }
            })
        }
    });
    return d[n][m]
}

function getLD(el, e) {
    var text = e.data.text.split(' ');
    if (Array.isArray(el)) {
        return el.reduce(function (t, ldFunc) {
            t.push(R.reduce(ldReducer(ldFunc), {}, text));
            return t
        }, [])
    }
    return [R.reduce(ldReducer(el), {}, text)];
}

function stripNonCharsAndTags(w) {
   // log.info(w.replace(/<([\/0-9a-zA-Z\s\\="\-:;+%&.#()_]*)>|&nbsp;|[.,?():\/"”;]/g, ' '));
    return w.replace(/<([\/0-9a-zA-Z\s\\="\-:;+%&.#()_]*)>|&nbsp;|[.,?():/"”;]/g, '')
}

function accIsUndefinedOrLessThanZero(acc) {
    return R.or(R.isEmpty(acc),R.lt(showLdOfAcc(acc),0))
}
function ldIsLargerThanMinusOneAndLessThanAcc(ld, acc) {
    return R.and(R.gt(ld, -1), R.lt(ld, showLdOfAcc(acc)))
}
function accIsUndefinedOrLessThanZeroOrLdIsLargerThanMinusOneAndLessThanAcc(acc, ld) {
    return R.or(accIsUndefinedOrLessThanZero(acc), ldIsLargerThanMinusOneAndLessThanAcc(ld, acc))
}
function showLdOfAcc(acc) {
    return R.view(R.lensProp('ld'), acc);
}
function accIsBetweenMinusOneAndMaxLevensteinDistance(acc) {
    return R.and(R.gt(showLdOfAcc(acc), -1), R.lte(showLdOfAcc(acc), 2))
}
function setAccIfAccIsBetweenMinusOneAndMaxLeventeinDistance(acc) {

    return accIsBetweenMinusOneAndMaxLevensteinDistance(acc) ? acc : {};
}

function ldReducer(ldFunc) {
    return function(acc,val) {
        var ld = ldFunc(val);

        if (accIsUndefinedOrLessThanZeroOrLdIsLargerThanMinusOneAndLessThanAcc(acc, ld)) acc = { dym: val, ld: ld };
        return setAccIfAccIsBetweenMinusOneAndMaxLeventeinDistance(acc);
    }

}

/*function getFacetts(req) {
    var l = req.path.indexOf('/se/') !== -1 ? 'se' : req.path.indexOf('/en/') !== -1 ? 'en' : 'no';
    return cache.get('facett' + l, function() {
        return content.query({
            start: 0,
            count: 1,
            query: 'language LIKE "' + l + '"',
            contentTypes: [
                app.name + ':search-config'
            ]
        }).hits[0]
    });
}*/

function searchBuilder(content) {
    var config = content.data;

    return check(config);



    function parseWithSelected(o, ret) {
        var selected = Array.isArray(o._selected) ? o._selected : [o._selected];
        return selected.reduce(function(t, v) {
            t[v] = check(t);
            return t;
        },ret)
    }
    function check(t, r) {
        var ret = r || {};
        for (var k in t) {
            if (t.hasOwnProperty(k)) {
                if (k.endsWith('config')) ret = check(t[k], ret);
                else if (k === 'fasetter') {
                    ret.aggregations = {};
                   ret.aggregations = parseAggs(t[k], ret.aggregations);
                }
                else if (k === 'query') ret.query = check(t[k]);
                else if (k === 'suggest') {
                    ret.suggest = keyVal(t[k].keyVals, {});
                    ret.suggest[t.suggest.name] = check(t.suggest['query-type']);



                }
                else if (k === 'highlight') {
                    ret.highlight = keyVal(t[k].keyVals,{});
                    ret.highlight.fields = (Array.isArray(t[k].fields) ? t[k].fields : [t[k].fields]).map(function(field) {
                        var o = {};
                        o[field.field] = { preTags: [ '<' + field.tag + '>' ], postTags: [ '</' + field.tag + '>' ] }
                        return o
                    })
                }

                else if (k === '_selected') ret = parseWithSelected(t,ret);
                else if (k === 'keyVals') ret = keyVal(t[k],ret);

                else if (k === 'filter') {
                    if (t[k] === 'true') {
                        ret.filter = check(t);
                    }

                }

                else if (Array.isArray(t[k])) ret = t[k].map(function (v) {
                    return check(v);
                })

                else if (k === 'query-type') {
                    ret = check(t[k]);
                }
                else if (typeof t[k] === 'object' && !R.isEmpty(t[k]))ret[k] = check(t[k]);



                else if (!R.isEmpty(t[k])) ret[k] = t[k];
            }
        }

        return ret
    }
    function keyVal(keyVal,ret) {

        keyVal = Array.isArray(keyVal) ? keyVal : [keyVal];
        return keyVal.reduce(function (t, kv) {
             t[kv.key] = kv.value.string || kv.value.number || kv.value.array || (kv.value.boolean && kv.value.boolean === 'true');
            return t;
        },ret)
    }
    function parseAggs(obj, aggs) {
        return (Array.isArray(obj) ? obj : [obj]).reduce(function (object, fasett) {
            object = object || {};
            object[fasett.fasettnavn] = {
                aggs: {}
            };
            var selected = fasett.underfasetter.facetType._selected;
            if (selected === 'dateRange') {
                object[fasett.fasettnavn]['date_range'] = fasett.underfasetter.facetType[selected];
                object[fasett.fasettnavn]['date_range'] = keyVal(fasett.underfasetter.keyVals, object[fasett.fasettnavn]['date_range']);
            }
            else {
                object[fasett.fasettnavn][selected] = {};
                object[fasett.fasettnavn][selected][fasett.underfasetter.facetType[selected].type] = keyVal(fasett.underfasetter.keyVals, {});
            }
            (Array.isArray(fasett.underfasetter.underaggs) ? fasett.underfasetter.underaggs : [fasett.underfasetter.underaggs]).reduce(function (t, e) {
                t = t || {};
                if (!e) {
                    return e;
                }
                t[e.underfasettnavn] = {};
                var selected = e.facetType._selected;
                if (selected === 'dateRange') {
                    t[e.underfasettnavn]['date_range'] = e.facetType[selected];
                    t[e.underfasettnavn]['date_range'] = keyVal(e.keyVals, t[e.underfasettnavn]['date_range'])
                }
                else {
                    t[e.underfasettnavn][selected] = {};
                    t[e.underfasettnavn][selected][e.facetType[selected].type] = keyVal(e.keyVals, {})
                }
                return t;
            }, object[fasett.fasettnavn].aggs);
            if (R.isEmpty(object[fasett.fasettnavn].aggs)) delete object[fasett.fasettnavn].aggs;
            return object
        }, aggs)
    }
}

function substituteAndSearch(conf, params) {
    var config = R.clone(conf);
    var filters = getFacetts(params.fasett);
    if (filters) {
        filters = filters.split(',');
        var f = filters.shift();
        var t = config.aggregations[f];
        f = filters.shift();
        if (f && t.hasOwnProperty('aggs')) {
            t = t.aggs[f];
            config.post_filter = t.filter;
        }
        else if (f && t.hasOwnProperty('date_range')) {
            var l = {

                    range: {}

            };

                var st = t.date_range.ranges.reduce(function (to, e) {
                if (f === e.key) to = e;
                return to;
            },{});
            l.range[t.date_range.field] = {};
            l.range[t.date_range.field].gte = st.from;
            l.range[t.date_range.field].lte = st.to;
            l.range[t.date_range.field].format = t.date_range.format;
            config.post_filter = l;

        }
        else {
            config.post_filter = t.filter;
        }


    }

    log.info(JSON.stringify(config.post_filter, null, 4));


    enonicSearch(params.ord, params.c);
    var body = JSON.stringify(config, null, 4).replace(/{{(\w*)}}/g, function (e, r) {
        return params[r];
    })
    return http.request({
        method: 'POST',
        body: body,
        url: 'http://localhost:9200/search-cms-repo/_search',
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
}

function search(params, file) {
    var c = params.c || 0;
    var start = file === 'searchy' ? 0 : 20 * c;
    var count = file === 'searchy' ? 20 * (Number(c) + 1) : 20;

    return http.request({
        method: 'POST',
        body: JSON.stringify({
            template: {
              file: file
            },
            params: {
                words: params.ord,
                from: start,
                count: count,
                fylker: [
                    { "navn": "Hedmark", "lokal": "hedmark", "type": "prefix" },
                    { "navn": "Hordaland", "lokal": "hordaland", "type": "prefix" },
                    { "navn": "Østfold", "lokal": "ostfold", "type": "prefix" },
                    { "navn": "Rogaland", "lokal": "rogaland", "type": "prefix" },
                    { "navn": "Stor-Oslo", "lokal": "(oslo|akershus|stor-oslo)", "type": "regexp" },
                    { "navn": "Oppland", "lokal": "oppland" , "type": "prefix"},
                    { "navn": "Trøndelag", "lokal": "(nord-trondelag|sor-trondelag|trondelag)", "last": 1, "type": "regexp" }
                ]
            },

        }),
        url: 'http://localhost:9200/search-cms-repo/_search/template'
    })
}

function getFacetts(fasetts) {
    if (!fasetts) return undefined;

    return Array.isArray(fasetts) ? R.dropWhile(function(e){return e === ''},fasetts).join(',') : R.dropWhile(function(e){return e === ''},fasetts.split(',')).join(',');
}

function getSearchWords(word) {
    word = JSON.parse(http.request({
        method: "GET",
        params: {
            analyzer: "nb_NO",
            text: word
        },
        url: 'http://localhost:9200/search-cms-repo/_analyze'
    }).body).tokens.reduce(function (t, el) {
        if (word.split(" ").indexOf(el) === -1) t += el.token + ' ';
        return t;
    },'');
    var splitWords = word.split(" ");
    var suggestObj = splitWords.reduce(function (t, el) {
        t[el] = {
            text: el,
            term: {
                field: "_alltext._analyzed"
            }
        };
        return t;
    },{});
    var suggest = JSON.parse(http.request({
        method: "POST",
        body: JSON.stringify({ size: 0, suggest: suggestObj}),
        url: 'http://localhost:9200/search-cms-repo/_search'
    }).body).suggest;

    return splitWords.reduce(function (t, el) {
        t += el + ' ';
        if (suggest && suggest.hasOwnProperty(el) && suggest[el][0].options.length > 0) {
            t += suggest[el][0].options.reduce(function(to, e) {
                to += e.text + ' ';
                return to;
            }, '')
        }
        return t;
    }, '');

}
function mapReducer(buckets) {
    return function (t, el) {
        var match = buckets.reduce(function (t, e) {
            return t || (e.key === el.name.toLowerCase() ? e : t);
        }, undefined);

        var docCount = match ? match.docCount : 0;
        var under = el.hasOwnProperty('underfasetter')
            ? (Array.isArray(el.underfasetter)
                ? el.underfasetter
                : [el.underfasetter]).reduce(mapReducer(match ? match.underaggregeringer.buckets || [] : []), [])
            : [];
        t.push({key: el.name, docCount: docCount, underaggregeringer: {buckets: under}});
        return t
    }
}

function getAggregations(query, config) {
    var agg = content.query(query).aggregations;
    agg.fasetter.buckets = (Array.isArray(config.data.fasetter) ? config.data.fasetter : [config.data.fasetter]).reduce(mapReducer(agg.fasetter.buckets), []);
    return agg;
}
var dateranges = [


    {
        "to": "now",
        "from": "now-7d",
        "key": "Siste 7 dager"
    },
    {
        "key": "Siste 30 dager",
        "to": "now-7d",
        "from": "now-30d"
    },
    {
        "to": "now-6M",
        "from": "now-12M",
        "key": "Siste 6 måneder"
    },
    {
        "to": "now-12M",
        "key": "Siste 12 måneder"
    }
]
function getQuery(mapWords, params) {
    var navApp = 'no.nav.navno:';
    var count = params.c ? !isNaN(Number(params.c)) ? Number(params.c) : 0 : 0;
    count = count ? count * 20 : 20;

    return {
        start: 0,
        count: count,
        query: 'fulltext("data.text, data.ingress, displayName, data.abstract, data.keywords, data.interface.*" ,"' + mapWords + '", "OR") ' ,
        contentTypes: [
            navApp + 'main-article',
            navApp + 'oppslagstavle',
            navApp + 'tavleliste',
            'media:document',
            app.name + ':search-api',
            app.name + ':search-api2'
        ],
        aggregations: {
            "fasetter": {
                "terms": {
                    "field": "x.no-nav-navno.fasetter.fasett"
                },
                aggregations: {
                    "underaggregeringer": {
                        terms: {
                            field: "x.no-nav-navno.fasetter.underfasett",
                            size: 20
                        },

                    }
                }
            }/*,
            "Tidsperiode": {
                "dateRange": {
                    "ranges": dateranges,
                    "field": "modifiedTime",
                    "format": "dd-MM-yyyy"
                }
            }*/
        }
    }
}

function getDateRange(daterange, buckets) {
    if (!daterange || !buckets || isNaN(Number(daterange)) || !buckets[Number(daterange)]) return '';
    var s = '';
    var e = buckets[buckets.length - 1 - Number(daterange)];
    if (e.hasOwnProperty('to')) {
        s += ' And modifiedTime < dateTime("' + e.to + '")';
    }
    if (e.hasOwnProperty('from')) {
        s+= ' And modifiedTime > dateTime("' + e.from + '")';
    }
    return s
}

function getPrioritiesedElements(words) {
    var priority = content.get({
        key: '/www.nav.no/prioriterte-elementer'
    });
    var priArr = (Array.isArray(priority.data.elements) ? priority.data.elements : [priority.data.elements]).reduce(function (t, el) {
        t.arr.push(el.content);
        if (el.keywords && (Array.isArray(el.keywords) ? el.keywords : [el.keywords]).reduce(function(t, el) {
            return t || words.split(" ").reduce(function (to, e) {
                return to || e.toLowerCase() === el.toLowerCase();
            }, false)
        }, false))  {
            t.keyWords.push(el.content);
        }
        return t;
    },{ arr: [], keyWords: [] });
    log.info(JSON.stringify(priArr));
    var hasKeyWord = priArr.keyWords;
    return { ids: priArr.arr, hits: hasKeyWord.map(function(el) { return content.get({key: el}) }).concat(content.query({
        query: 'fulltext("data.text, data.ingress, displayName, *.keywords, data.interface.*" ,"' + words + '", "OR") ' ,
        filters: {
            ids: {
                values: priArr.arr
            }
        }
    }).hits).map(function(el) {
            el.priority = true;
            return el;
        }) };
}

function enonicSearch(params) {
    var s = Date.now();
    var mapWords = getSearchWords(params.ord);
    log.info(mapWords);
    var prioritiesItems = getPrioritiesedElements(mapWords);
    var query = getQuery(mapWords, params);
    var config = cache.get('config2', function() {
        return content.query({
            start: 0,
            count: 1,
            query: 'type = "' + app.name + ':search-config2"'
        }).hits[0];
    });
    var aggregations = getAggregations(query, config);
    if (params.f) {
        var filters = {
            boolean: {
                must:
                    {
                        hasValue: {
                            field: 'x.no-nav-navno.fasetter.fasett',
                            values: [
                                config.data.fasetter[Number(params.f)].name
                            ]
                        }
                    }

            }

        }
        if (params.uf) {
            var values = [];
            (Array.isArray(params.uf) ? params.uf : [params.uf]).forEach(function (uf) {
                var undf = Array.isArray(config.data.fasetter[Number(params.f)].underfasetter) ? config.data.fasetter[Number(params.f)].underfasetter : [config.data.fasetter[Number(params.f)].underfasetter]
                values.push(undf[Number(uf)].name);
            });
            filters.boolean.must = {
                hasValue: {
                    field: 'x.no-nav-navno.fasetter.underfasett',
                    values: values
                }
            };
        }
        query.filters = filters;
    }
    else {
        query.filters = {
            boolean: {
                must:
                    {
                        hasValue: {
                            field: 'x.no-nav-navno.fasetter.fasett',
                            values: [
                                config.data.fasetter[0].name
                            ]
                        }
                    }

            }
        }
    }
    query.aggregations.Tidsperiode =
        {
        "dateRange": {
            "ranges": dateranges,
                "field": "modifiedTime",
                "format": "dd-MM-yyyy"
        }
    };
    aggregations.Tidsperiode = content.query(query).aggregations.Tidsperiode;
    if (params.daterange) {
        var dateRange = getDateRange(params.daterange, aggregations.Tidsperiode.buckets);
        query.query += dateRange;
    }
    //aggregations = getAggregations(query, config);
    var sort = params.s && params.s !== '0' ? 'modifiedTime DESC' : '_score DESC';
    query.sort = sort;
    if (prioritiesItems.ids.length > 0) {
        log.info(JSON.stringify(prioritiesItems, null, 4));
        query.filters.boolean.mustNot = {
            hasValue: {
                field: '_id',
                values: prioritiesItems.ids
            }
        }
    }
    var res = content.query(query);

    var hits = prioritiesItems.hits.concat(res.hits).map(function (el) {
        var highLight = getHighLight(el, mapWords);
        var href = getHref(el);
        var className = getClassName(el);
        return {
            priority: !!el.priority,
            displayName: el.displayName,
            href: href,
            highlight: highLight.ingress || highLight.text || highLight.displayName,
            publish: el.publish,
            modifiedTime: el.modifiedTime,
            className: className
        }
    });

   log.info(Date.now() - s);
   return {
       total: res.total + prioritiesItems.hits.length,
       hits: hits,
       aggregations: aggregations
   }
}

function getClassName(el) {
    var className = 'informasjon';
    if (el.type.startsWith('media')) {
        className = 'pdf';
    }
    if (el.hasOwnProperty('x') && el.x.hasOwnProperty('no-nav-navno') && el.x['no-nav-navno'].hasOwnProperty('fasetter')) {
        className = el.x['no-nav-navno'].fasetter.className;
    }
    return className;
}

function getHref(el) {
    if (el.type === app.name + ':search-api' || el.type === app.name + ':search-api2') {
        return el.data.host || el.data.url
    }
    return portal.pageUrl({
        id: el._id
    })
}

function getHighLight(el, words) {
    //log.info(JSON.stringify(el, null, 4));
    return {
        text: el.data.text ? highLight(el.data.text, words) : false,
        ingress: el.data.ingress ? highLight(el.data.ingress, words) : false,
        displayName: el.displayName
    }
}

function highLight(text, words) {
    return words.split(" ").reduce(function (t, el) {
        if (el.length < 2) return t;
        if (!t) t = findSubstring(el, text)
        else {
            var res = findSubstring(el, t);
            t = res ? res : t;
        }
        return t;
    }, false)
}

function findSubstring(word, text) {

    //  if (obj.value > LevensteinRange) return substreng(e.ingress, 0, 200);
  //  var replaceText = replaceWord(word);
    text = text.replace(/<(?:[\/0-9a-zA-ZøæåÅØÆ\s\\="\-:;+%&.?@#()_]*)>[\r\n]*/g, function (e) {
        return e === '</b>' || e === '<b>' ? e : '';
    });
    var replaceText = test(word, text);
    var index = text.indexOf(word);
    if (index === -1) return false;
    if (index < 100) {
        return text.length > 200 ? substreng(replaceText,0, 200) + ' (...)' : replaceText ;
    }
    else if (index > text.length - 100) {
        return text.length > 200 ? substreng(replaceText,-200) + ' (...)' : replaceText;
    }
    else return text.length > 200 ? substreng(replaceText,index - 100, index + 100) + ' (...)' : replaceText;
}


function substreng(text, start, stopp) {
    var trueStart = start >= 0 ? start : text.length + start;
    var trueStop = stopp;
    var tstopc = text.charAt(trueStop);
    var tc = text.charAt(trueStart);
    while (tc && tc !== ' ') {
        trueStart--;
        tc = text.charAt(trueStart);
    }
    while (tstopc !== ' ' && trueStop < text.length) {
        trueStop++;
        tstopc = text.charAt(trueStop);
    }
    return start >= 0 ? text.substring(trueStart, trueStop) : text.substring(trueStart);

}

function replaceWord(word) {
    return R.replace(new RegExp(word, 'gi'), '<strong>' + word + '</strong>');
}

function test(word, text) {
   return text.replace(new RegExp("\\w*" + word + "\\w*", "gi"), function (e, r) {
        return '<b>' + e + '</b>'
    })
}


if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return -1.
            return -1;
        },
        configurable: true,
        writable: true
    });
}
