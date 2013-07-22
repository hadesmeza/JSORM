

JSORM.define("JSORM.Queryable",{
       
 constructor: function ( TYPE ) {
 if(  TYPE.$superType !== "JSORM.Crudable"  ) throw "`TYPE` must implement Crudable";
		var expressions = [],
		    utils = {
				processLambda: function (clause) {
					if (utils.isLambda(clause)) {
						var expr = clause.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
						return new Function(expr[1], "return (" + expr[2] + ")");
					}
					return clause;
				},
				transformExpression: function (clause) {
					if (utils.isLambda(clause)) {
						var expr = clause.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
						//replace ops
						var res = expr[2].replace(/\w+\./g, "")
							.replace(/\={3}/g, "=")
							.replace(/\={2}/g, "=")
							.replace(/\|{2}/g, "OR")
							.replace(/\&{2}/g, "AND");
						return res;
					}
					return clause;
				},
				isLambda: function (clause) {
					return (clause.indexOf("=>") > -1);
				},
				validateLambda: function (lambda) {
					if (!utils.isLambda(lambda)) throw "Not a valid lambda expression.";
				},
				KEYWORDS: {
					SELECT: "SELECT ",
					ALL: " * ",
					FROM: " FROM ",
					WHERE: " WHERE ", 
					ORDERBY: " ORDER BY",
					DESC: " DESC",
					JOIN:" JOIN ",
					GROUPBY:" GROUP BY "
				}
			},
        
		where = function (lambda) {
            utils.validateLambda(lambda);
            expressions.push(utils.KEYWORDS.WHERE);
            expressions.push(utils.transformExpression(lambda));
            return this;
        },
        orderBy = function (lambda) {
            utils.validateLambda(lambda);
            expressions.push(utils.KEYWORDS.ORDERBY);
            expressions.push(utils.transformExpression(lambda));
          return this;
        },
        orderByDescending = function (lambda) {
            utils.validateLambda(lambda);
            expressions.push(utils.KEYWORDS.ORDERBY);
            expressions.push(utils.transformExpression(lambda));
            expressions.push(utils.KEYWORDS.DESC);
         return this;
        },
        toArray = function(){
            console.log(expressions.join(""));
        },
        select = function (clause) {
            var item, newArray = [],
                field = clause;
            if (typeof (clause) !== "function") {
                if (clause.indexOf(",") === -1) {
                    clause = function () {
                        return this[field];
                    };
                } else {
                    clause = function () {
                        var i, fields = field.split(","),
                            obj = {};
                        for (i = 0; i < fields.length; i++) {
                            obj[fields[i]] = this[fields[i]];
                        }
                        return obj;
                    };
                }
            }

            // The clause was passed in as a Method that returns a Value
            for (var i = 0; i < this.items.length; i++) {
                item = clause.apply(this.items[i], [this.items[i]]);
                if (item) {
                    newArray[newArray.length] = item;
                }
            }
            return newArray;
        },		          
		TYPE = TYPE.$type;
		expressions.push(utils.KEYWORDS.SELECT);
		expressions.push(utils.KEYWORDS.ALL);
		expressions.push(utils.KEYWORDS.FROM);
		expressions.push(TYPE.toUpperCase());

	    //protected methods
        this.Where = where;
        this.OrderBy = orderBy;
        this.OrderByDescending = orderByDescending;
        this.Select = select;
        this.ToArray = toArray;
		
       return this;
    }

 });




