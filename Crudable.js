var extend = function (childClass, classBase) {
    childClass.prototype = new classBase();
    childClass.prototype.constructor = childClass;
};

var Crudable = (function () {
    /*@protected*/
    var _emitAssignments = function (p) { return isNaN(this[p]) ? "'" + this[p] + "'" : this[p]; };
    /*@protected*/
    var _emitCreateStatement = function(isNew) {
        var insertstm = ["INSERT", "INTO"],
            entity = this.getModelName().toUpperCase(),
            columns = [],
            values = [];

        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attemp to save children first
            if (typeof this[p] === "object" && this[p] instanceof Crudable) {
                console.log(this[p].save(isNew));continue;
            }

            if (typeof this[p] !== "object") {
                columns.push(p);
                values.push(this[p] ?
                    _emitAssignments.apply(this, [p])
                    : "null");
            }
        }

        values = "values ( " + values.join(" , ") + " )";
        columns = "( " + columns.join(" , ") + " )";

        insertstm.push(entity);
        insertstm.push(columns);
        insertstm.push(values);
        console.log(insertstm.join(" "));
    };
    /*@protected*/
    var _emitUpdateStatement = function() {
        var upstm = ["UPDATE"],
            entity = this.getModelName().toUpperCase(),
            values = [],
            whereCls = [];

        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attemp to save children first
            if (typeof this[p] === "object" && this[p] instanceof Crudable) {
                console.log(this[p].update()); continue;
            }
            if (typeof this[p] !== "object") {
                values.push(this[p]
                                     ? p + " = " + _emitAssignments.apply(this, [p])
                                     :"null");

                //build where clause
                if (this.keys[p]) {
                    var val = _emitAssignments.apply(this, [p]);
                    whereCls.push(p + " = " + val);
                }
            }
        }
        values = " SET " + values.join(" , ");
        whereCls = " WHERE " + whereCls.join(" and ");
        upstm.push(entity);
        upstm.push(values);
        upstm.push(whereCls);

        console.log(upstm.join(" "));
    };
    
    //@protected
    var _emitDeleteStatement = function() {
        var delstmnt = ["DELETE"],
            entity = this.getModelName().toUpperCase(),
            whereCls = [];
        
        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attemp to save children first
            if (typeof this[p] === "object" && this[p] instanceof Crudable) {
                console.log(this[p].delete()); continue;
            }
            if (typeof this[p] !== "object") {
                //build where clause
                if (this.keys[p]) {
                    var val = _emitAssignments.apply(this, [p]);
                    whereCls.push(p + " = " + val);
                }
            }
        }
        
        whereCls = " WHERE " + whereCls.join(" and ");
        delstmnt.push(entity);
        delstmnt.push(whereCls);
        console.log(delstmnt.join(" "));
            
    };
    
    //@ public constructor
    function Crudable() { };
    //@ public 
    Crudable.prototype.keys = {};
    //@ public 
    Crudable.prototype.getModelName = function() {
        throw "Not Implemented exception func: `getModelName`";
    };
    //@ public 
    Crudable.prototype.save = function(isNew) {
        if (isNew) _emitCreateStatement.apply(this,[isNew]);
        else _emitUpdateStatement.apply(this);
    };
    //@ public 
    Crudable.prototype.update = function() {
        _emitUpdateStatement.apply(this);
    };
    //@ public 
    Crudable.prototype.delete = function () {
        _emitDeleteStatement.apply(this);
    };

    return Crudable;
})();