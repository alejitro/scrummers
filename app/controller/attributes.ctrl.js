'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express();
routr.use(fileUpload());
var attributesServices = require('../services/attributes.srv.js');

routr.post('/create',(req, res) => {
    attributesServices.createAttribute(
        req.body.name,
        req.body.description,
        req.body.idproduct,
        function(){
            res.status(201).send({'Success':true,'message':`attribute creation OK`});
        },function(error){
            res.status(500).send({'message':'Error creating attribute'+error});
        }
    )

})


routr.get('/get/product/:idproduct',(req, res) => {
    attributesServices.showAttributesXProductId(
        req.params.idproduct,
        function(attributes){
            res.status(200).send(attributes)
        },function(error){
            res.status(500).send({'message':'Error fectching attributes'+error});
        }
    )

})

routr.put('/update',(req, res) => {
    attributesServices.updateAttribute(
        req.body.idattribute,
        req.body.name,
        req.body.description,
        req.body.idproduct,
        function(attribute){
            res.status(201).send({'exito':true,'message':`product ${attribute} updated succesfully`});
        },function(error){
            res.status(500).send({'message':'Error updating product'+error});
        }
    )

})

routr.delete('/delete/:id',(req, res) => {
    attributesServices.deleteAttribute(
        req.params.id,
        req.body.idproduct,
        function(product){
            res.status(201).send({'exito':true,'message':`product ${product} deleted`});
        },function(error){
            res.status(500).send({'message':`Error deleting product: `+error});
        }
    )

})

module.exports = routr;
