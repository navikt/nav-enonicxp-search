import cacheLib from '/lib/cache';
import eventLib from '/lib/xp/event';
import contentLib from '/lib/xp/content';
import { runInContext } from '../../utils/context';
import { contentRepo } from '../../constants';
import { getConfig, revalidateSearchConfigCache } from './config';
import { logger } from '../../utils/logger';

const standardCache = {
    size: 1000,
    expire: 3600 * 24 /* One day */,
};

let emptySearchKeys = [];
const cache = cacheLib.newCache(standardCache);

const typesToClear = {
    [app.name + ':search-priority']: true,
    [app.name + ':search-api2']: true,
    [app.name + ':synonyms']: true,
};

const wipeAll = () => {
    cache.clear();
};

export const getEmptySearchResult = (key, fallback) => {
    emptySearchKeys.push(key);
    return cache.get(key, fallback);
};

export const getSynonymMap = () => {
    return cache.get('synonyms', () => {
        const synonymLists = contentLib.query({
            start: 0,
            count: 100,
            query: 'type = "' + app.name + ':synonyms"',
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
    return cache.get('priorites', () => {
        let priority = [];
        let start = 0;
        let count = 1000;
        while (count === 1000) {
            const q = contentLib.query({
                start: start,
                count: 1000,
                query: `(_parentpath LIKE "*prioriterte-elementer*" OR _parentpath LIKE "*prioriterte-elementer-eksternt*") AND
                        (type = "navno.nav.no.search:search-priority" OR type = "navno.nav.no.search:search-api2")`,
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
                    // clear aggregation cache
                    cache.remove('emptyaggs');
                    // clear other empty search caches
                    emptySearchKeys.forEach((key) => {
                        cache.remove(key);
                    });
                    emptySearchKeys = [];

                    // wipe all on delete because we can't check the type of the deleted content
                    if (event.type === 'node.deleted') {
                        wipeAll();
                        return;
                    }

                    // clear full cache if prioritized items or synonyms have changed
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
