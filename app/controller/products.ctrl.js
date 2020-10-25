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
        multimedia,
        req.body.price,
        req.body.quantity,
        req.body.store,
        req.body.urlstore,
        req.body.salesprice,
        function(){
            res.status(201).send({'Success':true,'message':`product creation OK`});
        },function(error){
            res.status(500).send({'message':'Error creating product'+error});
        }
    )

})

routr.get('/get/store/:idstore',(req, res) => {
    productsServices.showProductsXStoreId(
        req.params.idstore,
        function(products){
            res.status(200).send(products)
        },function(error){
            res.status(500).send({'message':'Error fectching product'+error});
        }
    )

})

routr.get('/get/store/url/:urlstore',(req, res) => {
    console.log('url: ',req.params.urlstore)
    productsServices.showProductsXStoreUrl(
        req.params.urlstore,
        function(products){
            res.status(200).send(products)
        },function(error){
            res.status(500).send({'message':'Error fetching product'+error});
        }
    )

})

routr.put('/update',(req, res) => {
    let multimedia
    if(req.files!==null){
        multimedia=req.files.multimedia
    }else{
        multimedia="no-file"
    }
    productsServices.updateProduct(
        req.body.idproduct,
        req.body.name,
        req.body.idstore,
        req.body.quantity,
        multimedia,
        req.body.urlstore,
        function(product){
            res.status(201).send({'exito':true,'message':`product ${product} updated succesfully`});
        },function(error){
            res.status(500).send({'message':'Error updating product'+error});
        }
    )

})

routr.delete('/delete/:id',(req, res) => {
    productsServices.deleteProduct(
        req.params.id,
        req.body.idstore,
        req.body.name,
        function(product){
            res.status(201).send({'exito':true,'message':`product ${product} deleted`});
        },function(error){
            res.status(500).send({'message':`Error deleting product: `+error});
        }
    )

})

module.exports = routr;
