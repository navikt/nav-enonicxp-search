var libs = {
    cache: require('/lib/cache'),
    event: require('/lib/xp/event'),
    content: require('/lib/xp/content')
};
var standardCache = {
    size: 1000,
    expire: 3600 * 24 /* One day */
};

var emptySearchKeys = [];
var searchCache = libs.cache.newCache(standardCache);

function wipeAll() {
    searchCache.clear();
    log.info('search cache wiped');
}

module.exports.getEmptyAggregation = getEmptyAggregation;
function getEmptyAggregation(fallback) {
    return searchCache.get('emptyaggs', fallback);
}

module.exports.getEmptyTimePeriod = getEmptyTimePeriod;
function getEmptyTimePeriod(key, fallback) {
    emptySearchKeys.push(key);
    return searchCache.get(key, fallback);
}

module.exports.getEmptySearchResult = getEmptySearchResult;
function getEmptySearchResult(key, fallback) {
    emptySearchKeys.push(key);
    return searchCache.get(key, fallback);
}

module.exports.getSynonyms = getSynonyms;
function getSynonyms() {
    return searchCache.get('synonyms', function() {
        var synonymLists = libs.content.query({
            start: 0,
            count: 100,
            query: 'type = "' + app.name + ':synonyms"'
        }).hits;

        var synonymMap = {};
        synonymLists.forEach(function(synonymList) {
            synonymList.data.synonyms.forEach(function(s) {
                s.synonym.forEach(function(word) {
                    // add all if its a new word
                    if (!synonymMap[word]) {
                        synonymMap[word] = [].concat(s.synonym);
                    } else {
                        // only add new unique words if it already exists
                        s.synonym.forEach(function(syn) {
                            if (syn !== word && synonymMap[word].indexOf(syn) === -1) {
                                synonymMap[word].push(syn);
                            }
                        });
                    }
                });
            });
        });

        return synonymMap;
    });
}

module.exports.getPriorities = getPriorities;
function getPriorities() {
    return searchCache.get('priorites', function() {
        var priority = [];
        var start = 0;
        var count = 1000;
        while (count === 1000) {
            var q = libs.content.query({
                start: start,
                count: 1000,
                query: `(_parentpath LIKE "*prioriterte-elementer*" OR _parentpath LIKE "*prioriterte-elementer-eksternt*") AND 
                        (type = "navno.nav.no.search:search-priority" OR type = "navno.nav.no.search:search-api2")`
            });

            start += 1000;
            count = q.count;
            priority = priority.concat(
                q.hits.map(function(el) {
                    return el._id;
                })
            );
        }
        return priority;
    });
}

module.exports.activateEventListener = activateEventListener;
function activateEventListener() {
    wipeAll();
    libs.event.listener({
        type: 'node.*',
        localOnly: false,
        callback: function(event) {
            // clear aggregation cache
            searchCache.remove('emptyaggs');
            // clear other empty search caches
            emptySearchKeys.forEach(function(key) {
                searchCache.remove(key);
            });
            // clear full cache if prioritized items or synonyms have changed
            event.data.nodes.forEach(function(node) {
                if (node.branch === 'master' && node.repo === 'com.enonic.cms.default') {
                    var content = libs.content.get({ key: node.id });
                    var typesToClear = [app.name + ':search-priority', app.name + ':search-api2', app.name + ':synonyms'];
                    if (typesToClear.indexOf(content.type) !== -1) {
                        wipeAll();
                    }
                }
            });
        }
    });
}
