import { getSynonyms } from '../helpers/cache';
import { isSchemaSearch } from '../helpers/utils';
/*
    ---------------- 1.1 Extract and optimize search words --------------
    1. Use the nb_NO analyzer to remove stop words and find the stemmed version of the word
    2. From the analyzed version, split the words and see if there is any misspellings and add the correct spelled word
       to the search string
    3.
*/

const isExactSearch = (query) =>
    (query.startsWith('"') && query.endsWith('"')) || (query.startsWith('\'') && query.endsWith('\''));

const formatExactSearch = (query) => [`"${query.replace(/["']/g, '')}"`]

export default function getSearchWords(query) {
    const queryTrimmed = query.trim();

    if (!queryTrimmed) {
        return [];
    }

    if (isSchemaSearch(queryTrimmed)) {
        return [query];
    }

    if (isExactSearch(queryTrimmed)) {
        return formatExactSearch(queryTrimmed);
    }

    const word = queryTrimmed.replace(/æ/g, 'ae').replace(/ø/g, 'o');
    // run analyzer to remove stopwords
    const analyze = __.newBean('no.nav.search.elastic.Analyze');
    analyze.text = __.nullOrValue(word);
    const wordList = __.toNativeObject(analyze.analyze()).reduce((t, token) => {
        // only keep unique words from the analyzer
        if (t.indexOf(token.term) === -1) {
            t.push(token.term);
        }
        const oldWord = word.substring(token.startOffset, token.endOffset);
        if (t.indexOf(oldWord) === -1) {
            t.push(oldWord);
        }
        return t;
    }, []);

    // get suggestions
    const suggest = __.newBean('no.nav.search.elastic.Suggest');
    suggest.texts = __.nullOrValue(wordList);
    __.toNativeObject(suggest.suggest()).forEach((suggestion) => {
        if (wordList.indexOf(suggestion) === -1) {
            wordList.push(suggestion);
        }
    });

    // synonyms
    const synonymMap = getSynonyms();
    return wordList.reduce((list, key) => {
        if (synonymMap[key]) {
            synonymMap[key].forEach((synonym) => {
                if (list.indexOf(synonym) === -1) {
                    list.push(synonym);
                }
            });
        }
        return list;
    }, wordList);
}
