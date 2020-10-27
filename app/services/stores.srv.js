'use strict'

var fs = require('fs');
var conf = require('../../config.js');
//const files = require('./files.srv');
var db = require('../../db.js')

const S3 = require('../../s3Storage');


//Create store
//Function that allow create a commerce in the app
module.exports.createStore = (name,url,banner,idadmin,success,error)=>{
    let nameBanner
    banner===null?nameBanner='no-image':nameBanner=banner.name;
    let query = `INSERT INTO stores (name,url,banner,idadmin) VALUES (?, ?, ?,?);`;
    db.query(query,[name,url,nameBanner,idadmin],function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let queryid = `SELECT * FROM stores where url='${url}';`;
            db.query(queryid,function(err,result){
                if(err){
                    console.log(err)
                    error(err);
                }else{
                    let idstore=result[0].id;
                    console.log('idstore',idstore);
                    if(banner!==null){
                        let filename=`store-${idstore}/${banner.name}`;
                        S3.saveFileToS3(filename,banner.data);
                        success(idstore);
                    }
                    else{
                        success(idstore);
                    }
                }       
            })    
        }       
    })
}


module.exports.showStoreXid = (idstore,success,error)=>{
    let query = `SELECT * FROM stores where id='${idstore}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}


module.exports.showStoreXURL = (urlstore,success,error)=>{
    let query = `SELECT * FROM stores where url='${urlstore}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.showStoresXUser = (idadmin,success,error)=>{
    let query = `SELECT * FROM stores where idadmin='${idadmin}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.showStores = (success,error)=>{
    let query = `SELECT * FROM stores;`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })    
}

module.exports.deleteStore = (idstore,idadmin,success,error)=>{
    
    let query = `DELETE FROM stores where id='${idstore}' and idadmin='${idadmin}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let route=`store-${idstore}`;
            console.log("store to delete :", route);
            S3.deleteBucketFolder(route);
            success(result);
        }       
    })    
}

module.exports.editStore = (idstore,name,url,idadmin,banner,success,error)=>{
    let nameBanner
    banner===null?nameBanner='no-image':nameBanner=banner.name;
    let query = `UPDATE stores SET name='${name}',url='${url}',banner='${nameBanner}',idadmin='${idadmin}' where id='${idstore}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            if(banner!==null){
                let filename=`store-${idstore}/${banner.name}`;
                S3.saveFileToS3(filename,banner.data,false,);
                success(idstore);
            }
            else{
                success(idstore);
            }
        }       
    })    
}
