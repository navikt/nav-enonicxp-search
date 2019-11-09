var event = require('/lib/xp/event');
var contextLib = require('/lib/xp/context');
var nodeLib = require('/lib/xp/node');
var searchCache = require('/lib/search/searchCache');
var checked = [];

var repo = nodeLib.connect({
    repoId: 'com.enonic.cms.default',
    branch: 'draft',
    principals: ['role:system.admin']
});

contextLib.run(
    {
        repository: 'com.enonic.cms.default',
        branch: 'draft',
        user: {
            login: 'pad',
            userStore: 'system'
        },
        principals: ['role:system.admin']
    },
    function() {
        event.listener({
            type: 'custom.appcreated',
            callback: checkFasettConfiguration
        });
        event.listener({
            type: 'node.updated',
            callback: checkFasettConfiguration
        });
        searchCache.activateEventListener();
    }
);

function checkFasettConfiguration(event) {
    var cmsNodesChanged = event.data.nodes.filter(function(node) {
        return node.repo === 'com.enonic.cms.default';
    });
    // stop fasett update if the node change is in another repo
    if (cmsNodesChanged.length === 0) return;
    var node = repo.get(event.data.nodes[0].id);
    if (node && node.type.endsWith('search-config2')) tagAll(node);
    else checkIfUpdateNeeded(node);
}

function checkIfUpdateNeeded(node) {
    if (checked.indexOf(node._id) !== -1) {
        checked.splice(checked.indexOf(node._id), 1);
        return;
    }
    var hits = repo.query({
        start: 0,
        count: 1,
        query: 'type = "' + app.name + ':search-config2"'
    }).hits;
    var fasettConfig = hits.length > 0 ? repo.get(hits[0].id) : null;
    if (fasettConfig) {
        tagAll(fasettConfig, node._id);
    }
}

function newAgg(fasetter, id) {
    var resolver = fasetter.reduce(function(t, el) {
        var underfasett = el.underfasetter ? (Array.isArray(el.underfasetter) ? el.underfasetter : [el.underfasetter]) : [];
        if (underfasett.length === 0 || !underfasett[0]) t.push({ fasett: el.name, query: el.rulekey + ' LIKE "' + el.rulevalue + '"' });
        else
            underfasett.forEach(function(value) {
                t.push({
                    fasett: el.name,
                    underfasett: value.name,
                    className: value.className,
                    query: el.rulekey + ' LIKE "' + el.rulevalue + '" AND ' + value.rulekey + ' LIKE "' + value.rulevalue + '"'
                });
            });
        return t;
    }, []);

    resolver.forEach(function(value) {
        if (!id) {
            log.info('UPDATE FACETS ON ' + value.fasett + ' | ' + value.underfasett);
        }
        var query = {
            query: value.query
        };
        if (id) query.filters = { ids: { values: [id] } };
        var fasett = {
            fasett: value.fasett
        };
        if (value.underfasett) fasett.underfasett = value.underfasett;
        if (value.className) fasett.className = value.className;
        var start = 0;
        var count = 1000;
        var hits = [];
        while (count === 1000) {
            query.start = start;
            query.count = count;
            var res = repo.query(query).hits;
            count = res.length;
            start += count;
            hits = hits.concat(res);
        }
        if (!id) {
            log.info(hits.length);
        }
        hits.forEach(function(hit) {
            checked.push(hit.id);
            repo.modify({
                key: hit.id,
                editor: function(n) {
                    if (!n.hasOwnProperty('x')) n.x = {};
                    if (!n.x.hasOwnProperty('no-nav-navno')) n.x['no-nav-navno'] = {};
                    n.x['no-nav-navno'].fasetter = fasett;
                    return n;
                }
            });
        });
    });
}

function tagAll(node, id) {
    if (!id) {
        log.info('TAG ALL FACETS');
    }
    var fasetter = Array.isArray(node.data.fasetter) ? node.data.fasetter : [node.data.fasetter];
    newAgg(fasetter, id);
}
