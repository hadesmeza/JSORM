JSORM.define("JSORM.Activator",{  
   //todo 
  //edge = require('edge');
  constructor:function(){},
  statics:{
  //overload function( TYPE )
  //overload function( TYPE , args )
  createInstanceOf: function(TYPE, args){  
  var ns = TYPE.split(".");
  var nsNavigator = window;  
  var TYPE = ns[ns.length - 1];

    for (var i = 0; i < ns.length; i++) {
        if (ns[i] === TYPE) break;
        nsNavigator = nsNavigator[ns[i]];
        if (!nsNavigator) throw "namespace :`" + ns[i] + "` was not found";
    }
	if( typeof nsNavigator[TYPE] !== "function" ) throw "Unable to create an instance of `TYPE`" + TYPE;
	return new nsNavigator[TYPE](args);
  }
  }

});



JSORM.define("JSORM.IRepository",{  
   //todo 
  //edge = require('edge');
  constructor:function(){},
  executeReader:function(statement){ throw "Not implemented exception";},
  executeNonQuery:function(statement){ throw "Not implemented exception";},
  executeScalar:function(statement){ throw "Not implemented exception";},

});


JSORM.define("JSORM.MockRepository",{  
   //todo 
  //edge = require('edge');
  extends:"IRepository",
  //public overload function(  )
  //public overload function( TYPE )
  //public overload function( TYPE, args )
  constructor:function( TYPE, args ){
  this.TYPE = TYPE;
  this.args = args || {};
  },
  executeReader:function(statement){ 
  console.log(statement);
  var instance = JSORM.Activator.createInstanceOf(this.TYPE, this.args);
  
  for (var p in instance) {
            if (instance.hasOwnProperty(p)) {
                instance[p] = "xyz";
            }
        }
   return instance;		
  },
  executeScalar:function(statement){ console.log(statement);},

});
