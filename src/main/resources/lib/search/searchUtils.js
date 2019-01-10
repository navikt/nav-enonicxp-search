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
    substituteAndSearch: substituteAndSearch
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
