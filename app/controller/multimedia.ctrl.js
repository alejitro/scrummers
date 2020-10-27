'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express();
routr.use(fileUpload());
var attributesServices = require('../services/multimedia.srv.js');

routr.post('/create',(req, res) => {
    attributesServices.createMultimedia(
        req.body.idproduct,
        req.files.file,
        function(){
            res.status(201).send({'Success':true,'message':`attribute creation OK`});
        },function(error){
            res.status(500).send({'message':'Error creating attribute'+error});
        }
    )

})


routr.get('/get/multimedia/:idproduct',(req, res) => {
    attributesServices.showMultimediaXProductId(
        req.params.idproduct,
        function(multimedia){
            res.status(200).send(multimedia)
        },function(error){
            res.status(500).send({'message':'Error fectching multimedia'+error});
        }
    )

})

routr.put('/update',(req, res) => {
    attributesServices.updateMultimedia(
        req.body.idproduct,
        req.files.file,
        function(attribute){
            res.status(201).send({'exito':true,'message':`multimedia ${attribute} updated succesfully`});
        },function(error){
            res.status(500).send({'message':'Error updating multimedia'+error});
        }
    )

})

routr.delete('/delete/:id',(req, res) => {
    attributesServices.deleteMultimedia(
        req.body.idproduct,
        function(multimedia){
            res.status(201).send({'exito':true,'message':`multimedia ${multimedia} deleted`});
        },function(error){
            res.status(500).send({'message':`Error deleting multimedia: `+error});
        }
    )

})

module.exports = routr;
