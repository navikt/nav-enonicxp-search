log.info('Search-app: Started running main');

import './lib/polyfills';

import contextLib from '/lib/xp/context';
import clusterLib from '/lib/xp/cluster';
import { activateEventListener } from './lib/search/helpers/cache';
import { initSearchRepo } from './lib/repo/search-repo';

if (clusterLib.isMaster()) {
    initSearchRepo();
}

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
            __.newBean(
                'no.nav.search.elastic.Analyze'
            ).createAnalyzerOnStartup();
        }

        activateEventListener();
    }
);

log.info('Search-app: Finished running main');
