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