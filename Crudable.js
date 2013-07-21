JSORM.define("JSORM.Crudable",{
  
  constructor:function(){
    var _isCrudable = function(p){return typeof p === "object" && p instanceof JSORM.Crudable ;};
    var _emitAssignments = function (p) { return isNaN(this[p]) ? "'" + this[p] + "'" : this[p]; };
    //@private
    var _emitCreateStatement = function(isNew) {
        var insertstm = ["INSERT", "INTO"],
            entity = this.getType(),
            columns = [],
            values = [];

        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attemp to save children first
            if (_isCrudable(this[p])) {
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
    //@private
    var _emitUpdateStatement = function() {
        var upstm = ["UPDATE"],
            entity = this.getType(),
            values = [],
            whereCls = [];

        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attempt to save children first
            if (_isCrudable(this[p])) {
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
	//private
	var _emitDeleteStatement = function() {
        var delstmnt = ["DELETE"],
            entity = this.getType(),
            whereCls = [];
        
        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attempt to save children first
            if (_isCrudable(this[p])) {
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
    //@protected
    this.save = function(isNew) {
        if (isNew) _emitCreateStatement.apply(this,[isNew]);
        else _emitUpdateStatement.apply(this);
    };
    //@protected
    this.update = function() {
        _emitUpdateStatement.apply(this);
    };
    //@protected
    this.deleteSelf = function () {
        _emitDeleteStatement.apply(this);
    };
  },  
  //@public
  keys:{}
  

});
