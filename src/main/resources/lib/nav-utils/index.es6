/**
 * Make sure the content is an array.
 * @param {*} content Whatever is passed in
 * @returns {Object[]} Array containing the content or just content
 */
export const forceArray = (content) => {
    if (content) {
        return Array.isArray(content) ? content : [content];
    }
    return [];
};

export const getUnixTimeFromDateTimeString = (datetime) => {
    if (!datetime) {
        return 0;
    }

    const validDateTime = datetime.split('.')[0];
    return new Date(validDateTime).getTime();
};
