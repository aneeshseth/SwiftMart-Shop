const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const filteringByAlphabetASC = (request, response) => {
  pool.query("SELECT * FROM products ORDER BY name", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const filteringByAlphabetDESC = (request, response) => {
  pool.query("SELECT * FROM products ORDER BY name DESC", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const filteringByPriceASC = (request, response) => {
  pool.query("SELECT * FROM products ORDER BY price ASC", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const filteringByPriceDESC = (request, response) => {
  pool.query("SELECT * FROM products ORDER BY price DESC", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

//Filtering by category

const filteringByCategory = (request, response) => {
  const { category } = request.query;
  pool.query(
    "SELECT * FROM products WHERE category = $1",
    [category],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).json(res.rows);
    }
  );
};
const filteringByRating = async (request, response) => {
  const { rows } = await pool.query(
    "SELECT * FROM REVIEWS ORDER BY RATING DESC"
  );
  let products = [];
  const iterations = Math.min(rows.length, 6);
  for (let i = 0; i < iterations; i++) {
    const row = rows[i];
    const productResult = await pool.query(
      "SELECT * FROM PRODUCTS WHERE ID = $1",
      [row.product_id]
    );
    products.push(productResult.rows[0]);
  }
  response.send(products);
};

module.exports = {
  filteringByAlphabetASC,
  filteringByAlphabetDESC,
  filteringByCategory,
  filteringByPriceASC,
  filteringByPriceDESC,
  filteringByRating,
};
