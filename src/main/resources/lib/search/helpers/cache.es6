import cacheLib from '/lib/cache';
import eventLib from '/lib/xp/event';
import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';

const standardCache = {
    size: 1000,
    expire: 3600 * 24 /* One day */,
};

let emptySearchKeys = [];
const cache = cacheLib.newCache(standardCache);

const wipeAll = () => {
    cache.clear();
};

const getEmptySearchResult = (key, fallback) => {
    emptySearchKeys.push(key);
    return cache.get(key, fallback);
};

const getSynonymMap = () => {
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

const getPriorities = () => {
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

const activateEventListener = () => {
    wipeAll();
    eventLib.listener({
        type: 'node.*',
        localOnly: false,
        callback: (event) => {
            contextLib.run(
                {
                    repository: 'com.enonic.cms.default',
                    branch: 'master',
                    user: {
                        login: 'su',
                        userStore: 'system',
                    },
                    principals: ['role:system.admin'],
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
                    } else {
                        // clear full cache if prioritized items or synonyms have changed
                        event.data.nodes.forEach((node) => {
                            if (
                                node.branch === 'master' &&
                                node.repo === 'com.enonic.cms.default'
                            ) {
                                const content = contentLib.get({
                                    key: node.id,
                                });
                                if (content) {
                                    const typesToClear = [
                                        app.name + ':search-priority',
                                        app.name + ':search-api2',
                                        app.name + ':synonyms',
                                    ];
                                    if (
                                        typesToClear.indexOf(content.type) !==
                                        -1
                                    ) {
                                        wipeAll();
                                    }
                                } else {
                                    // wipe all if the content doesn't exist, just in case
                                    wipeAll();
                                }
                            }
                        });
                    }
                }
            );
        },
    });
};

export default {
    activateEventListener,
    getEmptySearchResult,
    getSynonymMap,
    getPriorities,
};
