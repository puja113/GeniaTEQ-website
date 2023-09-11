var mysql=require('mysql');
var pool=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"system#12#12",
    database:"geniatech"
})

module.exports=pool;