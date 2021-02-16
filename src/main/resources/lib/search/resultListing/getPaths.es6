import { attachmentUrl, pageUrl } from '/lib/xp/portal';

/*
     ----------- Get the url from the element ---------
     If it is a service or application, return the given url or host
     else do a portal lookup and return the url
 */
export default function getPaths(el) {
    const paths = {
        href: '',
        displayPath: '',
    };
    // find href for prioritised items
    if (
        el.type === app.name + ':search-api' ||
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
    } else {
        // href for everything else
        paths.href = pageUrl({
            id: el._id,
            type: 'absolute'
        });
    }

    // find display path for media/files
    if (
        el.type === 'media:document' ||
        el.type === 'media:spreadsheet' ||
        el.type === 'media:image'
    ) {
        paths.displayPath = pageUrl({ id: el._id }).split('/').slice(0, -1).join('/');
    } else if (paths.href.indexOf('http') === 0) {
        // find display path for absolute urls
        if (paths.href.indexOf('https://www.nav.no/') === 0) {
            paths.displayPath = paths.href.replace('https://www.nav.no/', '/');
        } else {
            paths.displayPath = paths.href;
        }
    } else {
        // display path for everything else
        paths.displayPath = paths.href.split('/').slice(0, -1).join('/');
    }

    return paths;
}
