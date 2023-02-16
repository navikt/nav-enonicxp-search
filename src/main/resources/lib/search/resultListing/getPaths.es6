import { attachmentUrl, pageUrl } from '/lib/xp/portal';

/*
     ----------- Get the url from the element ---------
     If it is a service or application, return the given url or host
     else do a portal lookup and return the url
 */
export const getPaths = (el) => {
    const paths = {
        href: '',
        displayPath: '',
    };

    const customPath = el.data && el.data.customPath;

    if (
        el.type === app.name + ':search-api2' ||
        el.type === 'no.nav.navno:external-link'
    ) {
        paths.href = el.data.host || el.data.url;
        // href for media/files
    } else if (
        el.type === 'media:document' ||
        el.type === 'media:spreadsheet' ||
        el.type === 'media:image'
    ) {
        paths.href = attachmentUrl({
            id: el._id,
        });
    } else if (customPath) {
        paths.href = pageUrl({
            path: `/www.nav.no${customPath}`,
            type: 'absolute',
        });
    } else {
        paths.href = pageUrl({
            id: el._id,
            type: 'absolute',
        });
    }

    if (
        el.type === 'media:document' ||
        el.type === 'media:spreadsheet' ||
        el.type === 'media:image'
    ) {
        paths.displayPath = pageUrl({ id: el._id })
            .split('/')
            .slice(0, -1)
            .join('/');
    } else if (customPath) {
        paths.displayPath = customPath;
    } else if (paths.href.indexOf('http') === 0) {
        // find display path for absolute urls
        paths.displayPath = paths.href.replace(
            /^https:\/\/(www\.)?((dev|q6)\.)?nav\.no\//,
            '/'
        );
    } else {
        // display path for everything else
        paths.displayPath = paths.href.split('/').slice(0, -1).join('/');
    }

    return paths;
};
