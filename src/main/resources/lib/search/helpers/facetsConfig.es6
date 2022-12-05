import contentLib from '/lib/xp/content';
import { runInContext } from '../../utils/context';
import { logger } from '../../utils/logger';

export const getFacetsConfig = () => {
    const facetsConfigHits = runInContext(
        { branch: 'master' },
        () =>
            contentLib.query({
                start: 0,
                count: 2,
                sort: 'createdTime ASC',
                contentTypes: ['navno.nav.no.search:search-config2'],
            }).hits
    );

    if (facetsConfigHits.length === 0) {
        logger.critical(`No facets config found!`);
        return null;
    }

    if (facetsConfigHits.length > 1) {
        logger.critical(`Multiple facets configs found! Using oldest.`);
    }

    return facetsConfigHits[0];
};
