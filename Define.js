var JSORM ={};
/*
obj{
constructor {function}
statics {object}
overrides {object}
extends {String}
}
klass {String}

*/
JSORM.define = function (klass, obj) {

    //create class template traversing namespaces
	var source = klass;
	var $ctor = obj.constructor || function(){};
    var nsNavigator = window;
    var ns = klass.split(".");
    var TYPE = ns[ns.length - 1];

    for (var i = 0; i < ns.length; i++) {
        if (ns[i] === TYPE) break;
        nsNavigator = nsNavigator[ns[i]];
        if (!nsNavigator) throw "namespace :`" + ns[i] + "` was not found";
    }
	
	//add .ctor
	nsNavigator[TYPE] = $ctor;
    klass = nsNavigator[TYPE];
	klass.prototype.METADATA={};
   //extend if a class is passed
    if (obj.extends) {
        klass.prototype = new JSORM[obj.extends]();
         klass.prototype.constructor = klass; 		 
    }
    //add non static methods
    for (var fn in obj) {
        if (fn !== "statics" && (typeof obj[fn] === "object" || typeof obj[fn] === "function")){
            klass.prototype[fn] = obj[fn];
        }
    }
  
    // add reflection help
	 klass.prototype.getRawTypeWithNS = function(){
    return source;
    },
    klass.prototype.getType = function(){
    return TYPE.toUpperCase();
    },
   
    klass.prototype.getSuperType =function(){
    return obj.extends ? obj.extends.toUpperCase() : "undefined";
    }
    //check for overrides
    if (obj.overrides) {
        for (var fn in obj.overrides) {
            if (klass.prototype[fn]) klass.prototype[fn] = obj[fn];
        }
    }

    //add statics
    if (obj.statics) {
        for (var st in obj.statics)
        klass[st] = obj.statics[st];
    }
    //add Type
    klass.$type = klass.prototype.getType();
	klass.$superType = klass.prototype.getSuperType();
};
