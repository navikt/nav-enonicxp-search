
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
 //   var searchConfig = cache.get('searchy', function() {
 //       return searchUtils.searchBuilder(portal.getContent());
 //   });

 //   params.c = params.c ? params.c * 20 : 20;

  //  var fasetts = searchUtils.getFacetts(params.fasett);

   // log.info(fasetts);



  //  var res = searchUtils.substituteAndSearch(searchConfig, params);

   // var result = JSON.parse(res.body);



  //  var aggregations = getAggregations(result.aggregations, fasetts);


    var result = searchUtils.enonicSearch(params);
 //   log.info(JSON.stringify(result.aggregations, null, 4));
    var aggregations = parseAggs(result.aggregations, params);
  //  log.info(JSON.stringify(result, null, 4));
    var c = params.c ? !isNaN(Number(params.c)) ? Number(params.c) : 1 : 1;
    var isMore = c * 20 < result.total;
    var isSortDate = !params.s || params.s === '0';
    var model = {
        c: c,
        isSortDate: isSortDate,
        s: params.s ? params.s : '0',
        daterange: params.daterange ? params.daterange : '',
        isMore: isMore,
        form: portal.serviceUrl({service: 'search'}),
        word: params.ord,
        total: result.total.toString(10),
        fasett: aggregations.fasetter.buckets.reduce(function (t, el) {
            if (el.checked) t = el.key;
            return t;
        },''),
        aggregations: aggregations,
        hits: result.hits/*result.hits.hits.map(function (el) {
            return { displayName: el._source.displayname[0], href: portal.pageUrl({
                    id: el._id
                }), highlight: (el.highlight['data.ingress'] || el.highlight['data.text._analyzed'] || el.highlight.displayname)[0].replace(/<(\/?strong)>/g, function(e, r) {
                    return '##' + r + '##'
                }).replace(/<([\/0-9a-zA-Z\s\\="\-:;+%&.#()_]*)>|&nbsp;|[.,?():"”;]/g, '').replace(/##(\/?strong)##/g, function (e, r) {
                    return '<' + r + '>';
                }) }
        })*/
        /*suggest: result.suggest['ss'][0].options.reduce(function (t, el) {
            if (!t || t.freq < el.freq) t = el;
            return t;
        }, false)*/
    };


    var body = thymeleaf.render(view, model);

    return {
        body: body
    }
}

exports.get = get;

var ta = [
    'Eldre enn 12 måneder',
    'Siste 12 måneder',
    'Siste 30 dager',
    'Siste 7 dager',

]
function parseAggs(aggs, params) {
    var d = params.daterange ? Number(params.daterange) : -1;
    var tp = 0;
    var tc = true;
    aggs.Tidsperiode.buckets = aggs.Tidsperiode.buckets.map(function (el, index) {
        el.key = ta[index];
        el.checked = d === (aggs.Tidsperiode.buckets.length -1) - index;
        tp = tp + el.docCount;
        if (el.checked) tc = false;
        return el;
    }).reverse();
    aggs.Tidsperiode.docCount = tp.toString(10);
    aggs.Tidsperiode.checked = tc;
    aggs.fasetter.buckets = aggs.fasetter.buckets.map(bucket('fasett', params, false));
    return aggs;
}

function bucket(type, params, parent) {
    return function(el, index) {
        el.className = '';
        if (type === 'fasett') {
            el.checked = Number(params.f || 0) === index;
            el.default = el.checked && (!params.uf || Number(params.uf) === -1);
            el.defaultClassName = el.default ? 'erValgt' : '';
            el.underaggregeringer.buckets = el.underaggregeringer.buckets.map(bucket('under', params, el))
        }
        else {
            el.checked = parent.checked && (Array.isArray(params.uf) ? params.uf : [params.uf]).indexOf(String(index)) > -1
            var cname = parent.key === 'Sentralt Innhold' ? el.key.split(' ')[0].toLowerCase() + ' ' : parent.key.split(' ')[0].toLowerCase() + ' ';
            el.className += cname;
        }
        el.className += el.checked ? 'erValgt' : '';
        return el;
    }
}











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
