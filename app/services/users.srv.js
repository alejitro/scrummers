'use strict'

const security = require('../services/security.srv');
var db = require('../../db.js')


//Admin user creation
//Function that allow create an admin in the app
module.exports.createAdmin = (firstName,lastName,email,password,success,error)=>{
    
    let query = `INSERT INTO user (firstName,lastName,email,password) VALUES (?, ?, ?, ?);`;
    db.query(query,[firstName,lastName,email,password],function(err,result){
        if(err){
            throw err;
        }
        success(result);
    })
}

//Admin user login
//Function that allow admin to login in the app
module.exports.loginAdmin = (email, password, success, error) => {
    let query = `SELECT * FROM user where email='${email}' and password='${password}';`;
    db.query(query,function(err,result){
        if(err){
            error(err);
        }else{
            if(result!=undefined){
                console.log("Result",result[0].id)
                if (result[0].password === password) {
                    let user = result[0].id;
                    let email = result[0].email;
                    security.generateToken(email).then(function(result){
                        success({'exito':true,'JWToken':result,'iduser':user,'email':email});
                    });  
                }else{
                    error({'exito':false,'message': 'Contraseña errada'});
                }
            }else{
                error({'exito':false,'message': 'Correo no registrado'});
            }
        }
    
    })

}
   