import { sanitize } from '/lib/xp/common';
import { getSynonymMap } from '../helpers/cache';
import {
    formatExactSearch,
    isExactSearch,
    isFormSearch,
} from '../helpers/utils';

const fuzzinessPerChar = 1 / 5;

const getSuggestions = (words) => {
    const suggest = __.newBean('no.nav.search.elastic.Suggest');
    suggest.texts = __.nullOrValue(words);
    return __.toNativeObject(suggest.suggest());
};

const getSynonyms = (words, synonymMap) => {
    return words.reduce((acc, word) => {
        const synonyms = synonymMap[word];
        return synonyms
            ? [...acc, ...synonyms.map((synonym) => `"${synonym}"`)]
            : acc;
    }, []);
};

const getInitialWords = (inputWord, queryString) => [
    // Use fuzzy search on user input to handle misspellings etc
    `${inputWord}~${Math.ceil(fuzzinessPerChar * inputWord.length)}`,
    // Make the last user-submitted word a prefix query to give results on incomplete words
    ...(queryString.endsWith(inputWord) ? [`${inputWord}*`] : []),
];

const getWordsMap = (queryString) => {
    const synonymMap = getSynonymMap();
    const analyze = __.newBean('no.nav.search.elastic.Analyze');
    analyze.text = __.nullOrValue(queryString);

    // Use the nb_NO analyzer to remove stop words and find stemmed version of the words
    const wordsAnalyzedMap = __.toNativeObject(analyze.analyze()).reduce(
        (acc, token) => {
            const { startOffset, endOffset, term } = token;

            const userInputWord = queryString.substring(startOffset, endOffset);

            const prevWords =
                acc[userInputWord] ||
                getInitialWords(userInputWord, queryString);

            if (!prevWords.includes(term)) {
                return { ...acc, [userInputWord]: [...prevWords, term] };
            }

            if (!acc[userInputWord]) {
                return { ...acc, [userInputWord]: prevWords };
            }

            return acc;
        },
        {}
    );

    return Object.keys(wordsAnalyzedMap).reduce((acc, keyWord) => {
        const words = wordsAnalyzedMap[keyWord];

        const suggestions = getSuggestions(words);
        const synonyms = getSynonyms(words, synonymMap);

        const uniqueWords = [...words, ...suggestions, ...synonyms].filter(
            (word, index, array) => array.indexOf(word) === index
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

// The query string should should have OR logic within each word from the user and its synonyms and suggestions
// and AND logic between each such group of words, ie (input1 | inputSynonym1) (input2 | inputSynonym2)
// (space between each group implies AND)
const buildFinalQueryString = (wordMap) => {
    return Object.keys(wordMap)
        .map((word) => `(${wordMap[word].join('|')})`)
        .join(' ');
};

export const generateSearchInput = (userInput) => {
    if (!userInput) {
        return { wordList: [], queryString: '' };
    }

    if (isFormSearch(userInput)) {
        return { wordList: [userInput], queryString: userInput };
    }

    const sanitizedTerm = sanitize(userInput);

    if (isExactSearch(userInput)) {
        const queryStringExact = formatExactSearch(sanitizedTerm);
        return { wordList: [queryStringExact], queryString: queryStringExact };
    }

    const wordsMap = getWordsMap(sanitizedTerm);

    return {
        wordList: getUniqueWords(wordsMap),
        queryString: buildFinalQueryString(wordsMap),
    };
};
