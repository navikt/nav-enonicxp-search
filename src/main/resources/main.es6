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

            eventLib.listener({
                type: 'custom.appcreated',
                callback: facetLib.checkConfiguration,
            });

            // make sure the updateAll lock is released on startup
            const facetValidation = navUtils.getFacetValidation();
            if (facetValidation) {
                navUtils.setUpdateAll(false);
            }

            eventLib.listener({
                type: 'node.pushed',
                callback: facetLib.checkConfiguration,
                localOnly: false,
            });
        }

        searchCache.activateEventListener();
    }
);

log.info('Search-app: Finished running main');
