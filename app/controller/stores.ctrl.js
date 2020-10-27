'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express.Router();
var storeSrv = require('../services/stores.srv.js');
const security = require('../services/security.srv');

routr.use(fileUpload());

//Ruta que permite hacer la creacion de comercios en el sistema
//routr.post('/create',ensureToken,(req, res) => {
routr.post('/create',(req, res) => {

    let banner
    if (!req.files) {
        banner = null;
    }
    else{
        banner=req.files.banner
    }
    storeSrv.createStore(
        req.body.name,
        req.body.url,
        banner,
        req.body.idadmin,
        function (store) {
            res.status(201).send({'exito':true,'message':`Comercio ${store} creado exitosamente`})
        },function(error){
            res.status(500).send({'exito':false,'message':'Error en la creacion del comercio'});
            
        }
    )

})


//Ruta para obtener las tiendas asociadas a un administrador
routr.get('/get/admin/:idadmin', (req, res) => {
    storeSrv.showStoresXUser(
        req.params.idadmin,
        function (store) {
            res.status(200).send(store)
        },function(error){
            res.status(500).send({'message':'Error al obtener store por creador'})
        }
    )

})

//Ruta para obtener una tienda por URL
routr.get('/get/url/:url',(req, res) => {
    storeSrv.showStoreXURL(
        req.params.url,
        function (store) {
            res.status(200).send(store)
        },function(error){
            console.log(error)
            res.status(500).send({'message':'Error al obtener store por url'});
        }
    )

})

//Ruta para obtener una tienda por id
routr.get('/get/id/:id',(req, res) => {
    storeSrv.showStoreXid(
        req.params.id,
        function (store) {
            res.status(200).send(store)
        },function(error){
            console.log(error)
            res.status(500).send({'message':'Error al obtener store por url'});
        }
    )

})


//Ruta para obtener todos los comercios del sistema
routr.get('/get/all/',(req, res) => {
    storeSrv.showStores(
        function (store) {
            res.status(200).send(store);
            
        },function(error){
            console.log(error)
            res.status(500).send({'message':'Error al obtener los Stores'});
        }
    )
})

//Ruta que permite a un administrador borrar el comercio de acuerdo a su id
//routr.delete('/delete/:id/:idadmin',ensureToken, (req, res) => {
routr.delete('/delete/:id/:idadmin',(req, res) => {
    storeSrv.deleteStore(
        req.params.id,
        req.params.idadmin,
        function (store) {
            res.status(200).send({'message':'Se elimino exitosamente el store'})
        },function(error){
            res.status(500).send({'message':'Error al delete store'});
        }
    )

})

//Ruta que permite editar los comercios existentes en el sistema
routr.put('/edit',ensureToken,(req, res) => {
    let banner
    if (!req.files) {
        banner = null;
    }
    else{
        banner=req.files.banner
    }
    storeSrv.editStore(
        req.body.idstore,
        req.body.name,
        req.body.url,
        req.body.idadmin,
        banner,
        function (store) {
            res.status(200).send({'exito':true,'message':`Store ${store} updated succesfuly`})
        },function(error){
            console.log(error)
            res.status(500).send({'exito':false,'message':'Error al actualizar store'}); 
        }
    )

})

//Funcion que permite garantizar que las peticiones de creacion, actualizacion
// y borrado de los comercios sean hechas por un administrador
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