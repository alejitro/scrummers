'use strict';

const mysql = require('mysql');
const dotenv = require('dotenv');

let connection;
dotenv.config( {path: "./environments/dev.env"});

function connectDB(){
    if(!connection){
        connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER_DB,
            password: process.env.PASSWORD_DB,
            database: process.env.DATABASE,
            timeoutBeforeReconnection: process.env.timeoutBeforeReconnection
          });
        connection.connect((err)=>{
            if(!err)
                console.log(`Conexion BD ${process.env.DATABASE} OK`);
            else
                console.log(`Conexion errada BD ${process.env.DATABASE}: ` + err);
        })
    }
    return connection;
}


  module.exports = connectDB();
