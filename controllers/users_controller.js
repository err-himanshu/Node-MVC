/*
    @author - Himanshu
    User controller responsible to get the business login from models
     and send appropriate response to end user
 */

"use strict"
//include all modules
let users = require('../models/users.js');
let apiAuth = require('../models/authentication.js');

// Export functions
module.exports = function(response) {
    return {
        home: function() {
            response.end(JSON.stringify({"status":200,"sucsess":true,"message":"Wingify Online Store challenge welcomes you"}));
        },
      /**
       * [user registartion function based on their role]
       * @param  {[object]} postData [user data (email, password, user_role - admin or user)]
       * @param  {[string]} api_key  [api authentication key]
       * @return {[object]}          [json success/failure object]
       */
        sign_up: function(postData,api_key) {
          console.log(postData.password);
            if(postData.user_role != undefined && postData.user_role != null && postData.email != undefined && postData.email != null && postData.password != undefined && postData.password != null){
          //check for valid api authentication
                  apiAuth.api_authentication(api_key, function(err, result) {
                    if (err) {
                        //Database error
                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                    } else {
                      //if api authentication failed return false message
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
                      }else{
                        //if api authentication sucess process to user sign up
                          users.signUp(postData, function(err, result) {
                            //send success response in case success registration
                            //@return user_id, auth_token and user email
                            if (err) {
                                response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Email id already exists"}));
                            } else {
                                response.end(JSON.stringify({"status":200,"sucsess":true,"data":result}));
                            }
                        });
                      }
                    }
                });
              }else{
                response.end(JSON.stringify({"status":202,"sucsess":false,"message":"Invalid parameters"}));
              }
        },
        /**
         * [sign_in function to sign in user in this platform]
         * @param  {[object]} userData [user email and password]
         * @param  {[string]} api_key  [api_key]
         * @return {[object]}          [Json object]
         */
        sign_in: function(userData,api_key) {
          if(userData.email == undefined || userData.email == null || userData.password || null || userData.password == undefined){
          //check for valid api authentication
                  apiAuth.api_authentication(api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
                      }else{
                        //if api_key is valid and no serevr error process to login
                          users.login(userData, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":203,"sucsess":false,"message":"Invalid server error"}));
                            } else {
                                response.end(JSON.stringify({"status":200,"sucsess":true,"data":result}));
                            }
                        });
                      }
                    }
                });
              }else{
                response.end(JSON.stringify({"status":500,"sucsess":false,"message":"Internal server error"}));
              }
        },
        api_auth: function(data) {
                    //if api_key is valid and no serevr error process to login
                      users.createApi(data, function(err, result) {
                        if (err) {
                            response.end(JSON.stringify({"status":203,"sucsess":false,"message":"Invalid server error"}));
                        } else {
                            response.end(JSON.stringify({"status":200,"sucsess":true,"data":"api auth created successfully"}));
                        }
                    });
        }
    }
};
