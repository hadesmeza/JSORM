JSORM.define("JSORM.Crudable",{
  
  constructor:function(){
    var isCrudable = function(p){return typeof p === "object" && p instanceof JSORM.Crudable ;};
    var emitAssignments = function (p) { return isNaN(this[p]) ? "'" + this[p] + "'" : this[p]; };
    //@private
    var emitCreateStatement = function(isNew) {
        var insertstm = ["INSERT", "INTO"],
            entity = this.getType(),
            columns = [],
            values = [];

        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attempt to save children first
            if (isCrudable(this[p])) {
                console.log(this[p].save(isNew));continue;
            }

            if (typeof this[p] !== "object") {
                columns.push(p);
                values.push(this[p] ?
                    emitAssignments.apply(this, [p])
                    : "null");
            }
        }

        values = "values ( " + values.join(" , ") + " )";
        columns = "( " + columns.join(" , ") + " )";

        insertstm.push(entity);
        insertstm.push(columns);
        insertstm.push(values);
        JSORM.Crudable.repository().executeScalar(insertstm.join(" "));
    };
    //@private
    var emitUpdateStatement = function() {
        var upstm = ["UPDATE"],
            entity = this.getType(),
            values = [],
            whereCls = [];

        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attempt to save children first
            if (isCrudable(this[p])) {
                console.log(this[p].update()); continue;
            }
            if (typeof this[p] !== "object") {
                values.push(this[p]
                                     ? p + " = " + emitAssignments.apply(this, [p])
                                     :"null");

                //build where clause
                if (this.keys[p]) {
                    var val = emitAssignments.apply(this, [p]);
                    whereCls.push(p + " = " + val);
                }
            }
        }
        values = " SET " + values.join(" , ");
        whereCls = " WHERE " + whereCls.join(" and ");
        upstm.push(entity);
        upstm.push(values);
        upstm.push(whereCls);

        JSORM.Crudable.repository().executeScalar(upstm.join(" "));
    };
	//private
	var emitDeleteStatement = function() {
        var delstmnt = ["DELETE"],
            entity = this.getType(),
            whereCls = [];
        
        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attempt to save children first
            if (isCrudable(this[p])) {
                console.log(this[p].delete()); continue;
            }
            if (typeof this[p] !== "object") {
                //build where clause
                if (this.keys[p]) {
                    var val = emitAssignments.apply(this, [p]);
                    whereCls.push(p + " = " + val);
                }
            }
        }
        
        whereCls = " WHERE " + whereCls.join(" and ");
        delstmnt.push(entity);
        delstmnt.push(whereCls);
		JSORM.Crudable.repository().executeScalar(delstmnt.join(" "));
            
    };
	var emitSelectStatement = function(){
	var statement = ["SELECT * FROM", this.getType()],
	 whereCls = [];        
        for (var p in this) {
            if (typeof this[p] === "function") continue;
            //attempt to save children first
            if (isCrudable(this[p])) {
                //this[p].getByKeys(); continue;
            }
            if (typeof this[p] !== "object") {
                //build where clause
                if (this.keys[p]) {
                    var val = emitAssignments.apply(this, [p]);
                    whereCls.push(p + " = " + val);
                }
            }
        }        
        whereCls = " WHERE " + whereCls.join(" and ");
		statement.push(whereCls);
		var dto =  JSORM.Crudable.repository(this.getRawTypeWithNS()).executeReader(statement.join(" "));
		for(var item in dto){
		    if(this.hasOwnProperty(item))this[item] = dto[item];
		}
	};
	//@protected
    this.getByKeys = function() {
         emitSelectStatement.apply(this);        
    };
    //@protected
    this.save = function(isNew) {
        if (isNew) emitCreateStatement.apply(this,[isNew]);
        else emitUpdateStatement.apply(this);
    };
    //@protected
    this.update = function() {
        emitUpdateStatement.apply(this);
    };
    //@protected
    this.deleteSelf = function () {
        emitDeleteStatement.apply(this);
    };
  },  
  //@public
  keys:{},
  statics:{
   repository: function( TYPE, args ) { return new JSORM.MockRepository(TYPE, args); }
  
  }
});
