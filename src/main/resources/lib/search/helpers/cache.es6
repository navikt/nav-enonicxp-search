import cacheLib from '/lib/cache';
import eventLib from '/lib/xp/event';
import contentLib from '/lib/xp/content';
import { contentRepo, searchRepo } from '../../constants';
import { getConfig, revalidateSearchConfigCache } from './config';
import { logger } from '../../utils/logger';

const prioritiesAndSynonymsTypes = {
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
    expire: 300, // 5 min
});

const searchWithAggregationsCache = cacheLib.newCache({
    size: 1000,
    expire: 300, // 5 min
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

    eventLib.listener({
        // We only have a single branch (master) in the search repo, so we listen to created/updated
        // for cache invalidation on this repo
        type: '(node.pushed|node.deleted|node.created|node.updated)',
        localOnly: false,
        callback: (event) => {
            event.data.nodes.forEach((node) => {
                if (node.branch !== 'master') {
                    return;
                }

                if (node.repo === searchRepo) {
                    wipeSearchCache();
                    return;
                }

                if (
                    node.repo !== contentRepo ||
                    event.type === 'node.created' ||
                    event.type === 'node.updated'
                ) {
                    return;
                }

                if (node.id === searchConfig._id) {
                    revalidateSearchConfigCache();
                    return;
                }

                // Wipe on delete because we can't check the type of the deleted content
                if (event.type === 'node.deleted') {
                    prioritiesAndSynonymsCache.clear();
                    return;
                }

                const content = contentLib.get({
                    key: node.id,
                });

                if (!content || prioritiesAndSynonymsTypes[content.type]) {
                    prioritiesAndSynonymsCache.clear();
                }
            });
        },
    });
};
