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
      return res.status(400).json({
        message: ";pl",
      });
    }
    return response.send(res.rows);
  });
};

module.exports = { getPaginatedProducts };
