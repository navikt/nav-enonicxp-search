import { run } from '/lib/xp/context';
import enonicSearch from './enonicSearch';
import enonicSearchWithoutAggregations from './enonicSearchWithoutAggregations';

function runInContext(func, params) {
    return run(
        {
            repository: 'com.enonic.cms.default',
            branch: 'master',
            user: {
                login: 'su',
                userStore: 'system',
            },
            principals: ['role:system.admin'],
        },
        () => func(params)
    );
}

export { enonicSearch, enonicSearchWithoutAggregations, runInContext };
