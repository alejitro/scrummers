'use strict'
var express = require('express')
var routr = express();
var salesServices = require('../services/sales.srv.js');

routr.post('/create',(req, res) => {
    console.log("sales req", req.body);
    salesServices.createSale(
        req.body.idsale,
        req.body.idproduct,
        req.body.quantity,
        req.body.salesprice,
        req.body.taxes,
        function(){
            res.status(201).send({'Success':true,'message':`sale creation OK`});
        },function(error){
            res.status(500).send({'message':'Error creating sale'+error});
        }
    )

})


routr.get('/get/:idproduct',(req, res) => {
    salesServices.showSalesXProductId(
        req.params.idproduct,
        function(sales){
            res.status(200).send(sales)
        },function(error){
            res.status(500).send({'message':'Error fectching sales'+error});
        }
    )

})

routr.put('/update',(req, res) => {
    salesServices.updateSale(
        req.body.idattribute,
        req.body.name,
        req.body.description,
        req.body.idproduct,
        function(sale){
            res.status(201).send({'exito':true,'message':`sale ${sale} updated succesfully`});
        },function(error){
            res.status(500).send({'message':'Error updating product'+error});
        }
    )

})

routr.delete('/delete/:id',(req, res) => {
    salesServices.deleteSale(
        req.params.id,
        req.body.idproduct,
        function(sale){
            res.status(201).send({'exito':true,'message':`sale ${sale} deleted`});
        },function(error){
            res.status(500).send({'message':`Error deleting product: `+error});
        }
    )

})

module.exports = routr;
