'use strict'

var db = require('../../db.js')

//Create product
//Function that allow create an attribute associated to a product in the app
module.exports.createAttribute = (name,description,idproduct,success,error)=>{
    
    let query = `INSERT INTO attributes (name,description,product) VALUES (?,?,?);`;
    db.query(query,[name,description,idproduct],function(err,result){
        if(err){
            console.log(err)
            error(err);
        }else{
            success(result);
        }       
    })
}

module.exports.showAttributesXProductId = (idproduct,success,error)=>{
    let query = `SELECT * FROM attributes where product='${idproduct}';`;
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