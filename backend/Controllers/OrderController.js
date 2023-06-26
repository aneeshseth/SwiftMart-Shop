const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const cancelOrder = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM USERORDERS WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).send(`User with ID: ${id} deleted!`);
  });
};

const getOrders = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM USERORDERS WHERE USER_ID=$1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    return response.send(res.rows);
  });
};
const updateStatus = (request, response) => {
  const { status } = request.body;
  const id = request.params.id;
  pool.query(
    "UPDATE USERORDERS SET STATUS = $1 WHERE ID = $2",
    [status, id],
    (err, res) => {
      if (err) {
        throw err;
      }
      return response.send("Updated Status!");
    }
  );
};
const getOrder = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM USERORDERS WHERE ID = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    return response.send(res.rows[0]);
  });
};

const getAllOrders = (request, response) => {
  pool.query("SELECT * FROM USERORDERS", (err, res) => {
    if (err) {
      throw err;
    }
    return response.send(res.rows);
  });
};

const createOrder = (request, response) => {
  const id = request.params.id;
  pool.query("SELECT * FROM USERCART WHERE USER_ID=$1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    res.rows.map((row) =>
      pool.query(
        "INSERT INTO USERORDERS (USER_ID, PRODUCT_ID, TIMESTAMP, QUANTITY) VALUES ($1, $2, $3, $4)",
        [row.user_id, row.product_id, new Date(Date.now()), row.quantity],
        (err2, res2) => {
          if (err2) {
            throw err2;
          }
        }
      )
    );
    pool.query("DELETE FROM USERCART WHERE USER_ID = $1", [id], (err, res) => {
      if (err) {
        throw err;
      }
    });
    return response.send("Operation Done!");
  });
};

const totalOrderRevenue = async (request, response) => {
  let sum = 0;
  const userOrders = await pool.query("SELECT * FROM USERORDERS");
  for (const row of userOrders.rows) {
    const product = await pool.query("SELECT * FROM PRODUCTS WHERE ID = $1", [
      row.product_id,
    ]);
    sum += product.rows[0].price * row.quantity;
  }
  response.send(sum.toString());
};

module.exports = {
  cancelOrder,
  createOrder,
  getOrders,
  totalOrderRevenue,
  getAllOrders,
  getOrder,
  updateStatus,
};
