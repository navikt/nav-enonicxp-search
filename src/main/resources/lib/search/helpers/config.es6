import contentLib from '/lib/xp/content';
import { runInContext } from '../../utils/context';
import { logger } from '../../utils/logger';
import { forceArray } from '../../utils';

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
        searchConfig = null;
        return;
    }

    if (searchConfigHits.length > 1) {
        logger.critical(`Multiple search configs found! Using oldest.`);
    }

    const searchConfigNew = searchConfigHits[0];
    const defaultFacet = forceArray(searchConfigNew.data.fasetter)[0];

    if (!defaultFacet) {
        logger.critical('Search config does not contain any facets!');
    }

    searchConfig = {
        ...searchConfigNew,
        defaultFacetParam: defaultFacet?.facetKey,
        defaultUfParam: forceArray(defaultFacet?.underfasetter || []).map(
            (uf) => uf.facetKey
        ),
    };

    logger.info('Updated search config cache!');
};

export const getConfig = () => {
    if (!searchConfig) {
        revalidateSearchConfigCache();
    }

    return searchConfig;
};
