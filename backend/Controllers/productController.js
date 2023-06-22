const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});
const stripe = require("stripe")(
  "sk_test_51NGyPnEMVZmfmeX3pN6VkNqhUXaxsk9Rki3LhSbC0wiL1aAneCIhqw4s2UJi5Y41hqvc4WwS9YxOnDwFISent3f000VtbIgpfN"
);

const getProductByName = (request, response) => {
  const id = request.params.id;
  pool.query("SELECT * FROM products WHERE name = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const getProductById = (request, response) => {
  const id = request.params.id;
  pool.query("SELECT * FROM PRODUCTS WHERE ID = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const createProduct = (request, response) => {
  const { name, category, price, isbn } = request.body;
  pool.query(
    "INSERT INTO products (name, category, price, isbn) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, category, price, isbn],
    async (err, res) => {
      if (err) {
        throw err;
      }
      const Product = await stripe.products.create({
        name: name,
      });
      const Price = await stripe.prices.create({
        unit_amount: price,
        currency: "AED",
        recurring: { interval: "year" },
        product: Product.id,
      });
      pool.query(
        "UPDATE PRODUCTS SET price_id = $1 WHERE NAME=$2",
        [Price.id, name],
        (err, res) => {
          if (err) {
            throw err;
          }
          response.status(201).send(`Product added!`);
        }
      );
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
  console.log(id);
  pool.query("DELETE FROM products WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).send(`Product with id ${id} deleted`);
  });
};

module.exports = {
  deleteProduct,
  updateProduct,
  createProduct,
  getProductByName,
  getProductById,
};
