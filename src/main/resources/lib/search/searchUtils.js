var content = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var http = require('/lib/http-client');
var R = require('/lib/ramda');
var cacheLib = require('/lib/cache');
var cache = cacheLib.newCache({
    size: 1000,
    expire: 3600 * 24 /* One day */
});
/*
    ----------- The date ranges for date range aggregations -----
    The key property is currently ignored
 */
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

module.exports = {
    enonicSearch: enonicSearch
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






function enonicSearch(params) {
    var s = Date.now();
    var mapWords = getSearchWords(params.ord);                      // 1. 2.
    log.info(mapWords);
    var prioritiesItems = getPrioritiesedElements(mapWords);        // 3.
    var query = getQuery(mapWords, params);                         // 4.
    var config = content.get({key: '/www.nav.no/fasetter'});
    var aggregations = getAggregations(query, config);              // 5.
    if (params.f) {                                                 // 6.
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
    aggregations.Tidsperiode = content.query(query).aggregations.Tidsperiode;   // 7.
    if (params.daterange) {                                                     // 8.
        var dateRange = getDateRange(params.daterange, aggregations.Tidsperiode.buckets);
        query.query += dateRange;
    }
    var sort = params.s && params.s !== '0' ? 'modifiedTime DESC' : '_score DESC';  // 9.
    query.sort = sort;
    if (prioritiesItems.ids.length > 0) {

        query.filters.boolean.mustNot = {
            hasValue: {
                field: '_id',
                values: prioritiesItems.ids
            }
        }
    }
    var res = content.query(query);                                             // 10.

    var hits = prioritiesItems.hits.concat(res.hits).map(function (el) { // 11.
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
/*
       -------- Coarse algorithm for setting class name to an result element -------
       1. Assume the classname is information, many prioritised elements dont have class names
       2. If it is a file, set it to be pdf
       TODO check what media file it is and set class name accordingly
       3. If it has been mapped with facets, set the classname attribute as its classname

 */
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

/*
     ----------- Get the url from the element ---------
     If it is a service or application, return the given url or host
     else do a portal lookup and return the url
 */
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

/*
     -------------- Algorithm for highlighting ---------------
     11.1. Take the text and split the search words for highlighting
     11.2. Find first occurrence of a word in text
     11.3. If there is an occurrence of a word in text, do the rest of the highlighting from that fragment of text
     11.4. Return a highlighted fragment of text or false
 */
function highLight(text, words) {
    return words.split(" ").reduce(function (t, el) {
        if (el.length < 2) return t;
        if (!t) t = findSubstring(el, text); // 11.2
        else {
            var res = findSubstring(el, t); // 11.3
            t = res ? res : t;
        }
        return t;                           // 11.4
    }, false)
}

/*
    ---------------- Algorithm for finding and highlighting a text fragment ---------------
    11.2.1. Remove any HTML tags with attributes, except the bold tags. The bold tags indicates earlier highlights
    11.2.2. Test the text for the word that should be highlighted and surround the whole word with a <b>tag
    11.2.3. Find the index of the word in text
    11.2.4. If there is no occurrence of the word in text, return false
    11.2.5. Do a check where the index of the word is in the text, if it exceed 200 of length add a trailing (...)
    TODO multiple (...) is added for multiparsed highlights
 */
function findSubstring(word, text) {
    text = text.replace(/<(?:[\/0-9a-zA-ZøæåÅØÆ\s\\="\-:;+%&.?@#()_]*)>[\r\n]*/g, function (e) { // 11.2.1.
        return e === '</b>' || e === '<b>' ? e : '';
    });
    var replaceText = test(word, text);                 // 11.2.2.
    var index = text.indexOf(word);                     // 11.2.3.
    if (index === -1) return false;                     // 11.2.4.
    if (index < 100) {                                  // 11.2.5.
        return text.length > 200 ? substreng(replaceText,0, 200) + ' (...)' : replaceText ;
    }
    else if (index > text.length - 100) {
        return text.length > 200 ? substreng(replaceText,-200) + ' (...)' : replaceText;
    }
    else return text.length > 200 ? substreng(replaceText,index - 100, index + 100) + ' (...)' : replaceText;
}

/*
      -------- 'substring' substitute -----------
      This function make sure that a word is not cut in the middle
      It subtracts or/and add the length of the substring method
 */
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

/*
   --------- Test and replace ---------
   Find the match from any word character + word + any word character and surround the hits with <b> tag
 */
function test(word, text) {
   return text.replace(new RegExp("\\w*" + word + "\\w*", "gi"), function (e) {
        return '<b>' + e + '</b>'
    })
}

/*
    ---------------- 1.1 Extract and optimize search words --------------
    1. Use the nb_NO analyzer to remove stop words and find the stemmed version of the word
    2. From the analyzed version, split the words and see if there is any misspellings and add the correct spelled word
       to the search string
    3. Return result
 */
function getSearchWords(word) {
    word = JSON.parse(http.request({ // 1.
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
    var suggestObj = splitWords.reduce(function (t, el) { // 2.1
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

    return splitWords.reduce(function (t, el) { // 3.
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

/*
    -------------- Map and reduce the facet configuration with the aggregated result ------------
    As the aggregated result don't show hits for buckets containing zero hits, we need to manually add them to the
    aggregation result as a bucket with docCount = 0
 */
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

/*
    ------------ Retrieve the aggregations from the query before query filters is applied and map the results ----------

 */
function getAggregations(query, config) {
    var agg = content.query(query).aggregations;
    agg.fasetter.buckets = (Array.isArray(config.data.fasetter) ?
        config.data.fasetter : [config.data.fasetter])
        .reduce(mapReducer(agg.fasetter.buckets), []);
    return agg;
}

/*
    -------- Add the date range to query if selected ----------
 */
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
/*
    ----------- Retrieve the list of prioritised elements and check if the search would hit any of the elements -----
 */
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
/*
    ---------------- Inject the search words and count to the query and return the query --------------
 */
function getQuery(mappedWords, params) {
    var navApp = 'no.nav.navno:';
    var count = params.c ? !isNaN(Number(params.c)) ? Number(params.c) : 0 : 0;
    count = count ? count * 20 : 20;

    return {
        start: 0,
        count: count,
        query: 'fulltext("data.text, data.ingress, displayName, data.abstract, data.keywords, data.interface.*" ,"' + mappedWords + '", "OR") ' ,
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
