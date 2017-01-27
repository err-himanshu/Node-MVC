/**
 * @author - Himanshu
 * User model represents all business logic of app, all backeend code should be writeen here
 */

"use strict"
//load modules
let db = require('../config/database.js');

//Export functions
module.exports = {
  /**
   * [signUp for user registration ]
   * @param  {[object]}   userData [user data]
   * @param  {Function} callback [callback function for user controller sign_up method]
   * @return {[object]}            [User information]
   */
  signUp: function(userData,callback) {
    //generate user auth_token
    let auth_token = module.exports.generate_auth_token();
    userData.auth_token = auth_token;
    //insert user detain into databse
    db.query('INSERT INTO users SET ?', userData, function(error,result) {
        if (!error) {
          let data = {
            user_id : result.insertId,
            email : userData.email,
            auth_token: userData.auth_token
          };
          //callback to controllers
          callback(0, data);
        } else
        callback(error);
    });
  },
  /**
      function for creating auth api
  */
  createApi: function(data,callback) {
    //insert user detain into databse
    db.query('INSERT INTO api_auth SET ?', data, function(error,result) {
        if (!error) {
          //callback to controllers
          callback(0, result);
        } else
        callback(error);
    });
  },
  /**
   * [login function to login user]
   * @param  {[object]}   userData [email , password]
   * @param  {Function} callback [contrller's sign_in method]
   * @return {[object]}            [User information]
   */
  login: function(userData,callback) {
    console.log(userData.email);
    //get user's information
    db.query('select id, email, auth_token from users where email = ? and password = ?', [userData.email, userData.password], function(error,result) {
        if (!error) {
          console.log(result);
          if(result.length > 0)
          callback(0, result);
        } else
        callback(error);
    });
  },
  /**
   * [generate_auth_token generate user's auth token]
   * @return {[auth_token]} [description]
   */
  generate_auth_token : function(){
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&'
    let result = '';
    for (let i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
};
