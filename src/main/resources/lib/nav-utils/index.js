var libs = {
    i18n: require('/lib/xp/i18n'),
    moment: require('/assets/momentjs/2.14.1/min/moment-with-locales.min.js'),
    repo: require('/lib/xp/repo'),
    node: require('/lib/xp/node'),
    context: require('/lib/xp/context')
};

exports.fixDateFormat = fixDateFormat;
/**
 * @description Date formats on content created in XP7 is not necessarily supported in the Date wrapper in XP7 (but it does work in browsers)
 * @param {string} date Date
 * @returns {string} Correctly formated date
 */
function fixDateFormat(date) {
    if (date.indexOf('.') !== -1) {
        date = date.split('.')[0] + 'Z';
    }
    return date;
}

exports.dateTimePublished = function(content, language) {
    if (!content) {
        return '';
    }
    const navPublished = libs.i18n.localize({
        key: 'main_article.published',
        locale: language
    });
    const p = fixDateFormat(content.publish.from ? content.publish.from : content.createdTime);
    const published = formatDate(p, language);
    const publishedString = `${navPublished} ${published}`;

    let modifiedString = '';
    const m = fixDateFormat(content.modifiedTime);
    if (new Date(m) > new Date(p)) {
        let navUpdated = libs.i18n.localize({
            key: 'main_article.lastChanged',
            locale: language
        });
        const lastModified = formatDate(content.modifiedTime, language);
        modifiedString = ` | ${navUpdated} ${lastModified}`;
    }
    return publishedString + modifiedString;
};

exports.formatDate = formatDate;
function formatDate(date, language) {
    // use nb(DD.MM.YYYY) for everything except for english content(MM/DD/YYYY)
    return libs
        .moment(date)
        .locale(language === 'en' ? 'en' : 'nb')
        .format('L');
}

exports.getNavRepo = getNavRepo;
function getNavRepo() {
    return libs.context.run(
        {
            repository: 'com.enonic.cms.default',
            branch: 'draft',
            user: {
                login: 'su',
                userStore: 'system'
            },
            principals: ['role:system.admin']
        },
        function() {
            const hasNavRepo = libs.repo.get('no.nav.navno');
            if (!hasNavRepo) {
                log.info('Create no.nav.navno repo');
                libs.repo.create({
                    id: 'no.nav.navno'
                });
            }

            const navRepo = libs.node.connect({
                repoId: 'no.nav.navno',
                branch: 'master',
                user: {
                    login: 'su'
                },
                pricipals: ['role:system.admin']
            });

            return navRepo;
        }
    );
}

exports.getFacetValidation = getFacetValidation;
function getFacetValidation() {
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
                justValidatedNodes: []
            }
        });
    }

    return facetValidation;
}

exports.setUpdateAll = setUpdateAll;
function setUpdateAll(updateAll) {
    getNavRepo().modify({
        key: getFacetValidation()._path,
        editor: function(facetValidation) {
            facetValidation.data.updateAll = updateAll;
            return facetValidation;
        }
    });
}

exports.isUpdatingAll = isUpdatingAll;
function isUpdatingAll() {
    return getFacetValidation().data.updateAll;
}

exports.addValidatedNodes = addValidatedNodes;
function addValidatedNodes(ids) {
    getNavRepo().modify({
        key: getFacetValidation()._path,
        editor: function(facetValidation) {
            let justValidatedNodes = facetValidation.data.justValidatedNodes
                ? Array.isArray(facetValidation.data.justValidatedNodes)
                    ? facetValidation.data.justValidatedNodes
                    : [facetValidation.data.justValidatedNodes]
                : [];
            justValidatedNodes = justValidatedNodes.concat(ids);
            facetValidation.data.justValidatedNodes = justValidatedNodes;
            return facetValidation;
        }
    });
}

exports.removeValidatedNodes = removeValidatedNodes;
function removeValidatedNodes(ids) {
    getNavRepo().modify({
        key: getFacetValidation()._path,
        editor: function(facetValidation) {
            const justValidatedNodes = facetValidation.data.justValidatedNodes
                ? Array.isArray(facetValidation.data.justValidatedNodes)
                    ? facetValidation.data.justValidatedNodes
                    : [facetValidation.data.justValidatedNodes]
                : [];
            ids.forEach(function(id) {
                justValidatedNodes.splice(justValidatedNodes.indexOf(id), 1);
            });
            facetValidation.data.justValidatedNodes = justValidatedNodes;
            return facetValidation;
        }
    });
}

exports.getJustValidatedNodes = getJustValidatedNodes;
function getJustValidatedNodes() {
    const facetValidation = getFacetValidation();
    const justValidatedNodes = facetValidation.data.justValidatedNodes
        ? Array.isArray(facetValidation.data.justValidatedNodes)
            ? facetValidation.data.justValidatedNodes
            : [facetValidation.data.justValidatedNodes]
        : [];
    return justValidatedNodes;
}
