'use strict'

var db = require('../../db.js');
var attr= require('./attributes.srv');
var inv = require('./inventory.srv');
const s3 = require('../../s3Storage');


//Crear Producto
//Funcion que permite hacer la creacion de un producto en el sistema con sus atributos y cantidades
module.exports.createProduct = (name,file,price,store,urlstore,salesprice,attributes,quantity,success,error)=>{
    let nameFile
    file===null?nameFile='no-file':nameFile=file.name;
    let query = `INSERT INTO products (name,multimedia,price,store,urlstore,salesprice) VALUES (?,?,?,?,?,?);`;
    db.query(query,[name,nameFile,price,store,urlstore,salesprice],function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let productId=result.insertId;
            if(file!==null){
                let filename=`store-${store}/product-${productId}/${nameFile}`;
                s3.saveFileToS3(filename,file.data);
            }
            inv.createInventory(productId,quantity,store,()=>{});
            if(attributes){
                attributes.map(at=>{
                    console.log("Attr Name", at.name);
                    attr.createAttribute(at.name, at.product,()=>{});
                })
                success(productId);
            }else{
                success(productId);
            }     
        }       
    })
}


module.exports.showProductsXStoreUrl = (urlstore,success,error)=>{
    let query = `SELECT * FROM products where urlstore='${urlstore}';`;
    db.query(query,function(err,result){
        console.log(result);
        if(err){
            console.log(err)
            error(err);
        }else{
            console.log(result);
            success(result);
        }       
    })    
}

module.exports.showProductsXStoreId = (idstore,success,error)=>{
    let query = `SELECT * FROM products where store='${idstore}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.deleteProduct = (idproduct,idstore,name,success,error)=>{
    
    let query = `DELETE FROM products where store='${idstore}' and id='${idproduct}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let route=`store-${idstore}/product-${name}`;
            console.log("store to delete :", route);
            s3.deleteBucketFolder(route);
            success(idproduct);
        }       
    })    
}

module.exports.updateProduct = (idproduct,name,idstore,file,urlstore,success,error)=>{
    let nameFile
    file===null?nameFile='no-file':nameFile=file.name;
    let queryid = `SELECT * FROM products where store='${idstore}' and id='${idproduct}';`;
    db.query(queryid,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let query = `UPDATE products SET name='${name}',urlstore='${urlstore}',multimedia='${nameFile}',
                        store='${idstore}' where id='${idproduct}';`;
            db.query(query,function(err,result){
                if(err){
                    console.log(err)
                    error(err);
                }else{
                    if(file!==null){
                        let filename=`store-${idstore}/product-${idproduct}/${file.name}`;
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
