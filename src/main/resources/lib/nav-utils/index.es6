const libs = {
    i18n: require('/lib/xp/i18n'),
    moment: require('/assets/momentjs/2.24.0/min/moment-with-locales.min.js'),
    repo: require('/lib/xp/repo'),
    node: require('/lib/xp/node'),
    context: require('/lib/xp/context'),
};

/**
 * @description Date formats on content created in XP7 is not necessarily supported in the Date wrapper in XP7 (but it does work in browsers)
 * @param {string} date Date
 * @returns {string} Correctly formated date
 */
const fixDateFormat = (date) => {
    return date.indexOf('.') !== -1 ? date.split('.')[0] + 'Z' : date;
};

/**
 * Make sure the content is an array.
 * @param {*} content Whatever is passed in
 * @returns {Object[]} Array containing the content or just content
 */
const forceArray = (content) => {
    if (content) {
        return Array.isArray(content) ? content : [content];
    }
    return [];
};

const formatDate = (date, language) => {
    // use nb(DD.MM.YYYY) for everything except for english content(MM/DD/YYYY)
    return libs
        .moment(date)
        .locale(language === 'en' ? 'en' : 'nb')
        .format('L');
};

const dateTimePublished = (content, language) => {
    if (!content) {
        return '';
    }
    const navPublished = libs.i18n.localize({
        key: 'main_article.published',
        locale: language,
    });
    const p = fixDateFormat(content.publish.from ? content.publish.from : content.createdTime);
    const published = formatDate(p, language);
    const publishedString = `${navPublished} ${published}`;

    let modifiedString = '';
    const m = fixDateFormat(content.modifiedTime);
    if (new Date(m) > new Date(p)) {
        const navUpdated = libs.i18n.localize({
            key: 'main_article.lastChanged',
            locale: language,
        });
        const lastModified = formatDate(content.modifiedTime, language);
        modifiedString = ` | ${navUpdated} ${lastModified}`;
    }
    return publishedString + modifiedString;
};

const getNavRepo = () => {
    return libs.context.run(
        {
            repository: 'com.enonic.cms.default',
            branch: 'draft',
            user: {
                login: 'su',
                userStore: 'system',
            },
            principals: ['role:system.admin'],
        },
        () => {
            const hasNavRepo = libs.repo.get('no.nav.navno');
            if (!hasNavRepo) {
                log.info('Create no.nav.navno repo');
                libs.repo.create({
                    id: 'no.nav.navno',
                });
            }

            const navRepo = libs.node.connect({
                repoId: 'no.nav.navno',
                branch: 'master',
                user: {
                    login: 'su',
                },
                pricipals: ['role:system.admin'],
            });

            return navRepo;
        }
    );
};

const getFacetValidation = () => {
    const navRepo = getNavRepo();
    let facetValidation = navRepo.get('/facetValidation');
    if (!facetValidation) {
        log.info('Create facet validation node');
        facetValidation = navRepo.create({
            _name: 'facetValidation',
            parentPath: '/',
            refresh: true,
            data: {
                updateAll: false,
                justValidatedNodes: [],
            },
        });
    }

    return facetValidation;
};

const setUpdateAll = (updateAll) => {
    getNavRepo().modify({
        key: getFacetValidation()._path,
        editor: (facetValidation) => {
            return { ...facetValidation, data: { ...facetValidation.data, updateAll: updateAll } };
        },
    });
};

const isUpdatingAll = () => {
    return getFacetValidation().data.updateAll;
};

const addValidatedNodes = (ids) => {
    getNavRepo().modify({
        key: getFacetValidation()._path,
        editor: (facetValidation) => {
            let justValidatedNodes = [];
            if (facetValidation.data.justValidatedNodes) {
                justValidatedNodes = forceArray(facetValidation.data.justValidatedNodes);
            }
            justValidatedNodes = justValidatedNodes.concat(ids);
            return { ...facetValidation, data: { ...facetValidation.data, justValidatedNodes } };
        },
    });
};

const removeValidatedNodes = (ids) => {
    getNavRepo().modify({
        key: getFacetValidation()._path,
        editor: (facetValidation) => {
            let justValidatedNodes = [];
            if (facetValidation.data.justValidatedNodes) {
                justValidatedNodes = forceArray(facetValidation.data.justValidatedNodes);
            }
            ids.forEach((id) => {
                justValidatedNodes.splice(justValidatedNodes.indexOf(id), 1);
            });
            return { ...facetValidation, data: { ...facetValidation.data, justValidatedNodes } };
        },
    });
};

const getJustValidatedNodes = () => {
    const facetValidation = getFacetValidation();
    return facetValidation.data.justValidatedNodes
        ? forceArray(facetValidation.data.justValidatedNodes)
        : [];
};

module.exports = {
    fixDateFormat,
    formatDate,
    getJustValidatedNodes,
    removeValidatedNodes,
    addValidatedNodes,
    isUpdatingAll,
    setUpdateAll,
    getNavRepo,
    getFacetValidation,
    forceArray,
    dateTimePublished,
};
