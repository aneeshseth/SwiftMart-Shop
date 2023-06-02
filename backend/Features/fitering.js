const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

//Filtering by alphabets

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

//Filtering by Price

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

//Filtering by specific prices

const filteringBySpecificPrice = (request, response) => {
  const { low, high } = request.query;
  pool.query(
    "SELECT * FROM products WHERE price BETWEEN $1 AND $2",
    [parseInt(low), parseInt(high)],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).json(res.rows);
    }
  );
};

//Filtering by rating

const filteringByRatingASC = (request, response) => {
  pool.query("SELECT * FROM products ORDER BY rating ASC", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const filteringByRatingDESC = (request, response) => {
  pool.query("SELECT * FROM products ORDER BY rating DESC", (err, res) => {
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

module.exports = {
  filteringByAlphabetASC,
  filteringByAlphabetDESC,
  filteringByCategory,
  filteringByPriceASC,
  filteringByPriceDESC,
  filteringByRatingASC,
  filteringByRatingDESC,
  filteringBySpecificPrice,
};
