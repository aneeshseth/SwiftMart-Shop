const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const getCartItems = (request, response) => {
  pool.query(
    "SELECT * FROM USERCART WHERE USER_ID = $1 ORDER BY PRODUCT_ID",
    [request.user.id],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).json(res.rows);
    }
  );
};

const getShippingAddress = (request, response) => {
  pool.query(
    "SELECT * FROM ADDRESS WHERE USER_ID = $1",
    [request.user.id],
    (err, res) => {
      if (err) {
        throw err;
      }
      return response.send(res.rows);
    }
  );
};

const getImageForCart = (request, response) => {
  const { name } = request.body;
  let arr = [];
  name.map((product) => {
    pool.query(
      "SELECT * FROM PRODUCTS WHERE NAME = $1",
      [product],
      (err, res) => {
        if (err) {
          throw err;
        }
        arr = [...arr, res.rows[0].images[0]];
      }
    );
  });
  return response.send(arr);
};

const addToCart = (request, response) => {
  const { user_id, product_id } = request.body;
  pool.query(
    "SELECT * FROM USERCART WHERE PRODUCT_ID = $1",
    [product_id],
    (err, res) => {
      if (err) {
        throw err;
      }
      if (res.rowCount < 1) {
        pool.query(
          "INSERT INTO USERCART (USER_ID, PRODUCT_ID, QUANTITY) VALUES ($1, $2, $3)",
          [request.user.id, product_id, 1],
          (err, res) => {
            if (err) {
              throw err;
            }
            response.status(200).send(`Product with ID ${product_id} is added`);
          }
        );
      } else {
        pool.query(
          "UPDATE USERCART SET QUANTITY = $1 WHERE PRODUCT_ID=$2",
          [res.rows[0].quantity + 1, product_id],
          (err, res) => {
            if (err) {
              throw err;
            }
            return response
              .status(200)
              .send(`Product with ID ${product_id} is added`);
          }
        );
      }
    }
  );
};

const updateQuanity = (request, response) => {
  const { newQuantity } = request.body;
  const id = request.params.id;
  pool.query(
    "UPDATE USERCART SET QUANTITY = $1 WHERE PRODUCT_ID = $2",
    [newQuantity, id],
    (err, res) => {
      if (err) {
        throw err;
      }
      return response.status(200).send("Updated!");
    }
  );
};

const deleteFromCart = (request, response) => {
  const id = request.params.id;
  pool.query("DELETE FROM USERCART WHERE PRODUCT_ID = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    return response.status(200).send("Product deleted from cart!");
  });
};

module.exports = {
  getCartItems,
  addToCart,
  updateQuanity,
  deleteFromCart,
  getImageForCart,
  getShippingAddress,
};
