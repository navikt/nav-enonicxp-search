var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var view = resolve('./search.html');
exports.get = function(req) {
    // Return the result
    var asset = portal.assetUrl({path: 'search-styles/search.css'});
    var asset2 = portal.assetUrl({path: 'search-styles/search-nav.css'});
    var asset3 = portal.assetUrl({path: 'search-styles/search-appres.css'});
    var js = portal.assetUrl({path: 'search-js/elastic.js'});
    var js2 = portal.assetUrl({path: 'search-js/search-appres.js'});
    return {
        body: thymeleaf.render(view, portal.getComponent()),
        contentType: 'text/html',
        pageContributions: {
            headEnd: [
                '<script src="//cdn.jsdelivr.net/npm/ramda@latest/dist/ramda.js"></script>',

                '<link rel="stylesheet" href="' + asset3 + '" />',
                '<link rel="stylesheet" href="' + asset + '" />',
                '<link rel="stylesheet" href="' + asset2 + '" />'
            ],
            bodyEnd: [
               // '<script src="' + js + '"></script>',
                '<script src="' + js2 + '"></script>'
            ]
        }
    };

};
