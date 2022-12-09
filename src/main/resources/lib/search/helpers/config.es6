import contentLib from '/lib/xp/content';
import { runInContext } from '../../utils/context';
import { logger } from '../../utils/logger';
import { forceArray } from '../../utils';
import { runSearchQuery } from '../runSearchQuery';

let searchConfig = null;

const validateQueries = (config) => {
    let isValid = true;

    forceArray(config.data.fasetter).forEach((facet) => {
        try {
            runSearchQuery({
                start: 0,
                count: 0,
                query: facet.ruleQuery,
            });
        } catch (e) {
            logger.critical(
                `Invalid query specified for facet [${facet.facetKey}] ${facet.name} - ${facet.ruleQuery}`
            );
            isValid = false;
        }

        forceArray(facet.underfasetter).forEach((uf) => {
            try {
                runSearchQuery({
                    start: 0,
                    count: 0,
                    query: uf.ruleQuery,
                });
            } catch (e) {
                logger.critical(
                    `Invalid query specified for underfacet [${facet.facetKey}/${uf.facetKey}] ${uf.name} - ${uf.ruleQuery}`
                );
                isValid = false;
            }
        });
    });

    return isValid;
};

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

    const searchConfigNew = searchConfigHits[0];
    if (!validateQueries(searchConfigNew)) {
        logger.critical(`Failed to validate search facet queries!`);
        return;
    }

    const defaultFacet = forceArray(searchConfigNew.data.fasetter)[0];

    if (!defaultFacet) {
        logger.critical('Search config does not contain any facets!');
    }

    searchConfig = {
        ...searchConfigNew,
        defaultFacetParam: defaultFacet?.facetKey,
        facetWithPrioHits: defaultFacet?.facetKey,
        ufWithPrioHits: defaultFacet?.underfasetter?.[0]?.facetKey,
    };

    logger.info('Updated search config cache!');
};

export const getConfig = () => {
    if (!searchConfig) {
        revalidateSearchConfigCache();
    }

    return searchConfig;
};
