var libs = {
    cache: require('/lib/cache'),
    event: require('/lib/xp/event'),
    content: require('/lib/xp/content')
};
var standardCache = {
    size: 1000,
    expire: 3600 * 24 /* One day */
};

var priorityCache = libs.cache.newCache(standardCache);

function wipeAll() {
    priorityCache.clear();
    log.info('priority cache wiped');
}

module.exports.getPriorities = getPriorities;
function getPriorities() {
    return priorityCache.get('priorites', function() {
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

module.exports.getPriorityContent = getPriorityContent;
function getPriorityContent() {
    return priorityCache.get('priorityContent', function() {
        var priorityContent = [];
        getPriorities().forEach(function(el) {
            if (el.type === 'navno.nav.no.search:search-priority' && el.data.content) {
                var content = libs.content.get({
                    key: el.data.content
                });
                if (content) {
                    priorityContent.push(content._id);
                }
            }
        });
        return priorityContent;
    });
}

module.exports.activateEventListener = activateEventListener;
function activateEventListener() {
    wipeAll();
    libs.event.listener({
        type: 'node.*',
        localOnly: false,
        callback: function(event) {
            event.data.nodes.forEach(function(node) {
                if (node.branch === 'master' && node.repo === 'com.enonic.cms.default') {
                    var content = libs.content.get({ key: node.id });
                    if (content.type === app.name + ':search-priority') {
                        wipeAll();
                    }
                }
            });
        }
    });
}
