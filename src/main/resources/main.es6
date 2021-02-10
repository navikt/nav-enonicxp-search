const contextLib = require('/lib/xp/context');
const searchCache = require('/lib/search/helpers/cache');
const clusterLib = require('/lib/xp/cluster');

log.info('Search-app: Started running main');
contextLib.run(
    {
        repository: 'com.enonic.cms.default',
        branch: 'draft',
        user: {
            login: 'su',
            userStore: 'system',
        },
        principals: ['role:system.admin'],
    },
    () => {
        // create analyzer indices on startup, but only on master
        if (clusterLib.isMaster()) {
            __.newBean('no.nav.search.elastic.Analyze').createAnalyzerOnStartup();
        }

        searchCache.activateEventListener();
    }
);

log.info('Search-app: Finished running main');
