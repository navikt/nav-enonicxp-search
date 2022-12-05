import contextLib from '/lib/xp/context';
import { searchRepo } from '../constants';

const adminContextOptions = {
    user: {
        login: 'su',
        idProvider: 'system',
    },
    principals: ['role:system.admin'],
};

export const runInContext = ({ branch, repository, asAdmin }, func) => {
    const currentContext = contextLib.get();
    log.info(`${branch} ${repository} ${asAdmin}`);

    return contextLib.run(
        {
            ...currentContext,
            ...(asAdmin && adminContextOptions),
            repository: repository || currentContext.repository,
            branch: branch || currentContext.branch,
        },
        func
    );
};
