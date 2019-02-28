
function handleGet(req) {
    return require('../../site/parts/searchresult/searchresult').get(req)
}

exports.get = handleGet;
