'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express();
routr.use(fileUpload());
var inventoryServices = require('../services/inventory.srv.js');


routr.post('/create',(req, res) => {
    inventoryServices.createInventory(
        req.body.product,
        req.body.attribute,
        req.body.quantity,
        function(){
            res.status(201).send({'Success':true,'message':`inventory creation OK`});
        },function(error){
            res.status(500).send({'message':'Error creating inventory'+error});
        }
    )

})

routr.get('/get/product/:idproduct',(req, res) => {
    inventoryServices.showInventoryXProductId(
        req.params.idproduct,
        function(inventory){
            res.status(200).send(inventory)
        },function(error){
            res.status(500).send({'message':'Error fectching inventory'+error});
        }
    )
})

routr.get('/get/attribute/:idattribute',(req, res) => {
    inventoryServices.showInventoryXAttributeId(
        req.params.idattribute,
        function(inventory){
            res.status(200).send(inventory)
        },function(error){
            res.status(500).send({'message':'Error fectching inventory'+error});
        }
    )

})

routr.get('/get/store/:idstore/:idproduct',(req, res) => {
    inventoryServices.showInventoryXStore(
        req.params.idstore,
        req.params.idproduct,
        function(inventory){
            res.status(200).send(inventory)
        },function(error){
            res.status(500).send({'message':'Error fectching inventory'+error});
        }
    )

})

routr.put('/update',(req, res) => {
    inventoryServices.updateInventory(
        req.body.idproduct,
        req.body.quantity,
        function(inventory){
            res.status(201).send({'exito':true,'message':`inventory ${inventory} updated succesfully`});
        },function(error){
            res.status(500).send({'message':'Error updating inventory'+error});
        }
    )

})

routr.delete('/delete/:id',(req, res) => {
    inventoryServices.deleteInventory(
        req.params.id,
        req.body.idproduct,
        function(inventory){
            res.status(201).send({'exito':true,'message':`inventory ${inventory} deleted`});
        },function(error){
            res.status(500).send({'message':`Error deleting inventory: `+error});
        }
    )

})

module.exports = routr;
