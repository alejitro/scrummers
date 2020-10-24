'use strict'

var fs = require('fs');
var conf = require('../../config.js');
//const files = require('./files.srv');
var db = require('../../db.js')

const s3 = require('../../s3Storage');


//Create store
//Function that allow create a product associated to a store in the app
module.exports.createProduct = (name,idstore,quantity,file,urlstore,success,error)=>{
    let nameFile
    file===null?nameFile='no-file':nameFile=file.name;
    let query = `INSERT INTO products (name,multimedia,quantity,store,urlstore) VALUES (?, ?,?,?,?);`;
    db.query(query,[name,nameFile,quantity,idstore,urlstore],function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let filename=`store-${idstore}/product-${name}/${nameFile}`;
            s3.saveFileToS3(filename,file.data);
            console.log(result);
            success(result);
        }       
    })
}


module.exports.showProductsXStoreUrl = (urlstore,success,error)=>{
    let query = `SELECT * FROM products where url='${urlstore}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.showProductsXStoreId = (idstore,success,error)=>{
    let query = `SELECT * FROM products where id='${idstore}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.showProducts = (success,error)=>{
    let query = `SELECT * FROM products;`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.deleteProduct = (idstore,idadmin,success,error)=>{
    
    let query = `DELETE FROM stores where id='${idstore}' and idadmin='${idadmin}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let route=`store-${idstore}`;
            console.log("store to delete :", route);
            s3.deleteBucketFolder(route);
            success(result);
        }       
    })    
}

module.exports.editProduct = (idstore,name,url,banner,idadmin,success,error)=>{
    let nameFile
    banner===null?nameFile='no-image':nameFile=banner.name;
    let queryid = `SELECT * FROM stores where id='${idstore}';`;
    db.query(queryid,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
         //Si es correcto se crea la carpeta del store para la gestion de files
            let query = `UPDATE stores SET name='${name}',url='${url}',banner='${banner.name}',idadmin='${idadmin}' where id='${idstore}';`;
            db.query(query,[name,url,nameFile,idadmin],function(err,result){
                if(err){
                    console.log(err)
                    error(err);
                }else{
                    //let idstore=result[0].id;
                    //console.log('idstore',idstore);
                    if(banner!==null){
                        let filename=`store-${idstore}/${banner.name}`;
                        s3.saveFileToS3(filename,banner.data,false,);
                        success(idstore);
                    }
                    else{
                        success(idstore);
                    }
                }       
            })    
        }       
    })
    
      /*ddb.update(params,function(err,result){
        if(err){
            error(err);
        }else{
            files.actualizarRuta(url,idstores, function (files) {
                success("ok");  
            },function(error){
                console.log(error);
                  
            })
    
        }
    })*/
}
