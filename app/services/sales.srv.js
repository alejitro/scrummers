'use strict'

var db = require('../../db.js')
var inv = require('./inventory.srv')

//Create product
//Function that allow create a sale associated to a product in the app
module.exports.createSale = (idsale,idproduct,quantity,salesprice,taxes,success,error)=>{
    let finalQuantity=0;
    let totalprice=0;
    inv.showInventoryXProductId(idproduct,(res)=>{
        finalQuantity= res[0].quantity-quantity;
        if(finalQuantity<0){
            error("No hay stock suficiente para la venta")
        }else{
            if(taxes>0){
                totalprice=(salesprice+(salesprice*(taxes/100))*quantity);
            }else{  
                totalprice=(salesprice*quantity);
            }
            let query = `INSERT INTO sales (idsale,product,quantity,salesprice,taxes,totalprice) VALUES (?,?,?,?,?,?);`;
            db.query(query,[idsale,idproduct,quantity,salesprice,taxes,totalprice],function(err,result){
                if(err){
                    console.log(err)
                    error(err);
                }else{
                    inv.updateInventory(idproduct,finalQuantity);
                    success(result);
                }       
            })
        }
    });
}

module.exports.showSalesXProductId = (idproduct,success,error)=>{
    let query = `SELECT sales.idsale,products.name as name,attributes.name as attribute,sales.salesprice,sales.quantity,sales.taxes, sales.totalprice
                 FROM sales INNER JOIN products ON products.id=sales.product INNER JOIN attributes where products.id='${idproduct}' 
                 and attributes.product=${idproduct};`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.deleteAttribute = (idattribute,idproduct,success,error)=>{
    
    let query = `DELETE FROM attributes where product='${idproduct}' and id='${idattribute}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(idattribute);
        }       
    })    
}

module.exports.updateAttribute = (idattribute,name,description,idproduct,success,error)=>{
    let queryid = `SELECT * FROM attributes where product='${idproduct}' and id='${idattribute}';`;
    let query = `UPDATE attributes SET name='${name}',description='${description}' where id='${idattribute}';`;
    db.query(queryid,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            db.query(query,function(err,result){
                if(err){
                    console.log(err)
                    error(err);
                }else{
                    if(file!==null){
                        let filename=`product-${idproduct}/product-${idproduct}/${file.name}`;
                        s3.saveFileToS3(filename,file.data);
                        success(idproduct);
                    }
                    else{
                        success(idproduct);
                    }
                }       
            })    
        }       
    })
}