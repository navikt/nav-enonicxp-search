log.info('Search-app: Started running main');

import './lib/polyfills';

import * as clusterLib from '/lib/xp/cluster';
import { runInContext } from './lib/utils/context';
import { activateEventListener } from './lib/search/helpers/cache';

runInContext(
    {
        repository: 'com.enonic.cms.default',
        branch: 'draft',
        asAdmin: true,
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
