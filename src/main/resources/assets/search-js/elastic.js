(function(w) {
    const R = w.R;

    let results = document.getElementById('res');
    let div = document.createElement('div');
    let facetts = document.getElementById('facetts');
    results.appendChild(div);
    let searchObject = undefined;
    const repi = (str) => (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = decodeURI(n[1]),this}.bind({}))[0];
    onLoad();

    function onLoad() {
        let params = repi();
        let contentXHR = new XMLHttpRequest();
        contentXHR.addEventListener('load', handleCXHRLoad);
        //contentXHR.open('GET', 'http://localhost:3001/search' +  w.location.search, true);
        contentXHR.open('GET', '*/_/service/navno.nav.no.search/search' + w.location.search + '&type=content', true);
        contentXHR.send();
    }
    function handleCXHRLoad() {
        const hits = JSON.parse(this.response);
        console.log(hits);
        searchObject = mapper(searchObject, hits);
        console.log(searchObject);
        paint(searchObject);
    }

    function mapper(obj, hits) {
        return {
            total:      obj ? obj.total : hits.hits.total,
            facetts:    obj ? obj.facetts : hits.aggregations,
            hits:       obj ? obj.hits.concat(R.map(hitsMapper, hits.hits.hits)) : R.map(hitsMapper, hits.hits.hits),
            suggest:    obj ? obj.suggest : R.reduce(suggestMapper,{}, hits.suggest.ss)

        }

    }

    const highlightViewer = e => s => R.view(R.lensIndex(0),R.view(R.lensProp(s),e) || [undefined]);
    function suggestMapper(ret, suggest) {
        return suggest.options.reduce(function (t, option) {
            console.log(option);
            return (!t.freq || t.freq < option.freq) ? option : t
        },ret)
    }
    function hitsMapper(e) {
        let source = e._source;
        let hv = highlightViewer(e.highlight);
        return {
            displayName: source.displayname,
            highlight: hv('data.ingress') || hv('data.text') || hv('displayname') || hv('data.text._analyzed')  ,
            cd: source.createdtime,
            md: source.modifiedtime,
            type: source.type,
            path: source._path[0]

        }
    }
    function paint(obj) {
        res.removeChild(div);
        div = document.createElement('div');
        div.setAttribute('class', 'sokeresultatliste');
        let header = createHeader();
        div.appendChild(header);
        let meta = createSearchMeta(obj);
        div.appendChild(meta);
        let resUl = createResUl(obj.hits);
        div.appendChild(resUl);
        let more = appendMore(obj);
        if (more) {
            div.appendChild(more);
        }
        let facetts = createFacetts(obj);
        res.appendChild(div);

    }

    function createFacetts(obj) {

        const facetts = obj.facetts;
        const lokal = facetts.pathAgg;
        let facettDiv = document.createElement('div');
        facettDiv.setAttribute('class', 'fasettGruppeElement');


    }

    function createMainFacett(facett) {

    }
    function appendMore(obj) {
        let p = repi();
        let count = Number(p.c || 0);
        if (count * 20 > obj.total) return null;
        let moreA = document.createElement('a');
        moreA.setAttribute('role', 'button');
        moreA.setAttribute('class', 'flereResultater');
        moreA.addEventListener('click', function (e) {
            e.preventDefault();
            let contentXHR = new XMLHttpRequest();
            contentXHR.addEventListener('load', handleCXHRLoad);
            p.c = count + 1;
            history.pushState({search:'more'}, document.title, location.origin + location.pathname + reversedRepi(p));
            //contentXHR.open('GET', 'http://localhost:3001/search' +  w.location.search, true);
            contentXHR.open('GET', '*/_/service/navno.nav.no.search/search' + w.location.search + '&type=update', true);
            contentXHR.send();
        });
        moreA.innerText = 'Vis flere treff';
        return moreA;
    }
    function reversedRepi(repi) {
        let r = [];
        for (let k in repi) {
            if (repi.hasOwnProperty(k)) r.push(k + '=' + repi[k])
        }
        return '?' + r.join('&');
    }
    function createHeader() {
        let h1 = document.createElement('h1');
        let mode = repi().mode;
        let title = '';
        switch (mode) {
            default: title = 'Sentralt Innhold'
        }
        h1.innerText = title;
        return h1;
    }
    function createSearchMeta(obj) {
        let total = obj.total;
        let suggestions = obj.suggest;
        let factor = 0.6
        console.log(suggestions);

        let smDiv = document.createElement('div');
        smDiv.setAttribute('class', 'clearfix');
        let innerDiv = document.createElement('div');
        innerDiv.setAttribute('class', 'pull-left');
        innerDiv.setAttribute('aria-live', 'polite');
        innerDiv.setAttribute('aria-atomic', 'true');
        let innerP = document.createElement('p');
        innerP.setAttribute('class', 'treffInfo');
        let innerPText = document.createTextNode(total + ' treff for ');
        let innerPSpan = document.createElement('span');
        innerPSpan.setAttribute('class', 'sokeord');
        innerPSpan.innerText = (suggestions.freq / total > factor) ? suggestions.text : repi().ord.replace(/\+/g, ' ');

        innerP.appendChild(innerPText);
        innerP.appendChild(innerPSpan);
        innerDiv.appendChild(innerP);
        smDiv.appendChild(innerDiv);

        return smDiv;

    }

    function createResUl(hits) {
        let resUl = document.createElement('ul');
        resUl.setAttribute('class', 'sokeresultatliste');
        hits.forEach(function (element) {
            let li = document.createElement('li');
            li.setAttribute('class', 'informasjon');
            let a = document.createElement('a');
            a.setAttribute('href', element.path);
            let h2 = document.createElement('h2');
            h2.innerText = element.displayName;
            a.appendChild(h2);
            let pathP = document.createElement('p');
            pathP.innerText = element.path;
            a.appendChild(pathP);
            let resTextP = document.createElement('p');
            resTextP.innerHTML = element.highlight;
            resTextP.setAttribute('class', 'resultattekst');
            a.appendChild(resTextP);
            li.appendChild(a);
            resUl.appendChild(li);
        })
        return resUl;
    }
})(window);
