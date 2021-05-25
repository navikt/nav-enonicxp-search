import { getSynonyms } from '../helpers/cache';
/*
    ---------------- 1.1 Extract and optimize search words --------------
    1. Use the nb_NO analyzer to remove stop words and find the stemmed version of the word
    2. From the analyzed version, split the words and see if there is any misspellings and add the correct spelled word
       to the search string
    3.
*/
export default function getSearchWords(queryWord) {
    const word = queryWord.replace(/æ/g, 'ae').replace(/ø/g, 'o');
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
    JSON.stringify(`Synonym-map: ${synonymMap}`);
    return wordList.reduce((list, key) => {
        if (key && synonymMap[key]) {
            JSON.stringify(`Synonym-key: ${key}`);
            synonymMap[key].forEach((synonym) => {
                if (list.indexOf(synonym) === -1) {
                    list.push(synonym);
                }
            });
        }
        return list;
    }, wordList);
}
