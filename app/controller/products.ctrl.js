'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express();
routr.use(fileUpload());
var productsServices = require('../services/products.srv.js');

routr.post('/create',(req, res) => {
    let multimedia
    if(req.files!=null){
        multimedia=req.files.multimedia
    }else{
        multimedia="no-file"
    }
    productsServices.createProduct(
        req.body.name,
        req.body.idstore,
        req.body.quantity,
        multimedia,
        req.body.urlstore,
        function(){
            res.status(201).send({'Success':true,'message':`product creation OK`});
        },function(error){
            res.status(500).send({'message':'Error creating product'+error});
        }
    )

})

routr.put('/update',(req, res) => {
    productsServices.updateProduct(
        req.body.name,
        req.body.idstore,
        req.body.urlstore,
        req.body.quantity,
        req.files.multimedia,
        function(archivo){
            res.status(201).send({'exito':true,'message':'archivo OK'});
        },function(error){
            res.status(500).send({'message':'Error en la creacion del archivo'+error});
        }
    )

})

routr.put('/update/inv/:quantity',(req, res) => {
    productsServices.updateProductInventory(
        req.body.idproduct,
        req.body.idstore,
        req.params.quantity,
        function(product){
            res.status(201).send({'exito':true,'message':`product ${product} inventory updated`});
        },function(error){
            res.status(500).send({'message':`Error updating product: `+error});
        }
    )

})

module.exports = routr;
