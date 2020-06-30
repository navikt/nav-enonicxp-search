const eventLib = require('/lib/xp/event');
const contextLib = require('/lib/xp/context');
const searchCache = require('/lib/search/helpers/cache');
const facetLib = require('/lib/facets');
const clusterLib = require('/lib/xp/cluster');
const navUtils = require('/lib/nav-utils');

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

            // make sure the updateAll lock is released on startup
            const facetValidation = navUtils.getFacetValidation();
            if (facetValidation) {
                navUtils.setUpdateAll(false);
            }
            // set facets if new or content is moved
            // TODO: check if this is needed custom event.
            eventLib.listener({
                type: 'custom.appcreated',
                callback: facetLib.facetHandler,
            });
            eventLib.listener({
                type: 'node.created',
                callback: facetLib.facetHandler,
                localOnly: false,
            });

            eventLib.listener({
                type: 'node.moved',
                callback: facetLib.facetHandler,
                localOnly: false,
            });
        }

        searchCache.activateEventListener();
    }
);

log.info('Search-app: Finished running main');
