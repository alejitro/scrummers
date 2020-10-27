'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express();
routr.use(fileUpload());
var productsServices = require('../services/products.srv.js');

//Ruta que permite crear productos en el sistema
//routr.post('/create',ensureToken,(req, res) => {
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
        req.body.store,
        req.body.urlstore,
        req.body.salesprice,
        req.body.attributes,
        req.body.quantity,
        function(product){
            res.status(201).send({'Success':true,'message':`${product}`});
        },function(error){
            res.status(500).send({'message':'Error creating product'+error});
        }
    )

})

//Ruta que permite mostrar los productos de una tienda por su id
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

//Ruta que permite mostrar los productos de una tienda por su URL
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

//Ruta que permite actualizar los productos del sistema
//routr.put('/update',ensureToken,(req, res) => {
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
        multimedia,
        req.body.urlstore,
        function(product){
            res.status(201).send({'exito':true,'message':`product ${product} updated succesfully`});
        },function(error){
            res.status(500).send({'message':'Error updating product'+error});
        }
    )

})

//Ruta que permite borrar los productos del sistema
//routr.delete('/delete/:id',ensureToken,(req, res) => {
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

//Funcion que permite garantizar que las peticiones de creacion, actualizacion
// y borrado de los productos sean hechas por un administrador
function ensureToken(req,res,next){
    const beareheader = req.headers['authorization'];
    console.log('bearerheader: '+beareheader);
    if(typeof beareheader != 'undefined'){
        const bearer = beareheader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        security.verifyToken(req.token).then(()=>{
            next();
        },()=>{
            res.status(403).send({'message':'Token incorrecto',});
        }
        )
    }else{
        res.status(403).send({'message':'No tiene token de autenticacion',});
    }
    
}

module.exports = routr;
