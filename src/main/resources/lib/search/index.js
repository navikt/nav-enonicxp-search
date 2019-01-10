var content = require('/lib/xp/content');
var U = require('./searchUtils');

module.exports = {
    hits: search
};


function search(word, l) {
    if (!word) return [];
    word = U.addLevenstein(U.removeStopWords(word, l).join(" "));


    var priorities = U.priorityReducerComposedWithHitsView(content.query(U.priorityQuery));
    var reducer = U.reducerPrimer(U.setPriorityPrimer(U.hasPriorityPrimer(priorities)));
    var primeLevenstein = U.computeLevensteinDistance(word);
    var primeContentWithWord = U.injectWordToContent(word);
    var primedAllQuery = primeContentWithWord(U.allQuery);
    var primedApiQuery = primeContentWithWord(U.apiQuery);

    var primedApiMap = U.apiMap(word);

    var all = U.concater([
        U.mapHitsViewWithMap(primedAllQuery,U.allQueryMap(primeLevenstein)),
        U.mapHitsViewWithMap(primedApiQuery ,U.dataHost),
        U.mapHitsViewWithMap(content.query(U.indexedApi), primedApiMap).reduce(function (t, el) {
            if (el) t.push(el);
            return t;
        }, [])
    ]);

    var reducedAll = reducer(all);

    return U.prioritySort(reducedAll);
}
