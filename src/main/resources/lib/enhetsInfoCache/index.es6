const MIN = 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const HOST = app.config.norg2 || 'https://app-q9.adeo.no/norg2/api/v1/';

const cacheLib = require('/lib/cache');
const http = require('/lib/http-client');

const endPoints = {
    alleEnheter: 'enhet',
    kontaktinformasjon: 'enhet/{0}/kontaktinformasjon',
    arbeidsfordeling: 'enhet/{0}/arbeidsfordeling',
    organisering: 'enhet/{0}/organisering',
    enhet: 'enhet/{0}',
    enhetsstatuser: 'enhet/kontaktinformasjon/organisering/{0}',
    alleOrganisering: 'enhet/kontakinformasjon/organisering/all',
    navKontorGeografiskOmraade: 'enhet/navkontor/{0}',
};

let cache;
let countyCache;

const parseEndpoints = (key, params) => {
    return endPoints[key].replace('{0}', params);
};

const safeParse = literal => {
    if (!literal) return false;
    return JSON.parse(literal);
};

const getCounty = postnr => {
    if (!countyCache)
        countyCache = cacheLib.newCache({
            size: 5000,
            expire: DAY * 30,
        });
    return countyCache.get(postnr, () => {
        const r = safeParse(
            http.request({
                url: 'http://ws.geonorge.no/AdresseWS/adresse/sok?sokestreng=' + postnr,
                method: 'GET',
            }).body
        );
        return r.adresser.reduce((t, el) => {
            return !t && el.postnr === postnr ? el.kommunenr : t;
        });
    });
};

const get = (key, params) => {
    if (!cache)
        cache = cacheLib.newCache({
            size: 500,
            expire: HOUR,
        });
    const endpoint = parseEndpoints(key, params);

    if (key === 'kontaktinformasjon')
        return safeParse(
            http.request({
                url: HOST + endpoint,
                method: 'GET',
            }).body
        );

    return cache.get(endpoint, () => {
        return safeParse(
            http.request({
                url: HOST + endpoint,
                method: 'GET',
            }).body
        );
    });
};

module.exports = {
    get,
    getCounty,
};
