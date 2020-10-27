'use strict'

var db = require('../../db.js')

//Create product
//Function that allow create an attribute associated to a product in the app
module.exports.createInventory = (product,quantity,store,success,error)=>{
    
    let query = `INSERT INTO inventory (product,quantity,store) VALUES (?,?,?);`;
    db.query(query,[product,quantity,store],function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result.insertId);
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

module.exports.showInventoryXStore = (idstore,idproduct,success,error)=>{
    //let query = `SELECT * FROM inventory where product='${idproduct}' and attribute='${idattribute}';`;
    let query = `SELECT products.id, products.name, attributes.name,products.multimedia, products.price, products.salesprice, inventory.quantity 
                From products inner join attributes ON products.id=attributes.product INNER JOIN inventory 
                ON products.id=inventory.product where products.store=${idstore} and products.id=${idproduct}`;
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

module.exports.updateInventory = (idproduct,quantity,success,error)=>{
    let query = `UPDATE inventory SET quantity='${quantity}' where product='${idproduct}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            console.log(result);
            //success(result);
        }       
    })
}