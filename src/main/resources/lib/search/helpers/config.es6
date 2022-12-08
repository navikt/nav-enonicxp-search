import contentLib from '/lib/xp/content';
import { runInContext } from '../../utils/context';
import { logger } from '../../utils/logger';

let searchConfig = null;

export const revalidateSearchConfigCache = () => {
    const searchConfigHits = runInContext(
        { branch: 'master' },
        () =>
            contentLib.query({
                start: 0,
                count: 2,
                sort: 'createdTime ASC',
                contentTypes: ['navno.nav.no.search:search-config2'],
            }).hits
    );

    if (searchConfigHits.length === 0) {
        logger.critical(`No search config found!`);
        return;
    }

    if (searchConfigHits.length > 1) {
        logger.critical(`Multiple search configs found! Using oldest.`);
    }

    searchConfig = searchConfigHits[0];

    logger.info('Updated search config cache!');
};

export const getConfig = () => {
    if (!searchConfig) {
        revalidateSearchConfigCache();
    }

    return searchConfig;
};
