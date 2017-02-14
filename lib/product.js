var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');

function productRoute() {
  var product = new express.Router();
  product.use(cors());
  product.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  product.get('/', function(req, res) {
    console.log(new Date(), 'In product route GET / req.query=', req.query);
    var world = req.query && req.query.product ? req.query.product : 'World';

    // see http://expressjs.com/4x/api.html#res.json
    res.json({msg: 'Hello ' + world});
  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  product.post('/', function(req, res) {
    //console.log(new Date(), 'In product route POST / req.body=', req.body);
    //var world = req.body && req.body.product ? req.body.product : 'World';
   // var url = "http://backend-rest-wohshon.44fs.preview.openshiftapps.com/products";
    var token=req.body.access_token;
    console.log(token);
    console.log(req.body.test);
    var url = "http://192.168.223.130:3000/products";
    request({
      json : true,
      url : url,
      headers : {
        
        'Authorization' : 'bearer '+token
      }      
    }, function(err, response, body){
      if (err || !body){
        console.log(res.status());
        return res.status(500).json(err || "No product found");
      }
      
      console.log(body);
      //quick hack
      //products=JSON.stringify("["+body+"]");
      //console.log(products);
      if (body!='Access denied') {
        var products=JSON.stringify(body);
        console.log("====="+products)

        var Jsonproducts=JSON.parse(products);
        console.log(Jsonproducts.length);
        return res.json({products: Jsonproducts});
      }
      else  {
        return res.json({products: "Access denied"});
      }
    });    
  });
  return product;
}

module.exports = productRoute;
