import { getContentRepoConnection } from '../../utils/repo';
import { forceArray } from '../../utils';
import { logger } from '../../utils/logger';

const CONTENT_TYPE_PREFIX = 'no.nav.navno';

export const calculateHighlightText = (highLight) => {
    if (highLight.ingress.highlighted) {
        return highLight.ingress.text;
    }
    if (highLight.text.highlighted) {
        return highLight.text.text;
    }
    if (highLight.ingress.text) {
        return highLight.ingress.text;
    }
    if (highLight.text.text) {
        return highLight.text.text;
    }
    return '';
};

export const shouldHideModifiedDate = (hit) => {
    return [
        `${CONTENT_TYPE_PREFIX}:overview`,
        `${CONTENT_TYPE_PREFIX}:forms-overview`,
    ].includes(hit.type);
};

export const shouldHidePublishDate = (hit) => {
    return [
        `${CONTENT_TYPE_PREFIX}:situation-page`,
        `${CONTENT_TYPE_PREFIX}:office-branch`,
        `${CONTENT_TYPE_PREFIX}:guide-page`,
        `${CONTENT_TYPE_PREFIX}:generic-page`,
        `${CONTENT_TYPE_PREFIX}:themed-article-page`,
        `${CONTENT_TYPE_PREFIX}:content-page-with-sidemenus`,
        `${CONTENT_TYPE_PREFIX}:tools-page`,
        `${CONTENT_TYPE_PREFIX}:overview`,
        `${CONTENT_TYPE_PREFIX}:forms-overview`,
    ].includes(hit.type);
};

/*
  -------- 'substring' substitute -----------
  This function make sure that a word is not cut in the middle
  It subtracts or/and add the length of the substring method
*/
const substreng = (text, start, stopp) => {
    let trueStart = start >= 0 ? start : text.length + start;
    let trueStop = stopp;
    let tstopc = text.charAt(trueStop);
    let tc = text.charAt(trueStart);
    while (tc && tc !== ' ') {
        trueStart--;
        tc = text.charAt(trueStart);
    }
    while (tstopc !== ' ' && trueStop < text.length) {
        trueStop++;
        tstopc = text.charAt(trueStop);
    }
    return start >= 0
        ? text.substring(trueStart, trueStop)
        : text.substring(trueStart);
};

const removeHTMLTags = (text) => {
    return text.replace(/<\/?[^>]+(>|$)/g, '');
};

const removeMacros = (text) => {
    return text.replace(/ *\[[^\]]*]/g, '');
};
/*
  Find the match from any word character + word + any word character and surround the hits with <b> tag
*/
const addBoldTag = (word, text) => {
    return text.replace(new RegExp('\\w*' + word + '\\w*', 'gi'), (e) => {
        return '<b>' + e + '</b>';
    });
};

/*
  ---------------- Algorithm for finding and highlighting a text fragment ---------------
  11.2.1. Remove any HTML tags with attributes, except the bold tags. The bold tags indicates earlier highlights
  11.2.2. Test the text for the word that should be highlighted and surround the whole word with a <b>tag
  11.2.3. Find the index of the word in text
  11.2.4. If there is no occurrence of the word in text, return false
  11.2.5. Do a check where the index of the word is in the text, if it exceed 200 of length add a trailing (...)
  TODO multiple (...) is added for multiparsed highlights
*/
const findSubstring = (word, text) => {
    const replaceText = addBoldTag(word, text); // 11.2.2.
    const index = text.indexOf(word); // 11.2.3.
    if (index === -1) return false; // 11.2.4.
    if (index < 100) {
        // 11.2.5.
        return text.length > 200
            ? substreng(replaceText, 0, 200) + ' (...)'
            : replaceText;
    }
    if (index > text.length - 100) {
        return text.length > 200
            ? substreng(replaceText, -200) + ' (...)'
            : replaceText;
    }
    return text.length > 200
        ? substreng(replaceText, index - 100, index + 100) + ' (...)'
        : replaceText;
};

/*
  -------------- Algorithm for highlighting ---------------
  11.1. Take the text and split the search words for highlighting
  11.2. Find first occurrence of a word in text
  11.3. If there is an occurrence of a word in text, do the rest of the highlighting from that fragment of text
  11.4. Return a highlighted fragment of text or false
*/
const highLightFragment = (searchText, wordList) => {
    let text = removeHTMLTags(searchText);
    text = removeMacros(text);
    const highligthedText = wordList.reduce((t, word) => {
        let currentText = t;
        if (word.length < 2) {
            return currentText;
        }
        // 11.2
        if (!currentText) {
            currentText = findSubstring(word, text);
        } else {
            const res = findSubstring(word, currentText); // 11.3
            currentText = res || currentText;
        }
        return currentText; // 11.4
    }, false);

    if (highligthedText) {
        return {
            highlighted: true,
            text: highligthedText,
        };
    }

    if (text) {
        text = text.length > 200 ? text.substring(0, 200) + ' (...)' : text;
    }
    return {
        highlighted: false,
        text: text || '',
    };
};

export const getHighLight = (searchNode, wordList) => {
    if (searchNode.type === 'media:document') {
        const media = getContentRepoConnection().get(searchNode.contentId);
        if (media && media.attachment) {
            return {
                text: highLightFragment(media.attachment.text || '', wordList),
                ingress: highLightFragment('', wordList),
            };
        }
    }

    return {
        text: highLightFragment(searchNode.data.text || '', wordList),
        ingress: highLightFragment(
            searchNode.data.ingress || searchNode.data.description || '',
            wordList
        ),
    };
};

const pathSegmentToAudience = {
    person: 'person',
    samegiella: 'person',
    'work-and-stay-in-norway': 'person',
    'benefits-and-services': 'person',
    'rules-and-regulations': 'person',
    bedrift: 'employer',
    arbeidsgiver: 'employer',
    employers: 'employer',
    samarbeidspartner: 'provider',
    samarbeid: 'provider',
};

export const getAudienceForHit = (hit) => {
    if (hit.data?.audience) {
        return typeof hit.data.audience === 'string'
            ? hit.data.audience
            : hit.data.audience._selected;
    }

    if (!hit.href) {
        return null;
    }

    const pathSegments = hit.href
        .replace(/^https?:\/\/[a-zA-Z0-9-.]+\//, '')
        .split('/');

    for (const segment of pathSegments) {
        const audience = pathSegmentToAudience[segment];
        if (audience) {
            return audience;
        }
    }

    return null;
};

const getAudienceReception = (hit) => {
    // Need to cater to both new and old office structure from NORG
    const besoeksadresse =
        hit.data.brukerkontakt?.publikumsmottak?.besoeksadresse ||
        hit.data.kontaktinformasjon?.publikumsmottak?.besoeksadresse;

    if (besoeksadresse?.type !== 'stedsadresse') {
        return null;
    }

    const { postnummer, poststed, gatenavn, husnummer } = besoeksadresse;
    const base = [gatenavn, husnummer, postnummer, poststed].filter(
        (item) => item !== undefined
    );

    const post = base.slice(Math.max(base.length - 2, 0)).join(' ');
    const address = base.slice(0, base.length - 2).join(' ');

    return `${address}, ${post}`;
};

const getPhone = (hit) =>
    hit.data.kontaktinformasjon?.telefonnummer || '55 55 33 33';

const getOfficeInformation = (hit) => {
    if (
        (hit.type === 'no.nav.navno:office-information' &&
            hit.data.enhet.type !== 'LOKAL') ||
        hit.type === 'no.nav.navno:office-branch'
    ) {
        return {
            phone: getPhone(hit),
            audienceReception: getAudienceReception(hit),
        };
    }
};

const getHref = (hit) => {
    if (hit.type !== 'no.nav.navno:form-details') {
        return hit.href;
    }

    const application = forceArray(hit.data?.formType).find(
        (formType) => formType._selected === 'application'
    );
    if (!application) {
        logger.info(`Application not found for ${hit.contentPath}`);
        return null;
    }

    const variation = forceArray(application.variations)[0];
    if (!variation) {
        logger.info(`Variation not found for ${hit.contentPath}`);
        return null;
    }

    const selectedLink = variation.link?._selected;
    if (!selectedLink) {
        logger.info(`Link selection not found for ${hit.contentPath}`);
        return null;
    }

    if (selectedLink === 'external') {
        return variation.link.external?.url;
    }

    const targetContentId = variation.link.internal?.target;
    if (!targetContentId) {
        logger.info(`targetContentId not found for ${hit.contentPath}`);
        return null;
    }

    const content = getContentRepoConnection().get(targetContentId);
    if (!content) {
        logger.info(`Content not found for ${hit.contentPath}`);
        return null;
    }

    const path =
        content.data.customPath ||
        content._path.replace(/^\/content\/www\.nav\.no/, '');

    return `https://www-2.ekstern.dev.nav.no${path}`;
};

const getDisplayName = (hit) => {
    const displayNameBase = hit.data?.title || hit.displayName;

    if (hit.type !== 'no.nav.navno:form-details') {
        return displayNameBase;
    }

    const formNumbers = forceArray(hit.data.formNumbers);
    if (formNumbers.length === 0) {
        return displayNameBase;
    }

    return `${displayNameBase} (${formNumbers.join(', ')})`;
};

export const createPreparedHit = (hit, wordList) => {
    const highLight = getHighLight(hit, wordList);
    const highlightText = calculateHighlightText(highLight);

    const href = getHref(hit);
    const displayName = getDisplayName(hit);

    return {
        displayName,
        href,
        highlight: highlightText,
        publish: hit.publish,
        createdTime: hit.createdTime,
        modifiedTime: hit.modifiedTime,
        score: hit._score,
        rawScore: hit._rawScore,
        officeInformation: getOfficeInformation(hit),
        audience: getAudienceForHit(hit),
        language: hit.language,
        hidePublishDate: shouldHidePublishDate(hit),
        hideModifiedDate: shouldHideModifiedDate(hit),
    };
};
