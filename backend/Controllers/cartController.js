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
    "SELECT * FROM USERCART WHERE USER_ID = $1",
    [request.user.id],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).json(res.rows);
    }
  );
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

const deleteFromCart = (request, response) => {
  const { user_id, product_id } = request.body;
  pool.query(
    "DELETE FROM USERCART WHERE USER_ID = $1 AND PRODUCT_ID = $2",
    [user_id, product_id],
    (err, res) => {
      if (err) {
        throw err;
      }
      return response.status(200).send("Product deleted from cart!");
    }
  );
};

module.exports = { getCartItems, addToCart, deleteFromCart };
