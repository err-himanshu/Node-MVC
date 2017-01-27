/**
 * @author - Himanshu
 * Product model represents all business logic of app for products,
 * all backeend code should be writeen here
 */
"use strict"
let db = require('../config/database.js');

//Export function

module.exports = {
  /**
   * [createProduct function to create a product]
   * @param  {[product info ]}   product  [description]
   * @param  {Function} callback [callback to product controller's create_product]
   * @return {[JSON ]}            [Object]
   */
  createProduct: function(product,callback) {
    //generate a unique product url
    let generatedProductUrl = module.exports.generate_product_url(product.product_name);
    product.product_url = generatedProductUrl;
    //insert into product database
    db.query('INSERT INTO products SET ?', product, function(error,result) {
        if (!error) {
          let data = {
            product_id : result.insertId,
            product_name : product.product_name,
            product_url: generatedProductUrl
          };
          //callback success
          callback(0, data);
        } else
        //callback failure
        callback(error);
    });
  },
  /**
   * [deleteProduct function to delete a product]
   * @param  {[int]}   user_id    [user_id]
   * @param  {[int]}   product_id [product_id]
   * @param  {Function} callback   [callback function]
   * @return {[JSON]}              [object]
   */
  deleteProduct: function(user_id,product_id, callback) {
    //check for valid user of this product
      module.exports.product_auth(user_id,product_id, function(err, result) {
        if (err) {
            callback(error);
        } else {
          //if valid delete from database
            if(result === true){
              db.query('DELETE FROM products WHERE id = ?', [product_id], function(error,result) {
                  if (!error) {
                    //callback
                    callback(0, true);
                  } else
                  callback(error);
              });
            }else{
              callback(0, false)
            }
        }
    });
  },
  /**
   * [delistProduct function to delist product from database]
   * @param  {[int]}   user_id    [user_id]
   * @param  {[int]}   product_id [product_id]
   * @param  {Function} callback   [callback]
   * @return {[JSON]}              [object]
   */
  delistProduct: function(user_id,product_id, callback) {
    //check if product exists or not call self module function using module.exports
      module.exports.check_product_exists(product_id, function(err, result) {
        if (err) {
            callback(err);
        } else {
          //if yes then set disable by setting active field false
            if(result === true){
              db.query('UPDATE products Set ? WHERE id = ?', [{ active:0 }, product_id], function(error,result) {
                  if (!error) {
                    callback(0, true);
                  } else
                  console.log(error);
                  callback(error);
              });
            }else{
              callback(0, false)
            }
        }
    });
  },
  /**
   * [viewSingleProduct function to view single prouct]
   * @param  {[int]}   product_id [description]
   * @param  {Function} callback   [description]
   * @return {[Json]}              [description]
   */
  viewSingleProduct: function(product_id, callback) {
    //check for product exists
      module.exports.check_product_exists(product_id, function(err, result) {
        if (err) {
            callback(error);
        } else {
          //get all info of active product with this id
            if(result === true){
              db.query('select * FROM products WHERE id = ? and active = 1', [product_id], function(error,result) {
                  if (!error) {
                    callback(0, result);
                  } else
                  callback(error);
              });
            }else{
              callback(0, false)
            }
        }
    });
  },
  /**
   * [searchProduct fucntion to search product basis on query string]
   * @param  {[string]}   search_query [description]
   * @param  {Function} callback     [description]
   * @return {[JSON]}                [description]
   */
  searchProduct: function(search_query,offset, callback) {
    //get all alike query products, using mysql-mongo namespace
          db.query('select product_name, product_desc,product_url,product_price,date_added FROM products where product_name LIKE ' + db.escape('%'+search_query+'%') + 'LIMIT 1 OFFSET ' + offset, function(error,result) {
              if (!error) {
                callback(0, result);
              } else
              console.log(error);
          });
  },
  /**
   * [updateProduct function to update a function ]
   * @param  {[type]}   product  [object]
   * @param  {Function} callback [description]
   * @return {[json]}            [description]
   */
  updateProduct: function(product, callback) {
    //check for valid product and it's creator
    //
      module.exports.product_auth(product.user_id,product.product_id, function(err, result) {
        if (err) {
          //if no callback failure
            callback(error);
        } else {
            if(result === true){
              //if yes update product info
              db.query('UPDATE products SET ? WHERE id = ?', [{ product_name:product.product_name , product_desc : product.product_desc,product_price : product.product_price}, product.product_id], function(error,result) {
                  if (!error) {
                    callback(0, result);
                  } else
                  callback(error);
              });
            }else{
              callback(0, false)
            }
        }
    });
  },
  /**
   * [generate_product_url function to generate random url and append to product_name]
   * @param  {[string]} product_name [description]
   * @return {[string]}              [product url]
   */
  generate_product_url : function(product_name){
    //get 6 random string and appned to product name
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&'
    let result = '';
    for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return product_name + '-' + result;
  },
  /**
   * [product_auth for checking product authentication if user created this product or nor ]
   * @param  {[int]}   user_id    [description]
   * @param  {[object]}   product_id [description]
   * @param  {Function} callback   [description]
   * @return {[JSON]}              [description]
   */
  product_auth : function(user_id,product_id,callback){
    //get user's product info
    db.query('SELECT count(*) as productCount FROM products WHERE id = ? and user_id = ? and active = 1', [product_id, user_id], function(error,rows) {
        if (!error) {
          if(rows[0].productCount){
            //if found callback success else failure
            callback(0, true);
          }else{
            callback(0,false);
            // response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
          }
        } else
        callback(error);
    });
  },
  /**
   * [check_product_exists checks if product exists and active in database]
   * @param  {[int]}   product_id [description]
   * @param  {Function} callback   [description]
   * @return {[Json]}              []
   */
  check_product_exists : function(product_id,callback){
    db.query('SELECT count(*) as productCount FROM products WHERE id = ? and  active = 1 ', [product_id], function(error,rows) {
        if (!error) {
          if(rows[0].productCount){
            callback(0, true);
          }else{
            callback(0,false);
            // response.end(JSON.stringify({"status":401,"sucsess":false,"message":"Not authorized"}));
          }
        } else
        callback(error);
    });
  }
};
