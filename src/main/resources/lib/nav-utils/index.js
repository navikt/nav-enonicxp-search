var libs = {
    i18n: require('/lib/xp/i18n'),
    moment: require('/assets/momentjs/2.14.1/min/moment-with-locales.min.js'),
};

exports.fixDateFormat = fixDateFormat;
/**
 * @description Date formats on content created in XP7 is not necessarily supported in the Date wrapper in XP7 (but it does work in browsers)
 * @param {string} date Date
 * @returns {string} Correctly formated date
 */
function fixDateFormat (date) {
    if (date.indexOf('.') !== -1) {
        date = date.split('.')[0] + 'Z';
    }
    return date;
}

exports.dateTimePublished = function (content, language) {
    if (!content) { return ''; }
    const navPublished = libs.i18n.localize({
        key: 'main_article.published', locale: language,
    });
    const p = fixDateFormat(content.publish.from ? content.publish.from : content.createdTime);
    const published = formatDate(p, language);
    const publishedString = `${navPublished} ${published}`;

    let modifiedString = '';
    const m = fixDateFormat(content.modifiedTime);
    if (new Date(m) > new Date(p)) {
        let navUpdated = libs.i18n.localize({
            key: 'main_article.lastChanged', locale: language,
        });
        const lastModified = formatDate(content.modifiedTime, language);
        modifiedString = ` | ${navUpdated} ${lastModified}`;
    }
    return publishedString + modifiedString;
};

exports.formatDate = formatDate;
function formatDate (date, language) {
    // use nb(DD.MM.YYYY) for everything except for english content(MM/DD/YYYY)
    return libs.moment(date).locale(language === 'en' ? 'en' : 'nb').format('L');
};