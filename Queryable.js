var Queryable = (function () {
    var _entity;
    
    //public constructor
    function Queryable(entity) {
        if (typeof entity !== "function") throw "`entity` must be an object";
        _entity = entity;
    }

    Queryable.prototype.select = function () { };
    Queryable.prototype.from = function () { };
    Queryable.prototype.where = function () { };


    return Queryable;
})();