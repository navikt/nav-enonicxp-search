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

export const recordToSet = (record) =>
    Object.values(record).reduce(
        (acc, value) => ({ ...acc, [value]: true }),
        {}
    );
