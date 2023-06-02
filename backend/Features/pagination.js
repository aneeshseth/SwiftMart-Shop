const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const getPaginatedProducts = (request, response) => {
  const { limit, page } = request.query;
  pool.query(
    "SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2",
    [
      limit,
      page * limit, //We start from the 0th page
    ],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).json(res.rows);
    }
  );
};

module.exports = { getPaginatedProducts };
