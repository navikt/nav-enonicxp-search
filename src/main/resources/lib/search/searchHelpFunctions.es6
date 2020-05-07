import { get, query } from '/lib/xp/content';
import { getSynonyms } from './searchCache';

/*
    ---------------- 1.1 Extract and optimize search words --------------
    1. Use the nb_NO analyzer to remove stop words and find the stemmed version of the word
    2. From the analyzed version, split the words and see if there is any misspellings and add the correct spelled word
       to the search string
    3.
*/
export function getSearchWords(queryWord) {
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

export function getSearchPriorityContent(id) {
    const content = get({
        key: id,
    });

    if (content && content.type === 'no.nav.navno:internal-link') {
        return getSearchPriorityContent(content.data.target);
    }
    return content;
}

export function getCountAndStart({ start: startString = '0', count: countString = '20' }) {
    let count = countString ? parseInt(countString) || 0 : 0;
    count = count ? count * 20 : 20;

    let start = startString ? parseInt(startString) || 0 : 0;
    start *= 20;
    count -= start;
    return { start, count };
}

/*
    -------------- Map and reduce the facet configuration with the aggregated result ------------
    As the aggregated result don't show hits for buckets containing zero hits, we need to manually add them to the
    aggregation result as a bucket with docCount = 0
 */
export function mapReducer(buckets) {
    return (t, el) => {
        const match = buckets.reduce((t2, e) => {
            return t2 || (e.key === el.name.toLowerCase() ? e : t2);
        }, undefined);

        const docCount = match ? match.docCount : 0;
        const under =
            'underfasetter' in el
                ? (Array.isArray(el.underfasetter) ? el.underfasetter : [el.underfasetter]).reduce(
                      mapReducer(match ? match.underaggregeringer.buckets || [] : []),
                      []
                  )
                : [];
        t.push({
            key: el.name,
            docCount: docCount,
            underaggregeringer: { buckets: under },
        });
        return t;
    };
}

export function getAggregations(ESQuery, config) {
    log.info('GET AGGREGATIONS');
    log.info(JSON.stringify(ESQuery, null, 4));
    const resultSet = query(ESQuery);
    log.info(JSON.stringify(resultSet, null, 4));
    const agg = resultSet.aggregations;
    agg.fasetter.buckets = []
        .concat(config.data.fasetter)
        .reduce(mapReducer(agg.fasetter.buckets), []);
    return agg;
}

/*
    -------- Add the date range to query if selected ----------
 */
export function getDateRange(daterange, buckets) {
    const dateRangeValue = Number(daterange);
    if (!buckets || dateRangeValue.isNaN() || !buckets[dateRangeValue]) return '';
    let s = '';
    const e = buckets[dateRangeValue];
    if ('to' in e) {
        s += ' And modifiedTime < dateTime("' + e.to + '")';
    }
    if ('from' in e) {
        s += ' And modifiedTime > dateTime("' + e.from + '")';
    }
    return s;
}

const FASETTER_CONTENT_KEY = '/www.nav.no/fasetter';

export function getFalsettConfiguration() {
    return get({ key: FASETTER_CONTENT_KEY });
}
