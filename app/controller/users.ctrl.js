'use strict'
var express = require('express')
var routr = express.Router();
var usersServices = require('../services/users.srv.js');



/**
* @swagger
* /users:
*   post:
*     tags:
*       — User
*     summary: This should create a new admin.
*     description: This is where you can create a new admin for the system
*     consumes:
*       — application/json
*     parameters:
*       — firstName: body
*       LastName: body
*       email: body    
*       password: body
*       schema:
*         type: object
*         properties:
*           flavor:
*           type: string
*     responses: 
*       201:
*         description: Receive user id, email and JWToken
*/

//Ruta que permite la creacion de administradores en el sistema
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


//Ruta que permite hacer login a los administradores del sistema
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