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