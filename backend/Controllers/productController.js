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

const deleteImage = async (request, response) => {
  const { image } = request.body;
  const id = request.params.id;
  pool.query("SELECT * FROM PRODUCTS WHERE ID = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }

    const updatedImages = res.rows[0].images.filter((pic) => pic !== image);

    pool.query(
      "UPDATE PRODUCTS SET images = $1 WHERE ID = $2",
      [updatedImages, id],
      (err, res) => {
        if (err) {
          throw err;
        }
        response.send("Image deleted");
      }
    );
  });
};

const getProductById = (request, response) => {
  const id = request.params.id;
  pool.query("SELECT * FROM PRODUCTS WHERE ID = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows[0]);
  });
};

const createProduct = (request, response) => {
  const { name, category, price, isbn, images } = request.body;
  pool.query("SELECT * FROM PRODUCTS WHERE ISBN = $1", [isbn], (err, res) => {
    if (err) {
      throw err;
    }
    if (res.rowCount != 0) {
      return response.send("ISBN not unique!");
    } else {
      pool.query(
        "INSERT INTO products (name, category, price, isbn, images) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, category, price, isbn, images],
        async (err, res) => {
          console.log(price);
          if (err) {
            throw err;
          }
          const Product = await stripe.products.create({
            name: name,
          });
          const Price = await stripe.prices.create({
            unit_amount: price * 100,
            currency: "USD",
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
    }
  });
};

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, category, price, images } = request.body;
  pool.query(
    "UPDATE products SET name = $1, category = $2, price = $3, images = $4 WHERE id = $5",
    [name, category, price, images, id],
    async (err, res) => {
      if (err) {
        throw err;
      }
      const Product = await stripe.products.create({
        name: name,
      });
      const Price = await stripe.prices.create({
        unit_amount: price * 100,
        currency: "USD",
        product: Product.id,
      });
      pool.query(
        "UPDATE PRODUCTS SET price_id = $1 WHERE ID = $2",
        [Price.id, id],
        (err, res) => {
          if (err) {
            throw err;
          }
        }
      );
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
  deleteImage,
};
