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

module.exports = {
    fixDateFormat,
    formatDate,
    forceArray,
    dateTimePublished,
};
