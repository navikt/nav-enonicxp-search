var event = require('/lib/xp/event');
var contextLib = require('/lib/xp/context');
var nodeLib = require('/lib/xp/node');
var searchCache = require('/lib/search/searchCache');
var navUtils = require('/lib/nav-utils');
var taskLib = require('/lib/xp/task');
var clusterLib = require('/lib/xp/cluster');

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
            login: 'su',
            userStore: 'system'
        },
        principals: ['role:system.admin']
    },
    function() {
        // create analyzer indices on startup, but only on master
        if (clusterLib.isMaster()) {
            __.newBean('no.nav.search.elastic.Analyze').createAnalyzerOnStartup();
        }

        event.listener({
            type: 'custom.appcreated',
            callback: checkFasettConfiguration
        });
        event.listener({
            type: 'node.updated',
            callback: checkFasettConfiguration,
            localOnly: true
        });
        searchCache.activateEventListener();
    }
);

let toCheckOnNext = [];
let debounceTime = 5000;
let lastUpdate = 0;
let currentTask = null;
function checkFasettConfiguration(event) {
    // stop fasett update if the node change is in another repo
    var cmsNodesChanged = event.data.nodes.filter(function(node) {
        return node.repo === 'com.enonic.cms.default';
    });
    if (cmsNodesChanged.length === 0) return;

    // save last node event time
    lastUpdate = Date.now();

    // add node ids to next check
    toCheckOnNext = toCheckOnNext.concat(
        cmsNodesChanged.map(function(node) {
            return node.id;
        })
    );

    // remove duplicates
    toCheckOnNext = toCheckOnNext.filter(function(nodeId, index, self) {
        return self.indexOf(nodeId) === index;
    });

    // run task to check for facet update after 5 seconds after last update
    if (!currentTask) {
        currentTask = taskLib.submit({
            description: 'facet task',
            task: function() {
                taskLib.sleep(debounceTime);
                while (Date.now() - lastUpdate < debounceTime) {
                    taskLib.sleep(500);
                }
                currentTask = null;
                var toCheckOn = toCheckOnNext;
                toCheckOnNext = [];
                checkIfUpdateNeeded(toCheckOn);
            }
        });
    }
}

function checkIfUpdateNeeded(nodeIds) {
    // stop if update all is running
    if (navUtils.isUpdatingAll()) {
        log.info('blocked by update all');
        return;
    }

    // get facet config
    var hits = repo.query({
        start: 0,
        count: 1,
        query: 'type = "' + app.name + ':search-config2"'
    }).hits;
    var facetConfig = hits.length > 0 ? repo.get(hits[0].id) : null;

    // run tagAll if the facet config is part of the nodes to update
    var IsFacetConfigPartOfUpdate =
        nodeIds.filter(function(nodeId) {
            return nodeId === facetConfig._id;
        }).length > 0;

    if (IsFacetConfigPartOfUpdate) {
        tagAll(facetConfig);
        return;
    }

    // update nodes that is not in the just validated nodes list
    if (facetConfig) {
        // get list of just validated nodes
        var justValidatedNodes = navUtils.getJustValidatedNodes();

        // sort nodes into update and ignore
        var nodeInfo = nodeIds.reduce(
            function(c, nodeId) {
                if (justValidatedNodes.indexOf(nodeId) === -1) {
                    c.update.push(nodeId);
                } else {
                    c.ignore.push(nodeId);
                }
                return c;
            },
            { ignore: [], update: [] }
        );

        log.info('ignore ' + nodeInfo.ignore.length);

        // remove ignored nodes from just validated
        if (nodeInfo.ignore.length > 0) {
            navUtils.removeValidatedNodes(nodeInfo.ignore);
        }

        // update nodes that is not in just validated
        if (nodeInfo.update.length > 0) {
            tagAll(facetConfig, nodeInfo.update);
        }
    }
}

function newAgg(fasetter, ids) {
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

    if (ids) {
        log.info('*** UPDATE FACETS ON ' + ids.join(', ') + ' ***');
    }
    resolver = [resolver[0]];
    resolver.forEach(function(value) {
        if (!ids) {
            log.info('UPDATE FACETS ON ' + value.fasett + ' | ' + value.underfasett);
        }
        var query = {
            query: value.query
        };
        if (ids) {
            query.filters = {
                ids: {
                    values: ids
                }
            };
        }
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
        if (!ids) {
            log.info(hits.length);
        }
        navUtils.addValidatedNodes(
            hits.map(function(c) {
                return c.id;
            })
        );
        hits.forEach(function(hit) {
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
    if (!ids) {
        // unblock facet updates
        navUtils.setUpdateAll(false);
    }
}

function tagAll(facetConfig, ids) {
    if (!ids) {
        log.info('TAG ALL FACETS');
        // block facet updates
        navUtils.setUpdateAll(true);
    }
    var fasetter = Array.isArray(facetConfig.data.fasetter) ? facetConfig.data.fasetter : [facetConfig.data.fasetter];
    newAgg(fasetter, ids);
}
