import cacheLib from '/lib/cache';
import eventLib from '/lib/xp/event';
import contentLib from '/lib/xp/content';
import { contentRepo, searchRepo } from '../../constants';
import { getConfig, revalidateSearchConfigCache } from './config';
import { logger } from '../../utils/logger';

const synonymsContentType = 'navno.nav.no.search:synonyms';

const synonymsCache = cacheLib.newCache({
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
    synonymsCache.clear();
    wipeSearchCache();
};

export const getSearchWithoutAggregationsResult = (key, callback) => {
    return searchWithoutAggregationsCache.get(key, callback);
};

export const getSearchWithAggregationsResult = (key, callback) => {
    return searchWithAggregationsCache.get(key, callback);
};

export const getSynonymMap = () => {
    return synonymsCache.get('synonyms', () => {
        const synonymLists = contentLib.query({
            start: 0,
            count: 100,
            contentTypes: [synonymsContentType],
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
                    synonymsCache.clear();
                    return;
                }

                const content = contentLib.get({
                    key: node.id,
                });

                if (!content || content.type === synonymsContentType) {
                    synonymsCache.clear();
                }
            });
        },
    });
};
