const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const getProducts = (request, response) => {
  pool.query("SELECT * FROM products", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const getProductById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM products WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const createProduct = (request, response) => {
  const { name, category, price } = request.body;
  pool.query(
    "INSERT INTO products (name, category, price, rating) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, category, price, 0],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(201).send(`Product added with ID: ${res.rows[0].id}`);
    }
  );
};

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, category, price } = request.body;
  pool.query(
    "UPDATE products SET name = $1, category = $2, price = $3 WHERE id = $4",
    [name, category, price, id],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).send(`Product updated with ID: ${id}`);
    }
  );
};

const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM products WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    res.status(200).send(`Product with id ${id} deleted`);
  });
};

module.exports = {
  deleteProduct,
  updateProduct,
  createProduct,
  getProductById,
  getProducts,
};
