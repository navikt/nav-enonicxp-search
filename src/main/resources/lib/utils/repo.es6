import * as nodeLib from '/lib/xp/node';
import { contentRepo, searchRepo } from '../constants';

export const getContentRepoConnection = () =>
    nodeLib.connect({
        repoId: contentRepo,
        branch: 'master',
        principals: ['role:system.admin'],
    });

export const getSearchRepoConnection = () =>
    nodeLib.connect({
        repoId: searchRepo,
        branch: 'master',
    });
