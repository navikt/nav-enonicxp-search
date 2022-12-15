import cacheLib from '/lib/cache';
import eventLib from '/lib/xp/event';
import contentLib from '/lib/xp/content';
import { runInContext } from '../../utils/context';
import { contentRepo } from '../../constants';
import { getConfig, revalidateSearchConfigCache } from './config';
import { logger } from '../../utils/logger';

const typesToClear = {
    ['navno.nav.no.search:search-priority']: true,
    ['navno.nav.no.search:search-api2']: true,
    ['navno.nav.no.search:synonyms']: true,
};

const prioritiesAndSynonymsCache = cacheLib.newCache({
    size: 1000,
    expire: 3600 * 24, // 1 day
});

const searchWithoutAggregationsCache = cacheLib.newCache({
    size: 1000,
    expire: 300,
});

const searchWithAggregationsCache = cacheLib.newCache({
    size: 1000,
    expire: 300,
});

const wipeSearchCache = () => {
    searchWithoutAggregationsCache.clear();
    searchWithAggregationsCache.clear();
};

const wipeAll = () => {
    prioritiesAndSynonymsCache.clear();
    wipeSearchCache();
};

export const getSearchWithoutAggregationsResult = (key, callback) => {
    return searchWithoutAggregationsCache.get(key, callback);
};

export const getSearchWithAggregationsResult = (key, callback) => {
    return searchWithAggregationsCache.get(key, callback);
};

export const getSynonymMap = () => {
    return prioritiesAndSynonymsCache.get('synonyms', () => {
        const synonymLists = contentLib.query({
            start: 0,
            count: 100,
            contentTypes: ['navno.nav.no.search:synonyms'],
        }).hits;

        const synonymMap = {};
        synonymLists.forEach((synonymList) => {
            synonymList.data.synonyms.forEach((s) => {
                s.synonym.forEach((word) => {
                    // add all if its a new word
                    if (!synonymMap[word]) {
                        synonymMap[word] = [].concat(s.synonym);
                    } else {
                        // only add new unique words if it already exists
                        s.synonym.forEach((syn) => {
                            if (
                                syn !== word &&
                                synonymMap[word].indexOf(syn) === -1
                            ) {
                                synonymMap[word].push(syn);
                            }
                        });
                    }
                });
            });
        });

        return synonymMap;
    });
};

export const getPriorities = () => {
    return prioritiesAndSynonymsCache.get('priorities', () => {
        let priority = [];
        let start = 0;
        let count = 1000;
        while (count === 1000) {
            const q = contentLib.query({
                start: start,
                count: 1000,
                contentTypes: [
                    'navno.nav.no.search:search-priority',
                    'navno.nav.no.search:search-api2',
                ],
                query: '_parentpath LIKE "/content/www.nav.no/prioriterte-elementer*" OR _parentpath LIKE "/content/www.nav.no/prioriterte-elementer-eksternt*"',
            });

            start += 1000;
            count = q.count;
            priority = priority.concat(
                q.hits.map((el) => {
                    return el._id;
                })
            );
        }
        return priority;
    });
};

let isActive = false;

export const activateEventListener = () => {
    wipeAll();

    const searchConfig = getConfig();
    if (!searchConfig) {
        logger.critical(
            `No search config found - could not activate event handlers!`
        );
        return;
    }

    isActive = true;

    const searchConfigId = searchConfig._id;

    eventLib.listener({
        type: '(node.pushed|node.deleted)',
        localOnly: false,
        callback: (event) => {
            runInContext(
                {
                    repository: 'com.enonic.cms.default',
                    branch: 'master',
                    asAdmin: true,
                },
                () => {
                    // wipe all on delete because we can't check the type of the deleted content
                    if (event.type === 'node.deleted') {
                        wipeAll();
                        return;
                    }

                    wipeSearchCache();

                    event.data.nodes.forEach((node) => {
                        if (
                            node.repo !== contentRepo ||
                            node.branch !== 'master'
                        ) {
                            return;
                        }

                        if (node.id === searchConfigId) {
                            revalidateSearchConfigCache();
                            return;
                        }

                        const content = contentLib.get({
                            key: node.id,
                        });

                        // wipe all if the content doesn't exist, just in case
                        if (!content || typesToClear[content.type]) {
                            wipeAll();
                        }
                    });
                }
            );
        },
    });
};
