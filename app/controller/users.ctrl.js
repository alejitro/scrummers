'use strict'
var express = require('express')
var routr = express.Router();
var usersServices = require('../services/users.srv.js');

//Create admin Post request handler
routr.post('/create', (req, res) => {
    usersServices.createAdmin(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        function (iduser) {
            console.log("idUser",iduser)
            usersServices.loginAdmin(
                req.body.email,
                req.body.password,
                function (user) {
                    console.log("User",user)
                    res.status(201).send(user);
                },function(error){
                    res.status(403).send(error);
                }
            )

        },function(error){
            if(error.code === 'ER_DUP_ENTRY'){
                res.status(400).send({'message':'Ya existe un registro con ese correo'});
            }else{
                res.status(500).send({'message':'Error al crear administrador'});
            }
        }
    )

})


//Login admin Post request handler
routr.post('/login', (req, res) => {
    usersServices.loginAdmin(
        req.body.email,
        req.body.password,
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.status(500).send(error)
        }
    )

})

module.exports = routr;