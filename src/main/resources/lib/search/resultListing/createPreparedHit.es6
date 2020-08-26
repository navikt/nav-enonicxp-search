import navUtils from '/lib/nav-utils';
import getRepository from '../helpers/repo';
import getPaths from './getPaths';

/*
  -------- Coarse algorithm for setting class name to an result element -------
  1. Assume the classname is information, many prioritised elements dont have class names
  2. If it is a file, set it to be pdf
  TODO check what media file it is and set class name accordingly
  3. If it has been mapped with facets, set the classname attribute as its classname
*/
const getClassName = (el) => {
    let className = 'informasjon';
    if (el.type.startsWith('media')) {
        className = 'pdf';
    }
    if (el.x && el.x['no-nav-navno'] && el.x['no-nav-navno'].fasetter && !el.priority) {
        if (el.x['no-nav-navno'].fasetter.className) {
            className = el.x['no-nav-navno'].fasetter.className;
        } else if (el.x['no-nav-navno'].fasetter.fasett === 'Statistikk') {
            className = 'statistikk';
        }
    }
    return className;
};

export function calculateHighlightText(highLight) {
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
}

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
    return start >= 0 ? text.substring(trueStart, trueStop) : text.substring(trueStart);
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
        return text.length > 200 ? substreng(replaceText, 0, 200) + ' (...)' : replaceText;
    }
    if (index > text.length - 100) {
        return text.length > 200 ? substreng(replaceText, -200) + ' (...)' : replaceText;
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

export function getHighLight(el, wordList) {
    if (el.type === 'media:document') {
        const media = getRepository().get(el._id);
        if (media && media.attachment) {
            return {
                text: highLightFragment(media.attachment.text || '', wordList),
                ingress: highLightFragment('', wordList),
            };
        }
    }
    return {
        text: highLightFragment(el.data.text || '', wordList),
        ingress: highLightFragment(el.data.ingress || el.data.description || '', wordList),
    };
}

export default function createPreparedHit(hit, wordList) {
    // 11. Join the prioritised search with the result and map the contents with: highlighting,
    // href, displayName and so on

    const highLight = getHighLight(hit, wordList);
    const highlightText = calculateHighlightText(highLight);
    const paths = getPaths(hit);
    const href = paths.href;
    const displayPath = paths.displayPath;
    const className = getClassName(hit);
    let name = hit.displayName;

    let officeInformation;
    if (hit.type === 'no.nav.navno:office-information') {
        name = hit.data.enhet.navn ? hit.data.enhet.navn : hit.displayName;

        officeInformation = {
            phone:
                hit.data.kontaktinformasjon && hit.data.kontaktinformasjon.telefonnummer
                    ? hit.data.kontaktinformasjon.telefonnummer
                    : '',
            audienceReceptions:
                hit.data.kontaktinformasjon &&
                hit.data.kontaktinformasjon.publikumsmottak &&
                hit.data.kontaktinformasjon.publikumsmottak.length > 0
                    ? hit.data.kontaktinformasjon.publikumsmottak.map((a) => {
                          return a.besoeksadresse && a.besoeksadresse.poststed
                              ? a.besoeksadresse.poststed
                              : '';
                      })
                    : [],
        };
    }

    let publishedString = null;
    if (hit.type !== 'no.nav.navno:office-information') {
        publishedString = navUtils.dateTimePublished(hit, hit.language || 'no');
    }

    return {
        priority: !!hit.priority,
        displayName: name,
        href: href,
        displayPath: displayPath,
        highlight: highlightText,
        publish: hit.publish,
        modifiedTime: hit.modifiedTime,
        className: className,
        officeInformation: officeInformation,
        publishedString: publishedString,
    };
}
