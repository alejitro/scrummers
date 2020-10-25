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

routr.get('/get/prd_attr/:idproduct/:idattribute',(req, res) => {
    inventoryServices.showInventoryXProductAndAttribute(
        req.params.idproduct,
        req.params.idattribute,
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
        req.body.idattribute,
        req.body.quantity,
        function(inventory){
            res.status(201).send({'exito':true,'message':`product ${inventory} updated succesfully`});
        },function(error){
            res.status(500).send({'message':'Error updating product'+error});
        }
    )

})

routr.delete('/delete/:id',(req, res) => {
    inventoryServices.deleteInventory(
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
