var contentLib = require('/lib/xp/content');
var contextLib = require('/lib/xp/context');
var event = require('/lib/xp/event');

module.exports = {
    get: handleGet,
    post: handlePost
};

function handleGet() {
    return {
        status: 405,
        contentType: 'application/json',
        body: {
            message: 'Use POST not GET'
        }
    };
}
function handlePost(req) {
    return {
        status: 501,
        contentType: 'application/json',
        body: {
            message: 'Coming soon(tm)'
        }
    };
    log.info(JSON.stringify(req, null, 4));
    var data = JSON.parse(req.body);
    return contextLib.run(
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
            // TODO fix dette
            var c = contentLib.get({
                key: '/applications/' + data.applicationName.toLowerCase().replace(/ /g, '-')
            });
            if (!c) {
                var r = contentLib.create({
                    displayName: data.applicationName,
                    data: data,
                    parentPath: '/applications',
                    contentType: 'navno.nav.no.search:search-api2'
                });
                log.info(JSON.stringify(r, null, 4));
                event.send({
                    type: 'appcreated',
                    distributed: false,
                    data: {
                        nodes: [{ id: r._id }]
                    }
                });
                return r;
            } else {
                var r = contentLib.modify({
                    key:
                        '/applications/' +
                        data.applicationName
                            .toLowerCase()
                            .split(' ')
                            .join('-'),
                    editor: function(c) {
                        c.data = data;
                        return c;
                    },
                    requireValid: false
                });
                return r;
            }
        }
    );
}
