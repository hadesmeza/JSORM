var MODELS = {};
JSORM.define("MODELS.customer",{
  extends:"Crudable",
  constructor:function(){
  this.name="";
  this.lastName="";
  this.age =0;
  },
  //overrides
  keys:{
  name:true,
  lastName:true
  },
  statics:{  
  getCustomerByKeys: function(keys){
   var cust  = new MODELS.customer();
   for(var k in keys){
     cust[k] = keys[k];
   }
    cust.getByKeys(keys);
	return cust;
  }
  
  }
  

});

var cust = new MODELS.customer();
cust.name = "Hades";
cust.lastName = "Meza";
cust.age = 31;

cust.save(true);
cust.update();
cust.deleteSelf();
JSORM.Queryable(MODELS.customer).Where("i => i.age >= 25 && i.lastName === 'Meza'").OrderByDescending("i=> i.lastName").ToArray();

var newCust = MODELS.customer.getCustomerByKeys({ name:"hades", lastName:"Meza"});

console.log(newCust);