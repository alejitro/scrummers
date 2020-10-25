'use strict'

var db = require('../../db.js')

//Create product
//Function that allow create an attribute associated to a product in the app
module.exports.createInventory = (product,attribute,quantity,success,error)=>{
    
    let query = `INSERT INTO inventory (product,attribute,quantity) VALUES (?,?,?);`;
    db.query(query,[product,attribute,quantity],function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })
}

module.exports.showInventoryXProductId = (idproduct,success,error)=>{
    let query = `SELECT * FROM inventory where product='${idproduct}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.showInventoryXAttributeId = (idattribute,success,error)=>{
    let query = `SELECT * FROM inventory where attribute='${idattribute}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.showInventoryXProductAndAttribute = (idproduct,idattribute,success,error)=>{
    let query = `SELECT * FROM inventory where product='${idproduct}' and attribute='${idattribute}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.deleteInventory = (idattribute,idproduct,success,error)=>{
    
    let query = `DELETE FROM inventory where product='${idproduct}' and attribute='${idattribute}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(idattribute);
        }       
    })    
}

module.exports.updateInventory = (idproduct,idattribute,quantity,success,error)=>{
    let query = `UPDATE attributes SET quantity='${quantity}' where product='${idproduct}' and attribute='${idattribute} ';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            console.log(result);
        }       
    })
}