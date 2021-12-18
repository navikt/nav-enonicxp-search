import { getSynonymMap } from '../helpers/cache';
import { formatExactSearch, isExactSearch, isSchemaSearch } from '../helpers/utils';

/*
    ---------------- 1.1 Extract and optimize search words --------------
    1. Use the nb_NO analyzer to remove stop words and find the stemmed version of the word
    2. From the analyzed version, split the words and see if there is any misspellings and add the correct spelled word
       to the search string
*/

const getSuggestions = (words) => {
    const suggest = __.newBean('no.nav.search.elastic.Suggest');
    suggest.texts = __.nullOrValue(words);
    return __.toNativeObject(suggest.suggest());
};

const getSynonyms = (words, synonymMap) => {
    return words.reduce((acc, word) => {
        const synonyms = synonymMap[word];
        return synonyms ? [...acc, ...synonyms.map((synonym) => `"${synonym}"`)] : acc;
    }, []);
};

const getWordsMap = (queryString) => {
    const synonymMap = getSynonymMap();
    const analyze = __.newBean('no.nav.search.elastic.Analyze');
    analyze.text = __.nullOrValue(queryString);

    const wordsAnalyzedMap = __.toNativeObject(analyze.analyze()).reduce((acc, token) => {
        const { startOffset, endOffset, term } = token;

        const originalWord = queryString.substring(startOffset, endOffset);
        const prevWords = acc[originalWord] || [originalWord];

        if (prevWords.indexOf(term) === -1) {
            return { ...acc, [originalWord]: [...prevWords, term] };
        }

        if (!acc[originalWord]) {
            return { ...acc, [originalWord]: prevWords };
        }

        return acc;
    }, {});

    return Object.keys(wordsAnalyzedMap).reduce((acc, keyWord) => {
        const words = wordsAnalyzedMap[keyWord];

        const suggestions = getSuggestions(words);
        const synonyms = getSynonyms(words, synonymMap);

        const uniqueWords = [...words, ...suggestions, ...synonyms].filter(
            (word2, index, array) => array.indexOf(word2) === index
        );

        return {
            ...acc,
            [keyWord]: uniqueWords,
        };
    }, {});
};

const getUniqueWords = (wordMap) =>
    Object.keys(wordMap)
        .reduce((acc, key) => [...acc, ...wordMap[key]], [])
        .filter((word, index, array) => array.indexOf(word) === index);

const buildFinalQueryString = (wordMap) => {
    return Object.keys(wordMap)
        .map((word) => {
            const words = wordMap[word];

            return `(${words.join('|')})`;
        })
        .join(' ');
};

const generateSearchTerms = (queryString) => {
    const queryTrimmed = queryString.trim();

    if (!queryTrimmed) {
        return { wordList: [], queryString: '' };
    }

    if (isSchemaSearch(queryTrimmed)) {
        return { wordList: [queryTrimmed], queryString: queryTrimmed };
    }

    if (isExactSearch(queryTrimmed)) {
        const queryStringExact = formatExactSearch(queryTrimmed);
        return { wordList: [queryStringExact], queryString: queryStringExact };
    }

    const queryCleaned = queryTrimmed.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o');

    const wordsMap = getWordsMap(queryCleaned);

    log.info(`Words map for query: ${JSON.stringify(wordsMap)}`);

    return { wordList: getUniqueWords(wordsMap), queryString: buildFinalQueryString(wordsMap) };
};

module.exports = {
    generateSearchTerms,
};
