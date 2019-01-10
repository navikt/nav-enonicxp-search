
var thymeleaf = require('/lib/xp/thymeleaf');
var portal = require('/lib/xp/portal');

var view = resolve('./facett.html');

function get(req)  {
    var model = {

    }
    var body = thymeleaf.render(view, model);

    return {
        body: body
    }
}

exports.get = get;
