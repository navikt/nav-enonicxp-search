(function(w) {
    w.addEventListener('load', handleOnLoad);
    const R = w.R;
    let resArr = [];
    let priorities = [];
    let stopwords = [];
    let res = document.getElementById('res');
    let facett = document.getElementById('facetts');
    let facetdiv = document.createElement('d');
    let ul = document.createElement('ul');
    const repi = (str) => (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = decodeURI(n[1]),this}.bind({}))[0];
    let query = repi();
    const size = 20;
    const start = 0;
    const LevensteinRange = 2;
    const o = {};
    let facettConfig = undefined;
    res.appendChild(ul);
    facett.appendChild(facetdiv);
    const typeArr = [
        'stopwords',
        'content',
        'app',
        'priorities',
        'exact',
        'ldPriorities',
        'facettconfig'
    ];

    /********* Support functions ***********/

    /**
     * Checks that a number is between 0 and the Levenstein range
     * @param n Number to check
     * @return {boolean}
     */
    const numberIsLessThanTwoAndNotZero = n => R.and(R.lte(n,LevensteinRange), R.not(R.equals(0,n)));

    /**
     * Sort function that sort on priority first, IOW content has been added to the priority list in content studio, then
     * sorts on the element with the lowest Levenstein value
     * @param {Array} Unsorted array
     * @return {Array} Sorted array
     */
    const sortOnPriorityAndLevensteinNumber = R.sort(a =>  a.pri ? -1 : findLowest(a).value);

    /**
     * Injects the elements in the passed array with a pri property whose value is true if its _id matches in the list
     * of prioritised elements
     * @param {Array} Injectible array
     * @return {Array} Array injected with priority property
     */
    const addPriority = R.map(R.assoc('pri',true));
    /**
     * The form of the search text comes with a lot of non-wordish characters not suitable for search. This function
     * strips the text of those characters. Typical characters is html tags, periods(.), commas(,), question marks(?), ...
     * @param {string} text
     * @return {string} Stripped string
     */
    const badStringReplacer = text => text ? R.replace(/<(?:[\/0-9a-zA-Z\s\\="\-:;+%&.#?()_]*)>|&nbsp;|[.,?():/"”;0-9%]/g, ' ', text) : '';

    /**
     * Extracts the text property of passed element
     * @param {object} element
     * @return {any} The value of the text property
     */
    const textView = R.view(R.lensProp('text'));
    /**
     * Extracts the ingress property of passed element
     * @param {object} element
     * @return {any} The value of the ingress property
     */
    const ingressView = R.view(R.lensProp('ingress'));

    /**
     * Function that takes a array of text and checks the levenstein value of every search word and every word in the text
     * and returns that array
     * @param {Array} An array of strings in a text element
     * @return {Array} An array of Levenstein computed values for all the words in the given text
     */
    const levensteinMapPrimer = R.map(e => R.map(ld =>  ld(e), R.flatten([computeLevensteinDistance(repi().ord.replace(/\+/g, ' '))])));

    /**
     * Reduces the list given to the object with the lowest value
     * @param {Array} Array of elements with values
     */
    const lowestValueReducer = R.reduce(R.minBy(e => e.value), {value: Infinity});

    /**
     * Function that maps all the different search words to the lowest value for each search word
     * @param {Array} The list of values for every search word
     * @return {Array} Reduced list with the lowest value for each search word
     */
    let reduceByMinVal = R.map(lowestValueReducer);
    /**
     * Takes the reduced list of all search words and reduce it to the search word with the lowest value
     * @param {Array} List of reduced values
     * @return {object} The object with the lowest value
     */
    let reduceAllByMinVal = R.compose(lowestValueReducer, reduceByMinVal);
    /**
     * Composer function that takes a functor of which element to compute levenstein values and reduce it to a single value
     * for the element in question
     * @param {function} f The functor to look up value from
     * @return {function(*=): {object}} A function to evaluate the element on
     */
    let superReducer = f => e => reduceAllByMinVal(levensteinMapPrimer(badStringReplacer(f(e)).split(' ')));

    /**
     * Injects levenstein values to elements passed in the array
     * @param {Array} Injectable array
     * @return {Array} Injected array
     */
    let hitsMap = R.map(e => R.assoc('textLd', superReducer(textView)(e), R.assoc('ingressLd', superReducer(ingressView)(e),{})));


    /**
     *
     * @param {object} e Object to check
     * @return {object} the object with the lowest levenstein value
     */
    let findLowest = e => e.ingressLd.value < e.textLd.value ? e.ingressLd : e.textLd;
    /**
     *
     * @param {object} e object to check
     * @return {string} The key of the object with the lowest levenstein value
     */
    let findLowestKey = e => e.ingressLd.value < e.textLd.value ? 'ingress' : 'text';

    /**
     * Function finds the index of the word that got a hit on the search
     * @param {object} e Element to use in the index search
     * @return {number} The index number
     */
    let findIndexOfWord = e => R.indexOf(findLowest(e).word, e[findLowestKey(e)].replace(/<(?:[\/0-9a-zA-Z\s\\="\-:;+%&.#?()_]*)>/g, ''));

    /**
     * Injects the levenstein values to the given array of elements
     * @param {Array} arr Injectable array
     * @return Injected array
     */
    const addLevenstein = arr => R.zipWith(R.merge, arr, hitsMap(arr));

    const removeDuplicates = R.dropRepeatsWith(R.eqBy(R.view(R.lensProp('_id'))));

    /**
     * Takes a array as parameter and applies the result of each function to the next function, thus kneeding the array
     * along the way
     * @type {Function}
     * @param {Array} The kneedable array
     * @return {Array} Kneeded array
     */
    const kneedArray = R.pipe(addLevenstein, sortOnPriorityAndLevensteinNumber, R.slice(start, start + size));

    /**
     * Primer that takes a word to replace and returns a function that takes the text to replace the word with
     * @param {string} word Word to replace
     * @return {function}
     */
    const replaceWord = (word) => R.replace(new RegExp(word, 'gi'), '<strong>' + word + '</strong>');



    /**
     * Fires on document load, start to ask the server for resources to apply to search
     * @param {Event} e The event
     * @return {void}
     */
    function handleOnLoad(e) {
        typeArr.forEach(function (type) {
            let contentXHR = new XMLHttpRequest();
            contentXHR.addEventListener('load', handleCXHRLoad(type, contentXHR));
        });
    }

    /******************* End Support functions *************/


    /**
     * Primer that returns a function to fire when resource has been fetched
     * @param type
     * @param contentXHR
     * @return {Function}
     */
    function handleCXHRLoad(type, contentXHR) {
        contentXHR.open('GET', '*/_/service/navno.nav.no.search/search' + w.location.search + '&type=' + type, true);
        contentXHR.send();
        return function () {
            const hits = JSON.parse(this.response);
            let updateArr = [];
            switch (type) {
                case 'priorities':
                case 'ldPriorities': {
                    resArr = kneedArray(addPriority(hits)).concat(resArr);
                    break;
                }
                case 'stopwords': {
                    stopwords = hits;
                    break;
                }
                case 'content':
                case 'exact': {
                    updateArr = kneedArray(hits);
                    break;
                }
                case 'facettconfig': {
                    facettConfig = hits.data;
                    updateFacetts();
                    break;
                }
                default: {

                }

            }
            updateResArr(updateArr)

        }

    }

    /**
     * This basicaly computes the levenstein distance of a word and return an object with the value and word
     * However, this only work for one search word and one text word.
     * So if the search word is longer than one word it returns an array of values.
     * If the text word is longer than one word it returns the lowest value of the words given
     * If no text word is present it returns a primed function with the search words
     * @param {string} s Search word[s]
     * @param {string} [t] Text word[s]
     * @return {*}
     */
    function computeLevensteinDistance (s, t) {
        if (s.split(' ').length > 1) {
            return s.split(' ').reduce(function (tot, el) {
                tot.push(computeLevensteinDistance(el, t));
                return tot;
            },[])
        }
        if (s.indexOf('~') !== -1) {
            s = s.substr(0, s.indexOf('~'));
        }
        if (t === '') return { value: Infinity };
        if (t === undefined) {
            return function (nt) {
                return computeLevensteinDistance(s, nt);
            }
        }
        if (t.split(' ').length > 1) {
            return R.reduce(R.minBy(e => e.value), { value: Infinity}, R.map(computeLevensteinDistance(s), t.split(' ')))
        }

        if (stopwords.indexOf(t) !== -1 || stopwords.indexOf(s) !== -1) return {
            value: Infinity
        };

        t = t.toLowerCase();
        s = s.toLowerCase();

        // matrix
        const n = s.length; // length of s
        const m = t.length; // length of t


        if (t.length >= 4 && s.length >=4 && (t.indexOf(s) !== -1 || s.indexOf(t) !== -1)) {
            return {
                value: s === t ? 0 : 1,
                word: t
            }
        }
        if ((!n || !m) || Math.abs(n - m) > 2) return {value: Infinity};


        let d = R.times(nr => nr === 0 ? R.times(R.identity, m+1) : R.times(mr => mr === 0 ? nr : 1000, m+1), n+1);


        d.forEach(function (e, ind) {
            if (ind === 0) d[ind] = e;
            else {
                var s_in = s.charAt(ind - 1);
                d[ind].forEach(function (el, j) {
                    const cost = (s_in === t.charAt(j - 1)) ? 0 : 1;
                    if (j === 0) {
                        d[ind][j] = el
                    }
                    else {
                        d[ind][j] = Math.min(d[ind - 1][j] + 1, d[ind][j - 1] + 1, d[ind - 1][j - 1] + cost)
                    }
                })
            }
        });
        return {
            value: d[n][m],
            word: t
        }
    }


    /**
     * Updates the result array and parses it
     * @param {Array} hits The resources from the server
     * @return {void}
     */
    function updateResArr(hits) {
        resArr = resArr.concat(hits);

        console.log(resArr);
        res.removeChild(ul);
        ul = document.createElement('ul');
        ul.setAttribute('style', 'list-style: none');
        ul.setAttribute('class', 'sokeresultatliste');
        R.forEach(parseResults, removeDuplicates(resArr));
        res.appendChild(ul);
        if (facettConfig) {
            updateFacetts();
        }
    }

    /**
     * Works like substring of given text, start and stop parameters, but it finds the substring from whole words
     * @param {string} text To be substringed
     * @param {number} start Substring from
     * @param {number} [stopp] Substring to
     * @return {string} The substring with whole words
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

    }

    /**
     * Finds where to cut the text and create a ingressial view with the search
     * @param {object} e Element to find substring from
     * @return {string} The substring for the ingressial view of search
     */
    let findSubstring = e => {
        if (!findLowest(e)) return '';
        let obj = findLowest(e);
      //  if (obj.value > LevensteinRange) return substreng(e.ingress, 0, 200);
        let index = findIndexOfWord(e);
        let word = obj.word;
        let replaceText = replaceWord(word);
        let text = e[findLowestKey(e)].replace(/<(?:[\/0-9a-zA-Z\s\\="\-:;+%&.?#()_]*)>/g, '');
        if (index < 100) {
            return text.length > 200 ? substreng(replaceText(text),0, 200) + ' (...)' : replaceText(text) ;
        }
        else if (index > text.length - 100) {
            return text.length > 200 ? substreng(replaceText(text),-200) + ' (...)' : replaceText(text);
        }
        else return text.length > 200 ? substreng(replaceText(text),index - 100, index + 100) + ' (...)' : replaceText(text);
    }

    /**
     * Paints the result to the view
     * @param {object} value The element to display on the view
     */
    function parseResults(value) {

       // console.log(findLowest(value));
        let ss = findSubstring(value);
        let li = document.createElement('li');
        let dn = document.createElement('a');
        let h3 = document.createElement('h2');
        let l = '';
        let ld = findLowest(value);

        li.setAttribute('class', 'informasjon');

        dn.setAttribute('href', value.href);
        h3.innerText = value.displayName;
        dn.appendChild(h3);
        if (numberIsLessThanTwoAndNotZero(ld.value)) {
            l = '&nbsp;Viser treff for <em>' + ld.word + '</em>';

            if (!o.hasOwnProperty(ld.word)) o[ld.word] = 0;
            o[ld.word]++;
            let le = document.createElement('span');
            le.innerHTML = l;
            dn.appendChild(le);
        }
        if (ss) {
            let subingress = document.createElement('p');
            subingress.setAttribute('class', 'resultattekst')
            subingress.innerHTML = ss;
            dn.appendChild(subingress);
        }
        if (value.pri) {
            let pri = document.createElement('p');
            pri.innerText = 'Innhold anbefalt av NAV';
            dn.appendChild(pri);
        }

        li.appendChild(dn);
        ul.appendChild(li);


    }

    function updateFacetts() {
        facett.removeChild(facetdiv);
        facetdiv = document.createElement('div');
        facetdiv.setAttribute('class', 'fasettGruppeElement');
        let facettUl = document.createElement('ul');
        facettUl.setAttribute('class', 'fasettListe');
        let mainFacetts = R.flatten([facettConfig.fasetter]);
        mainFacetts.forEach(function (mainfacett) {
            let facettLi = document.createElement('li');
            facettLi.setAttribute('class', 'utvidbar');
            let flInput = document.createElement('input');
            flInput.setAttribute('type', 'radio');
            flInput.setAttribute('name', mainfacett.fasettnavn);
            flInput.setAttribute('id', mainfacett.fasettnavn);
            flInput.setAttribute('value', '0');
            flInput.setAttribute('class', 'wicket-id30');
            facettLi.appendChild(flInput);
            let flLabel = document.createElement('label');
            flLabel.setAttribute('for', mainfacett.fasettnavn);
            flLabel.innerText = mainfacett.fasettnavn;
            facettLi.appendChild(flLabel);
            let flSpan = document.createElement('span');
            flSpan.setAttribute('class', 'antalltreff');
            flSpan.setAttribute('id', 'span' + mainfacett.fasettnavn);
            let flDiv = document.createElement('div');
            let subFacets = R.flatten([mainfacett.underfasetter]);
            if (subFacets.length > 0) {
                let sf = document.createElement('ul');
                let all = document.createElement('li');
                all.setAttribute('class', 'defaultFasett');
                let sfIn = document.createElement('input');
                sfIn.setAttribute('type', 'checkbox');
                sfIn.setAttribute('id', 'sfall' + mainfacett.fasettnavn);
                sfIn.setAttribute('value', '0');
                sfIn.setAttribute('name', 'sfall' + mainfacett.fasettnavn);
                sfIn.setAttribute('class', 'wicket-id39');
                all.appendChild(sfIn);
                let sfAllLabel = document.createElement('label');
                sfAllLabel.setAttribute('for', 'sfall' + mainfacett.fasettnavn);
                sfAllLabel.innerText = 'Alt innhold';
                all.appendChild(sfAllLabel);
                let sfSpanAll = document.createElement('span');
                sfSpanAll.setAttribute('class', 'antalltreff');
                all.appendChild(sfSpanAll);
                sf.appendChild(all);
                sf.setAttribute('class', 'underFasettListe clearfix');
                subFacets.forEach(function (subfacett) {
                    let sfEl = document.createElement('li');
                    sfEl.setAttribute('class', 'informasjon');
                    let sfInput = document.createElement('input');
                    sfInput.setAttribute('type', 'checkbox');
                    sfInput.setAttribute('id', 'sfall' + subfacett.underfasettnavn);
                    sfInput.setAttribute('value', '0');
                    sfInput.setAttribute('name', 'sfall' + subfacett.underfasettnavn);
                    sfInput.setAttribute('class', 'wicket-id39');
                    sfEl.appendChild(sfInput);
                    let sfLabel = document.createElement('label');
                    sfLabel.setAttribute('for', 'sfall' + subfacett.underfasettnavn);
                    sfLabel.innerText = subfacett.underfasettnavn;
                    sfEl.appendChild(sfLabel);
                    let sfSpanAll = document.createElement('span');
                    sfSpanAll.setAttribute('class', 'antalltreff');
                    sfEl.appendChild(sfSpanAll);
                    sf.appendChild(sfEl);
                    sf.setAttribute('class', 'underFasettListe clearfix');
                    let handler = createHandler(subfacett.searchconfig);
                    sfInput.addEventListener('click', handler);
                });
                flDiv.appendChild(sf);
                facettLi.appendChild(flDiv);

            }
            facettUl.appendChild(facettLi);
        });
        facetdiv.appendChild(facettUl);
        facett.appendChild(facetdiv);

    }

    function createHandler(config) {
        let f = R.indentity;
        let s = config.split(" ");
        let se = s.shift();
        while (se) {
            let p1;
            let p2;
            let o;
            let g;
            let not = false

            if (se === 'NOT') {
                not = true;
                se = s.shift();
            }
            p1 = se;
            se = s.shift();
            o = se;
            se = s.shift();
            p2 = se;
            switch (o) {
                case 'IN': {
                    g = R.gt(-1, R.indexOf(R.view(R.lensProp(p1)), p2));
                    break;
                }
            }
            g = not ? R.not(g) : g;
            f = R.compose(g,f);
            se = s.shift();

            }
            //f = se === '&&' ?

    }

})(window);
