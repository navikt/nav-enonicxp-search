
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');
var search = require('/lib/search');
var searchUtils = require('/lib/search/searchUtils');
var view = resolve('./searchresult.html');
var cacheLib = require('/lib/cache');
var cache = cacheLib.newCache({
    size: 10,
    expires: 3600
})



function get(req)  {

   // var hits = search.hits(req.params.ord);

   // var mostLikely = getMostLikely(hits);

 /*   var model = {
        hits: hits,
        mostLikely: mostLikely
    }*/
    var params = req.params || {};

    log.info(JSON.stringify(params, null, 4));


    if (!params.ord) {
        return {
            body: thymeleaf.render(view, {word: false})
        }
    }
    var searchConfig = cache.get('searchy', function() {
        return searchUtils.searchBuilder(portal.getContent());
    });

    params.c = params.c ? params.c * 20 : 20;

    var fasetts = searchUtils.getFacetts(params.fasett);

    log.info(fasetts);



    var res = searchUtils.substituteAndSearch(searchConfig, params);

    var result = JSON.parse(res.body);



    var aggregations = getAggregations(result.aggregations, fasetts);


    var model = {
        word: params.ord,
        total: result.hits.total,
        aggregations: aggregations,
        hits: result.hits.hits.map(function (el) {
            return { displayName: el._source.displayname[0], href: portal.pageUrl({
                    id: el._id
                }), highlight: (el.highlight['data.ingress'] || el.highlight['data.text._analyzed'] || el.highlight.displayname)[0].replace(/<(\/?strong)>/g, function(e, r) {
                    return '##' + r + '##'
                }).replace(/<([\/0-9a-zA-Z\s\\="\-:;+%&.#()_]*)>|&nbsp;|[.,?():"”;]/g, '').replace(/##(\/?strong)##/g, function (e, r) {
                    return '<' + r + '>';
                }) }
        }),
        suggest: result.suggest['ss'][0].options.reduce(function (t, el) {
            if (!t || t.freq < el.freq) t = el;
            return t;
        }, false)
    };


    var body = thymeleaf.render(view, model);

    return {
        body: body
    }
}

exports.get = get;


function getAggregations(aggregations, fasett) {
    var resArr = [];
    var elsArr = [];
    for (var k in aggregations) {
        aggregations[k].key = k;
        aggregations[k].type = 'checkbox';
        aggregations[k].classname = '';
        if (aggregations.hasOwnProperty(k) && aggregations[k].hasOwnProperty('buckets')) {
            aggregations[k].classname = 'radioFasett';
            aggregations[k].type = 'radio';
            aggregations[k].ulclass = 'tid';
            resArr.push(aggregations[k]);
        }
        else elsArr.push(aggregations[k]);

    }
    resArr.unshift(elsArr.reduce(function (t, el) {
        var buckets = [];
        for (var k in el) {
            if (el.hasOwnProperty(k) && typeof el[k] === "object") {
                var o = el[k];
                o.key = k;
                o.checked = (fasett && fasett.indexOf(o.key) > -1);
                buckets.push(o)
            }
        }
        el.checked = (fasett && fasett.indexOf(el.key) > -1);
        el.li = 'utvidbar';
        el.li += el.checked ? ' erValgt' : '';
        el.subfacets = buckets;
        el.hasSubFacets = buckets.length > 0;
        t.buckets.push(el);
        return t;
    }, {buckets: [], key: ''}));

    return resArr;
}
