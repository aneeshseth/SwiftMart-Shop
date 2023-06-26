const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const getPaginatedProducts = (request, response) => {
  const { search } = request.body;
  if (search == "") {
    pool.query("SELECT * FROM products", (err, res) => {
      if (err) {
        throw err;
      }
      return response.send(res.rows);
    });
  } else {
    const searchTerms = search.split(" ").filter((term) => term.trim() !== "");
    const tsQuery = searchTerms.map((term) => term + ":*").join(" & ");
    pool.query(
      "SELECT * FROM PRODUCTS WHERE to_tsvector('simple', name) @@ to_tsquery('simple', $1) UNION SELECT * FROM PRODUCTS WHERE to_tsvector('simple', category) @@ to_tsquery('simple', $1)",
      [tsQuery],
      (err, res) => {
        if (err) {
          throw err;
        }
        return response.send(res.rows);
      }
    );
  }
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
