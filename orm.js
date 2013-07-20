

var customer = function (emp) {
    if (!(emp instanceof employee)) throw "emp is not typeof `employee`";
    this.employee = emp;
    this.name = "";
    this.lastName = "";
    this.age = 0;
};

extend(customer, Crudable);

customer.prototype.getModelName = function () {
    return "customer";
};
customer.prototype.keys = {
    "name": true,
    "lastName": true
};
/*statics*/

var employee = function () {
    this.name = "";
    this.lastName = "";

};

extend(employee, Crudable);
employee.prototype.getModelName = function () {
    return "employee";
};

employee.prototype.keys = {
    "name": true,
    "lastName": true
};


var emp = new employee();
emp.name = "Carlos";
emp.lastName = "Estrada";

var cust = new customer(emp);
cust.name = "Hades";
cust.lastName = "Meza";
cust.age = 31;

cust.save(true);
cust.update();