/*
    @author - Himanshu
    @Date - Jan26, 2015
    @entry js file where all the routes and server configuration are mentioned
 */

"use strict"
//load all required module

const http = require('http');
const url = require('url');
let users = require('./controllers/users_controller.js');
let products = require('./controllers/products_controller.js');
/**
 * Creating the server with request and response parameters
 * request : standard request object
 * response : standard response object
 * server listen :   liting to 8002
 **/
const server = http.createServer(function(request,response){
  //get request url, provides url string
  let url_parts = url.parse(request.url);
  let slashLocation = url_parts.pathname.toString().substring(1).indexOf('/');
  let updatedPathName = url_parts.pathname;

  //get all controllers
  let userContoller = users(response);
  let productController = products(response);
  /*
    Create routes for each api using switch case, along with http method and call it's
    appropriate controller function if no route found redirect to 404 .
    - path name is key value for switch
   */
  switch (updatedPathName) {
    //route for home page
      case '/':
          if(request.method == 'GET'){
            userContoller.home();
          }else{
            response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
          }
          break;
      //route for user sign up
      case '/users/signup':
          if(request.method == 'POST'){
            //getting post request data wait for request to end the data and
            // call corrensponding controller action
            let postData = '';

            request.on('data', function (data) {
                postData += data;
             });
            request.on('end', function () {
              userContoller.sign_up(JSON.parse(postData),request.headers.api_key);
            });
          }else{
            response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
          }
          break;
          //routes responsible for user login
        case '/users/login':
            if(request.method == 'POST'){
              let userData = '';
              request.on('data', function (data) {
                  userData += data;
               });
              request.on('end', function () {
                userContoller.sign_in(JSON.parse(userData),request.headers.api_key);
              });
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
        //routes for creating the product
        case '/products/create':
            if(request.method == 'POST'){
              let productData = '';
              request.on('data', function (data) {
                  productData += data;
               });
              request.on('end', function () {
                productController.create_product(JSON.parse(productData),request.headers);
              });
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
        //route for deleting the product
        case '/products/delete':
            if(request.method == 'DELETE'){
              let id = url_parts.query.toString().split("=");
              let product_id = id[1];
                productController.delete_product(request.headers,parseInt(product_id));
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
            //route for delisting the product, Only admin has rights to do so
        case '/products/delist':
            if(request.method == 'POST'){
              let productId = '';
              request.on('data', function (data) {
                  productId += data;
               });
              request.on('end', function () {
                productController.delist_product(request.headers, JSON.parse(productId));
              });
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
        //get individual product detail route
        case '/products/detail':
            if(request.method == 'GET'){
              let id = url_parts.query.toString().split("=");
              let product_id = id[1];
                productController.view_product(request.headers,parseInt(product_id));
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
        //route for updating the product info
        case '/products/update':
            if(request.method == 'POST'){
              let productData = '';
              request.on('data', function (data) {
                  productData += data;
               });
              request.on('end', function () {
                productController.update_product(JSON.parse(productData),request.headers);
              });
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
            case '/api/auth':
                if(request.method == 'POST'){
                  let productData = '';
                  request.on('data', function (data) {
                      productData += data;
                   });
                  request.on('end', function () {
                    userContoller.api_auth(JSON.parse(productData));
                  });
                }else{
                  response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                }
                break;
          //route for searching the product
        case '/products/search':
              if(request.method == 'GET'){
                let param = url_parts.query.toString().split("&");
                let search_query = param[0].split("=")[1];
                let offset= param[1].split("=")[1];
                  productController.search_product(request.headers,search_query,offset);
              }else{
                response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
              }
            break;
        //default route if no match redirect to 404
        default:
                  console.log('404, Page not found');

                  response.end(JSON.stringify({"status":404,"message":"No page Found"}))
          };
}).listen(process.env.PORT || 5000)
