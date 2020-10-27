'use strict'

var db = require('../../db.js')
var conf=require('../../config')

//Create product
//Function that allow create an attribute associated to a product in the app
module.exports.createMultimedia = (idproduct,file,success,error)=>{
    if(file){
        let urlFileS3=`${conf.URLS3}/store-${idproduct}/${file.name}`;
        let query = `INSERT INTO multimedia (name,product,urls3) VALUES (?,?,?);`;
        db.query(query,[file.name,idproduct,urlFileS3],function(err,result){
            if(err){
                console.log(err)
                error(err);
            }else{
                success(result.insertId);
            }       
        })
    }else{
        error("Adjunte un archivo");
    }
}

module.exports.showMultimediasXProductId = (idproduct,success,error)=>{
    let query = `SELECT * FROM multimedia where product='${idproduct}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.deleteMultimedia = (idproduct,success,error)=>{
    
    let query = `DELETE FROM multimedia where product='${idproduct}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(idattribute);
        }       
    })    
}

module.exports.updateMultimedia = (file,idproduct,success,error)=>{
    if(file){
        let query = `UPDATE multimedia SET name='${file.name}',where product='${idproduct}';`;
        db.query(query,function(err,result){
            if(err){
                console.log(err)
                error(err);
            }else{
                let filename=`/product-${idproduct}/${file.name}`;
                s3.saveFileToS3(filename,file.data);
                success(idproduct);
            }       
        })
    }else{
        error("Adjunte un archivo");
    }
}