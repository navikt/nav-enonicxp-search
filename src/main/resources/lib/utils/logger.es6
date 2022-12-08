const logWithPrefix = (customLevel, msg) => {
    const level = customLevel === 'critical' ? 'error' : customLevel;
    log[level](`[${customLevel}][search] ${msg}`);
};

const logInfo = (msg) => {
    log.info(`[info] ${msg}`);
};

const logWarning = (msg) => {
    logWithPrefix('warning', msg);
};

const logError = (msg) => {
    logWithPrefix('error', msg);
};

const logCriticalError = (msg) => {
    logWithPrefix('critical');
};

export const logger = {
    info: logInfo,
    warning: logWarning,
    error: logError,
    critical: logCriticalError,
};
