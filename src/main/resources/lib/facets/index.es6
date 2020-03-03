const navUtils = require('/lib/nav-utils');
const nodeLib = require('/lib/xp/node');
const taskLib = require('/lib/xp/task');

const repo = nodeLib.connect({
    repoId: 'com.enonic.cms.default',
    branch: 'draft',
    principals: ['role:system.admin'],
});

let toCheckOnNext = [];
const debounceTime = 5000;
let lastUpdate = 0;
let currentTask = null;

const newAgg = (fasetter, ids) => {
    // create queries for each facet and subfacet
    const resolver = fasetter.reduce((t, el) => {
        const underfasett = navUtils.forceArray(el.underfasetter);
        if (underfasett.length === 0 || !underfasett[0]) {
            t.push({
                fasett: el.name,
                query: el.rulekey + ' LIKE "' + el.rulevalue + '"',
            });
        } else {
            underfasett.forEach(value => {
                t.push({
                    fasett: el.name,
                    underfasett: value.name,
                    className: value.className,
                    query:
                        el.rulekey +
                        ' LIKE "' +
                        el.rulevalue +
                        '" AND ' +
                        value.rulekey +
                        ' LIKE "' +
                        value.rulevalue +
                        '"',
                });
            });
        }
        return t;
    }, []);

    if (ids) {
        log.info('*** UPDATE FACETS ON ' + ids.join(', ') + ' ***');
    }
    // iterate over each facet update the ids which have been published
    resolver.forEach(function(value) {
        if (!ids) {
            log.info('UPDATE FACETS ON ' + value.fasett + ' | ' + value.underfasett);
        }

        const query = {
            query: value.query,
        };

        // filter for just the currently updated ids
        if (ids) {
            query.filters = {
                ids: {
                    values: ids,
                },
            };
        }
        const fasett = {
            fasett: value.fasett,
        };
        if (value.underfasett) fasett.underfasett = value.underfasett;
        if (value.className) fasett.className = value.className;
        let start = 0;
        let count = 1000;
        let hits = [];

        // make sure we get all the content, query 1k at a time.
        while (count === 1000) {
            query.start = start;
            query.count = count;

            const res = repo.query(query).hits;
            count = res.length;
            start += count;
            hits = hits.concat(res);
        }

        navUtils.addValidatedNodes(hits.map(c => c.id));

        hits.forEach(hit => {
            repo.modify({
                key: hit.id,
                editor: elem => {
                    const n = elem;
                    n.x = !n.x ? {} : n.x;
                    n.x['no-nav-navno'] = !n.x['no-nav-navno'] ? {} : n.x['no-nav-navno'];
                    n.x['no-nav-navno'].fasetter = fasett;
                    return n;
                },
            });

            // republish objects which have been updated with facets
            repo.push({
                key: hit.id,
                target: 'master',
            });
        });
    });

    if (!ids) {
        // unblock facet updates
        navUtils.setUpdateAll(false);
    }
};
const tagAll = (facetConfig, ids) => {
    if (!ids) {
        log.info('TAG ALL FACETS');
        // block facet updates
        navUtils.setUpdateAll(true);
    }
    const fasetter = navUtils.forceArray(facetConfig.data.fasetter);
    newAgg(fasetter, ids);
};

const checkIfUpdateNeeded = nodeIds => {
    // stop if update all is running
    if (navUtils.isUpdatingAll()) {
        log.info('blocked by update all');
        return;
    }

    // get facet config
    const hits = repo.query({
        start: 0,
        count: 1,
        query: 'type = "' + app.name + ':search-config2"',
    }).hits;
    const facetConfig = hits.length > 0 ? repo.get(hits[0].id) : null;

    // run tagAll if the facet config is part of the nodes to update
    const IsFacetConfigPartOfUpdate =
        nodeIds.filter(nodeId => {
            return nodeId === facetConfig._id;
        }).length > 0;

    if (IsFacetConfigPartOfUpdate) {
        tagAll(facetConfig);
        return;
    }

    // update nodes that is not in the just validated nodes list
    if (facetConfig) {
        // get list of just validated nodes
        const justValidatedNodes = navUtils.getJustValidatedNodes();

        // sort nodes into update and ignore
        const nodeInfo = nodeIds.reduce(
            (c, nodeId) => {
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
};

const checkConfiguration = event => {
    // stop fasett update if the node change is in another repo
    const cmsNodesChanged = event.data.nodes.filter(node => {
        return node.repo === 'com.enonic.cms.default';
    });
    if (cmsNodesChanged.length === 0) return;

    // save last node event time
    lastUpdate = Date.now();

    // add node ids to next check
    toCheckOnNext = toCheckOnNext.concat(
        cmsNodesChanged.map(node => {
            return node.id;
        })
    );

    // remove duplicates
    toCheckOnNext = toCheckOnNext.filter((nodeId, index, self) => {
        return self.indexOf(nodeId) === index;
    });

    // run task to check for facet update after 5 seconds after last update
    if (!currentTask) {
        currentTask = taskLib.submit({
            description: 'facet task',
            task: () => {
                taskLib.sleep(debounceTime);
                while (Date.now() - lastUpdate < debounceTime) {
                    taskLib.sleep(500);
                }
                currentTask = null;
                const toCheckOn = toCheckOnNext;
                toCheckOnNext = [];
                checkIfUpdateNeeded(toCheckOn);
            },
        });
    }
};

module.exports = {
    checkConfiguration,
};