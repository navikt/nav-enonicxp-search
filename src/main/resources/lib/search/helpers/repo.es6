import { connect } from '/lib/xp/node';

let repository = null;

export default function getRepository() {
    if (!repository) {
        repository = connect({
            repoId: 'com.enonic.cms.default',
            branch: 'master',
            principals: ['role:system.admin'],
        });
    }
    return repository;
}
