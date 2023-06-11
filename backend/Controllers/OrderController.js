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
    res.status(200).send(`User with ID: ${id} deleted!`);
  });
};

const returnOrder = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "DELETE FROM USERORDERS WHERE product_id = $1",
    [id],
    (err, res) => {
      if (err) {
        throw err;
      }
    }
  );
  pool.query(
    "INSERT INTO USERRETURNS (user_id, product_id) VALUES ($1, $2) RETURNING * ",
    [request.user.id, id],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).json(`Product with ID ${id} added to return!`);
    }
  );
};

module.exports = { cancelOrder };
