

var contentLib = require('/lib/xp/content');
var contextLib = require('/lib/xp/context');
var ramda = require('/lib/ramda');

module.exports = {
    get: handleGet,
    post: handlePost
}

function handleGet(req) {
    log.info(JSON.stringify(req, null, 4));

    return {
        body: 'hello'
    }
}

function handlePost(req) {
    log.info(JSON.stringify(req, null, 4));
    var data = parseParams(JSON.parse(req.body));

    log.info(JSON.stringify(data, null, 4));


    return contextLib.run({
        repository: 'cms-repo',
        branch: 'draft',
        user: {
            login: 'pad',
            userStore: 'system'
        },
        principals: ["role:system.admin"]
    }, function () {
        var r = contentLib.create({
            displayName: data.applicationName,
            data: data,
            parentPath: '/applications',
            contentType: 'navno.nav.no.search:search-api'
        });
        return r
    })

}

function parseParams(params) {

    var prps = function(p) { return ramda.prop(p, params)};
    var addHost = ramda.assoc('host', prps('url'));
    var addAppName = ramda.assoc('applicationName', prps('name'));
    var addInterface = ramda.assocPath(['interface', '_selected'], prps('type'), {});
    var mergeType = ramda.over(ramda.lensPath(['interface', prps('type')]), ramda.merge(
        ramda.fromPairs([['options',  {}]])));
    var mergeMethod = ramda.over(
        ramda.lensPath(['interface', prps('type'), 'options'])
        , ramda.merge(ramda.fromPairs([[prps('method'), prps('params')],['_selected', prps('method')]])));
    var index = ramda.over(ramda.lensPath(['interface', prps('type')]), ramda.merge(ramda.fromPairs([['body', prps('body')]])));
    var isIndex = prps('type') === 'index' ? index : ramda.pipe(mergeType, mergeMethod);
    var addKeywords = ramda.assoc('keywords', ramda.flatten([prps('keywords')]));
    var addResultKeys = ramda.assoc('resultkeys', prps('resultKeys'));
    return ramda.pipe(addHost, addAppName, isIndex, addKeywords, addResultKeys)(addInterface, {})
}


