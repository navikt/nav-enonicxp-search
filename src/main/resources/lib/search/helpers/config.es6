import contentLib from '/lib/xp/content';
import { runInContext } from '../../utils/context';
import { logger } from '../../utils/logger';
import { forceArray } from '../../utils';
import { getSearchRepoConnection } from './repo';

const searchConfigKey = '/config';

let searchConfig = null;

const validateQueries = (facets, repo) => {
    let isValid = true;

    forceArray(facets).forEach((facet) => {
        try {
            repo.query({
                start: 0,
                count: 0,
                query: facet.ruleQuery,
            });
        } catch (e) {
            logger.error(
                `Invalid query specified for facet [${facet.facetKey}] ${facet.name} - ${facet.ruleQuery}`
            );
            isValid = false;
        }

        forceArray(facet.underfasetter).forEach((uf) => {
            try {
                repo.query({
                    start: 0,
                    count: 0,
                    query: uf.ruleQuery,
                });
            } catch (e) {
                logger.error(
                    `Invalid query specified for underfacet [${facet.facetKey}/${uf.facetKey}] ${uf.name}: ${uf.ruleQuery} - Error: ${e}`
                );
                isValid = false;
            }
        });
    });

    return isValid;
};

const validateFields = (fields, repo) => {
    try {
        repo.query({
            start: 0,
            count: 0,
            query: `fulltext("test", "${fields}", "OR")`,
        });
        return true;
    } catch (e) {
        logger.error(
            `Invalid fields specified in search config: ${fields} - Error: ${e}`
        );
        return false;
    }
};

const validateKeys = (facets) => {
    let isValid = true;

    forceArray(facets).forEach((facet, index, array) => {
        const facetKeyIsDuplicate =
            array.findIndex((facet2) => facet.facetKey === facet2.facetKey) !==
            index;

        if (facetKeyIsDuplicate) {
            isValid = false;
            logger.error(
                `Facet key is not unique: ${facet.facetKey} (${facet.name})`
            );
        }

        forceArray(facet.underfasetter).forEach((uf, ufIndex, ufArray) => {
            const ufKeyIsDuplicate =
                ufArray.findIndex((uf2) => uf.facetKey === uf2.facetKey) !==
                ufIndex;

            if (ufKeyIsDuplicate) {
                isValid = false;
                logger.error(
                    `Underfacet key is not unique: ${facet.facetKey}/${uf.facetKey} (${uf.name})`
                );
            }
        });
    });

    return isValid;
};

const validateConfig = (config, repo) => {
    let isValid = true;

    if (!validateFields(config.data.fields, repo)) {
        isValid = false;
    }

    if (!validateQueries(config.data.fasetter, repo)) {
        isValid = false;
    }

    if (!validateKeys(config.data.fasetter)) {
        isValid = false;
    }

    return isValid;
};

const getLastValidConfig = (repo) => {
    const configNode = repo.get(searchConfigKey);
    if (!configNode?.config?.data?.fasetter) {
        logger.critical('No valid search config found in repo!');
        return null;
    }

    return configNode.config;
};

const setConfigCache = (config) => {
    const defaultFacet = forceArray(config.data.fasetter)[0];

    if (!defaultFacet) {
        logger.critical('Search config does not contain any facets!');
    }

    searchConfig = {
        ...config,
        defaultFacetParam: defaultFacet?.facetKey,
    };
};

export const revalidateSearchConfigCache = () => {
    const searchRepoConnection = getSearchRepoConnection();

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
        logger.critical('No search config found!');
        setConfigCache(getLastValidConfig(searchRepoConnection));
        return;
    }

    if (searchConfigHits.length > 1) {
        logger.critical('Multiple search configs found! Using oldest.');
    }

    const searchConfigNew = searchConfigHits[0];
    if (!validateConfig(searchConfigNew, searchRepoConnection)) {
        logger.critical('Failed to validate search config!');
        setConfigCache(getLastValidConfig(searchRepoConnection));
        return;
    }

    setConfigCache(searchConfigNew);

    logger.info('Updated search config');
};

export const getConfig = () => {
    if (!searchConfig) {
        revalidateSearchConfigCache();
    }

    return searchConfig;
};
