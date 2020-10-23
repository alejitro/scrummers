'use strict'

var fs = require('fs');
var conf = require('../../config.js');
//const files = require('./files.srv');
var db = require('../../db.js')

const RUTA_GESTOR_ARCHIVOS = conf.RUTA_GESTION_ARCHIVOS
const RUTA_GESTOR_ARCHIVOS_RAIZ = conf.RUTA_GESTION_ARCHIVOS_RAIZ

const s3 = require('../../s3Storage');
const URLS3 = conf.URLS3


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
         //Si es correcto se crea la carpeta del store para la gestion de files
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

module.exports.deleteStore = (idstores,idadmin,success,error)=>{
    
    let query = `DELETE FROM stores where id='${idstores}' and idadmin='${idadmin}';`;
    db.query(query,function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            let route=`store-${idstores}`;
            console.log("store to delete :", route);
            s3.deleteBucketFolder(route);
            success(result);
        }       
    })    
}

module.exports.editar = (idstores,nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,idadmin,success,error)=>{
   console.log(fecha_inicio)
    var params = {
        TableName: 'stores',
        Key:{
            idstore: idstores,
            admin: idadmin
        },
        UpdateExpression : "set nombre = :nombre, fecha_inicio = :fecha_inicio, fecha_fin=:fecha_fin, valor=:valor, guion=:guion, recomendaciones=:recomendaciones, ruta=:url, banner=:banner",
        ExpressionAttributeValues : {
            ":nombre": nombre,
            ":fecha_inicio":fecha_inicio,
            ":fecha_fin": fecha_fin,
            ":valor" : valor,
            ":guion" : guion,
            ":recomendaciones":recomendaciones,
            ":url":url,
            ":banner":banner        
        },
        "ReturnValues": "ALL_NEW"
      };
    
      ddb.update(params,function(err,result){
        if(err){
            error(err);
        }else{
            files.actualizarRuta(url,idstores, function (files) {
                success("ok");  
            },function(error){
                console.log(error);
                  
            })
    
        }
    })
}
