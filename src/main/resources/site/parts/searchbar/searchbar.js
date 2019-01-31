
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');

var view = resolve('./searchbar.html');

function get(req)  {
    var ord = req.params.ord || '';
    var model = {
        ord: ord,
        form: portal.serviceUrl({service: 'search'}),
    }
    var body = thymeleaf.render(view, model);

    return {
        body: body
    }
}

exports.get = get;
