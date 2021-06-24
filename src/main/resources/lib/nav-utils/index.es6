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

module.exports = {
    forceArray,
};
