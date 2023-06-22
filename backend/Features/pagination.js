const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const getPaginatedProducts = (request, response) => {
  pool.query("SELECT * FROM products", (err, res) => {
    if (err) {
      throw err;
    }
    return response.send(res.rows);
  });
};

const sliderProducts = (request, response) => {
  const { low, high } = request.query;
  pool.query(
    "SELECT * FROM products WHERE PRICE BETWEEN $1 AND $2",
    [low, high],
    (err, res) => {
      if (err) {
        throw err;
      }
      return response.send(res.rows);
    }
  );
};

module.exports = { getPaginatedProducts, sliderProducts };
