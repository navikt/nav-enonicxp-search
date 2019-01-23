
var event = require('/lib/xp/event');
var content = require('/lib/xp/content');
var nodeLib = require('/lib/xp/node');
var checked = [];

var repo = nodeLib.connect({
    repoId: 'cms-repo',
    branch: 'draft',
    principals: ['role:system.admin']
})

event.listener({
    type: 'node.updated',
    callback: checkFasettConfiguration
});

function checkFasettConfiguration(event) {
    var node = repo.get(event.data.nodes[0].id);
    if (node && node.type.endsWith('search-config2')) tagAll(node);
    else checkIfUpdateNeeded(node);

}

function checkIfUpdateNeeded(node) {
    if (checked.indexOf(node._id) !== -1) {
        checked.splice(checked.indexOf(node._id), 1);
        return
    }
    var fasettConfig = repo.get(repo.query({
        start: 0,
        count: 1,
        query: 'type = "' + app.name +':search-config2"'
    }).hits[0].id);
   // log.info(JSON.stringify(fasettConfig, null, 4));
    tagAll(fasettConfig, node._id)
}

function newAgg(fasetter, id) {
    var resolver = fasetter.reduce(function (t, el) {
        var underfasett = el.underfasetter ? Array.isArray(el.underfasetter) ? el.underfasetter : [el.underfasetter] : [];
        if (underfasett.length === 0 || !underfasett[0]) t.push({ fasett: el.name, query:  el.rulekey + ' LIKE "' + el.rulevalue + '"'});
       else underfasett.forEach(function (value) {
            t.push({ fasett: el.name, underfasett: value.name, className: value.className, query: el.rulekey + ' LIKE "' + el.rulevalue + '" AND ' + value.rulekey + ' LIKE "' + value.rulevalue + '"'  })
        })
        return t;
    },[])
   // log.info(JSON.stringify(resolver, null, 4));
    resolver.forEach(function (value) {
        var query = {
            start: 0,
            count: 100000,
            query: value.query
        };
        if (id) query.filters = {ids: { values: [ id ] }};
        var fasett = {
            fasett: value.fasett
        };
        if (value.underfasett) fasett.underfasett = value.underfasett;
        if (value.className) fasett.className = value.className;
        var hits = repo.query(query).hits;
        hits.forEach(function (hit) {
            checked.push(hit.id);
            repo.modify({
                key: hit.id,
                editor: function(n) {
                    if (!n.hasOwnProperty('x')) n.x = {};
                    if(!n.x.hasOwnProperty('no-nav-navno')) n.x['no-nav-navno'] = {};
                    n.x['no-nav-navno'].fasetter = fasett;
                    return n;
                }
            })
        })
    })
}

function tagAll(node, id) {
    var fasetter = Array.isArray(node.data.fasetter) ? node.data.fasetter : [node.data.fasetter];
    newAgg(fasetter, id);
    //fasetter.forEach(forEachPrimer('fasett', id));
}
