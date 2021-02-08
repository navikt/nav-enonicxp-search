const excludePaths = ['/content/www.nav.no/no/nav-og-samfunn/samarbeid/noindex/*'];

const getPathFilter = () => {
    return excludePaths.reduce((acc, path) => {
        return `${acc} AND _path NOT LIKE "${path}"`;
    }, '');
};

export default getPathFilter;
