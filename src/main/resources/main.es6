const eventLib = require('/lib/xp/event');
const contextLib = require('/lib/xp/context');
const searchCache = require('/lib/search/searchCache');
const facetLib = require('/lib/facets');
const clusterLib = require('/lib/xp/cluster');

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

        eventLib.listener({
            type: 'custom.appcreated',
            callback: facetLib.checkConfiguration,
        });
        eventLib.listener({
            type: 'node.pushed',
            callback: facetLib.checkConfiguration,
            localOnly: true,
        });
        searchCache.activateEventListener();
    }
);