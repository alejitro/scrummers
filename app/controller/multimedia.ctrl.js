'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express();
routr.use(fileUpload());
var fileServices = require('../services/multimedia.srv.js');

routr.post('/create',(req, res) => {
    fileServices.createMultimedia(
        req.body.idstore,
        req.body.idproduct,
        req.files.file,
        function(){
            res.status(201).send({'Success':true,'message':`multimedia creation OK`});
        },function(error){
            res.status(500).send({'message':'Error creating multimedia'+error});
        }
    )

})


routr.get('/get/:idproduct',(req, res) => {
    fileServices.showMultimediaXProductId(
        req.params.idproduct,
        function(multimedia){
            res.status(200).send(multimedia)
        },function(error){
            res.status(500).send({'message':'Error fectching multimedia'+error});
        }
    )

})

routr.put('/update',(req, res) => {
    fileServices.updateMultimedia(
        req.body.idproduct,
        req.files.file,
        function(multimedia){
            res.status(201).send({'exito':true,'message':`multimedia ${multimedia} updated succesfully`});
        },function(error){
            res.status(500).send({'message':'Error updating multimedia'+error});
        }
    )

})

routr.delete('/delete/:id',(req, res) => {
    fileServices.deleteMultimedia(
        req.body.idproduct,
        function(multimedia){
            res.status(201).send({'exito':true,'message':`multimedia ${multimedia} deleted`});
        },function(error){
            res.status(500).send({'message':`Error deleting multimedia: `+error});
        }
    )

})

module.exports = routr;
