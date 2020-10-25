'use strict'

var fs = require('fs');
var conf = require('../../config.js');
//const files = require('./files.srv');
var db = require('../../db.js')

const s3 = require('../../s3Storage');


//Create store
//Function that allow create a product associated to a store in the app
module.exports.createProduct = (name,file,price,quantity,store,urlstore,salesprice,success,error)=>{
    let nameFile
    file===null?nameFile='no-file':nameFile=file.name;
    let query = `INSERT INTO products (name,multimedia,price,quantity,store,urlstore,salesprice) VALUES (?,?,?,?,?,?,?);`;
    db.query(query,[name,nameFile,price,quantity,store,urlstore,salesprice],function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let filename=`store-${store}/product-${name}/${nameFile}`;
            s3.saveFileToS3(filename,file.data);
            console.log(result);
            success(result);
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

module.exports.updateProduct = (idproduct,name,idstore,quantity,file,urlstore,success,error)=>{
    let nameFile
    file===null?nameFile='no-file':nameFile=file.name;
    let queryid = `SELECT * FROM products where store='${idstore}' and id='${idproduct}';`;
    db.query(queryid,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let query = `UPDATE products SET name='${name}',urlstore='${urlstore}',multimedia='${nameFile}',
                        store='${idstore}',quantity='${quantity}' where id='${idproduct}';`;
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

module.exports.updateProductInventory = (idproduct,idstore,quantity,success,error)=>{
    let queryid = `SELECT * FROM products where store='${idstore}' and id='${idproduct}';`;
    db.query(queryid,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
         //Si es correcto se crea la carpeta del store para la gestion de files
            let query = `UPDATE products SET quantity='${quantity}' where store='${idstore}' and id='${idproduct}';`;
            db.query(query,function(err,result){
                if(err){
                    console.log(err)
                    error(err);
                }else{
                    success(idproduct);
                }       
            })    
        }       
    })
}
