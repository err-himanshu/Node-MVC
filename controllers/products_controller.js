/*
    @author - Himanshu
    User controller responsible to get the business login from models
     and send appropriate response to end user
 */


"use strict"
//load all modules
let products = require('../models/products.js');
let Auth = require('../models/authentication.js');

module.exports = function(response) {
    return {
      /**
       * [create_product function to create a product]
       * @param  {[Object]} postData [product info]
       * @param  {[obejct]} headers  [user headers]
       * @return {[Object]}          [success false or true ]
       */
        create_product: function(postData, headers) {
          console.log(postData);
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
                      }else{
                        //check for valid user authentication
                          Auth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"sucsess":false,"message":"user not authorized"}));
                              }else{
                                //if user valid insert product into database
                                  postData.user_id = headers.user_id;
                                  products.createProduct(postData, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                                    } else {
                                        response.end(JSON.stringify({"status":200,"sucsess":true,"data":result}));
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [delete_product function to delete a product, only creator can delete]
         * @param  {[object]} headers    [user headers]
         * @param  {[int]} product_id [product_id]
         * @return {[object]}            [success or failure]
         */
        delete_product: function(headers, product_id) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
                      }else{
                        //check for user authentication
                          Auth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"sucsess":false,"message":"user not authorized"}));
                              }else{
                                //if user is crator of product and valid also then delete product
                                  products.deleteProduct(headers.user_id,product_id, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === true){
                                        response.end(JSON.stringify({"status":200,"sucsess":true,"message":"Product deleted successfully"}));
                                      }else{
                                        response.end(JSON.stringify({"status":201,"sucsess":false,"message":"No Such product exists for user"}));
                                      }
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [delist_product admin can delist a product]
         * @param  {[Object]} headers [user info headers]
         * @param  {[int]} product [product_id]
         * @return {[Json]}         [description]
         */
        delist_product: function(headers, product) {
          console.log(product);
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
                      }else{
                        //check for valid user and having role of admin
                          Auth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"sucsess":false,"message":"user not authorized"}));
                              }else{
                                Auth.check_user_for_admin(headers.user_id,headers.auth_token, function(err, result) {
                                  if (err) {
                                      response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                                  } else {
                                    if(result === true){
                                      //delist product from database
                                      products.delistProduct(headers.user_id,product.product_id, function(err, result) {
                                        if (err) {
                                            response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                                        } else {
                                          if(result === true){
                                            response.end(JSON.stringify({"status":200,"sucsess":true,"message":"Product deactivated successfully successfully"}));
                                          }else{
                                            response.end(JSON.stringify({"status":201,"sucsess":false,"message":"No Such product exists for user"}));
                                          }
                                        }
                                    });
                                    }else{
                                      response.end(JSON.stringify({"status":201,"sucsess":false,"message":"Only admin can perform this action"}));
                                    }
                                  }
                              });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [view_product function to view product based on product_id]
         * @param  {[object]} headers    [user info]
         * @param  {[int]} product_id [product_id]
         * @return {[json]}            [description]
         */
        view_product: function(headers, product_id) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
                      }else{
                        //check for user authentication
                          Auth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"sucsess":false,"message":"user not authorized"}));
                              }else{
                                //get data of product for view
                                  products.viewSingleProduct(product_id, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === false){
                                        response.end(JSON.stringify({"status":201,"sucsess":false,"message":"No Such product exists for user"}));
                                      }else{
                                        //append product info and send
                                        let data = {
                                          "product_name" : result[0].product_name,
                                          "product_sku" : result[0].product_sku,
                                          "date_added" : result[0].date_added,
                                          "product_desc" : result[0].product_desc,
                                          "product_price" : result[0].product_price,
                                          "product_url" : result[0].product_url
                                        }
                                        response.end(JSON.stringify({"status":200,"sucsess":true,"data":data}));
                                      }
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [search_product function to search product on basis of query staring]
         * @param  {[object]} headers      [description]
         * @param  {[string]} search_query [description]
         * @return {[Json]}              [Product object]
         */
        search_product: function(headers, search_query,offset) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
                      }else{
                          Auth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"sucsess":false,"message":"user not authorized"}));
                              }else{
                                //search all product having same query string
                                  products.searchProduct(search_query,offset, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                                    } else {
                                        //let product = [];
                                        response.end(JSON.stringify({"status":200,"sucsess":true,"data":result}));
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [update_product function to update product info]
         * @param  {[object]} postData [product data]
         * @param  {[object]} headers  [user info]
         * @return {[json]}          [success/ failure]
         */
        update_product: function(postData, headers) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
                      }else{
                        //check for user authentication
                          Auth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"sucsess":false,"message":"user not authorized"}));
                              }else{
                                 postData.user_id = headers.user_id;
                                 //update product
                                  products.updateProduct(postData, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === false){
                                        response.end(JSON.stringify({"status":201,"sucsess":false,"message":"No Such product exists for user"}));
                                      }else{
                                        //get upadated product info and return
                                        let data = {
                                          "product_name" :  postData.product_name,
                                          "product_desc" :  postData.product_desc,
                                          "product_price" : postData.product_price,
                                          "product_url" :   postData.product_url,
                                          "product_id" :    postData.product_id
                                        }
                                        response.end(JSON.stringify({"status":200,"sucsess":true,"data":data}));
                                      }
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
    }
};
