var U = require('/lib/search/searchUtils');
var content = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
function handleGet(req) {
   // var params = req.params;
  //  log.info(JSON.stringify(params, null, 4));
  //  switch (params.type) {
  //      case 'content': return getContent(params, 'searchy');
    //    case 'update': return getContent(params, 'update')
       // case 'app': return getApp(params);
       // case 'facettconfig': return getFacetts(req);
       // case 'priorities': return getPriorities(params);
       // case 'stopwords': return stopwords(req);
       // case 'exact': return getContent(params, true);
       // case 'ldPriorities': return getPriorities(params, true);
   // }

    return require('../../site/parts/searchresult/searchresult').get(req)
}

function getFacetts(req) {
    return {
       body: U.getFacetts(req)
    }
}

function stopwords() {
    return {
        body: JSON.stringify(content.query({
            contentTypes: [ app.name + ':search-stopwords'],
            query: 'language LIKE "no"'
        }).hits[0].data.csv.split(','))
    }
}

function getPriorities(params, ld) {
    var word =  ld ? U.removeStopWords(params.ord, 'no').join(" ") : U.addLevenstein(U.removeStopWords(params.ord, 'no').join(" "));
    return {
        body: JSON.stringify(content.query({
            query: 'fulltext("displayName, data.ingress, data.text", "' + word + '", "OR")',
            filters: {
                ids: {
                    values:  U.priorityReducerComposedWithHitsView(content.query(U.priorityQuery))
                }
            }
        }).hits.map(function (el) {
            return { _id: el._id, displayName: el.displayName, href: portal.pageUrl({ id: el._id }), text: el.data.text || el.displayName, ingress: el.data.ingress || el.displayName }
        }))
    }
}

function getApi(params) {

}

function getApp(params) {
    var word = params.ord;
    word = U.addLevenstein(U.removeStopWords(word, 'no').join(" "));
    var primedApiMap = U.apiMap(word);
    return {
        body: JSON.stringify(U.mapHitsViewWithMap(content.query(U.indexedApi), primedApiMap).reduce(function (t, el) {
            if (el) t.push(el);
            return t;
        }, []))
    }
}

function getContent(params, file) {
    //log.info(U.search(params, file).body);
    return {
        body: U.search(params, file).body,
        contentType: 'application/json'
    };
}

exports.get = handleGet;
