var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt  = require('jsonwebtoken');
var serveIndex = require('serve-index');
const dotenv = require('dotenv');
dotenv.config( {path: "./environments/dev.env"});

const usersController = require('./app/controller/users.ctrl.js');
const storesController = require('./app/controller/stores.ctrl.js');
const productsController = require('./app/controller/products.ctrl.js');
const attributesController = require('./app/controller/attributes.ctrl.js');
const inventoryController = require('./app/controller/inventory.ctrl.js');
const multimediaController = require('./app/controller/multimedia.ctrl.js');
const salesController = require('./app/controller/sales.ctrl.js');

var app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Scrummer API",
      description: "Scrummer API Information",
      contact: {
        name: "Alejandro Martinez",
        email:"alejitro@gmail.com"
      },
      servers: ["http://localhost:8080"]
    }
  },
  apis: ["./app/controller/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.options('*', cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var http = require('http');
var server = http.createServer(app);
server.listen(8080, '0.0.0.0');
server.on('listening', function() {
    console.log('Express server started on port %s at %s at %s', server.address().port, server.address().address,process.env.HOST);
});

//app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/images', express.static(path.join(__dirname, 'public/images')));
app.use('/api/admin', [usersController]);
app.use('/api/store', [storesController]);
app.use('/api/product', [productsController]);
app.use('/api/attribute', [attributesController]);
app.use('/api/inventory', [inventoryController]);
app.use('/api/multimedia', [multimediaController]);
app.use('/api/sales', [salesController]);
app.use(express.static(path.join(__dirname, 'front/build')));
/*app.get('/*', function(req, res) {
    console.log('estatico')
    res.sendFile(path.join(__dirname, 'front/build', 'index.html'));
  });*/
module.exports = app;
