/**
 * Return query as array to use array.reduce with async/await.
 * @param query 
 */
 exports.returnArray = (query) => {
    if(!Array.isArray(query)){
        return [query];
    }
    else{
        return query;
    }
}

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0); }

exports.handleLimitQuery = (query) => {
    return isNumber(query) & query > 0;
}

exports.handleSearchQuery = (query) => {
    return query.length > 0;
}