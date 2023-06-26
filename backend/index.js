const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const productRoutes = require("./Routes/productRoutes");
const userRoutes = require("./Routes/userRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const ratingRoutes = require("./Routes/ratingRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const storage = new Multer.memoryStorage();
const { verify } = require("./middleware/auth");
const stripe = require("stripe")(
  "sk_test_51NGyPnEMVZmfmeX3pN6VkNqhUXaxsk9Rki3LhSbC0wiL1aAneCIhqw4s2UJi5Y41hqvc4WwS9YxOnDwFISent3f000VtbIgpfN"
);
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

cloudinary.config({
  cloud_name: "dhxeo4rvc",
  api_key: "893466947189135",
  api_secret: "d4PxfO7xK_WdQ1gqELCJ2JJB87E",
});

app.listen(3600, () => {
  console.log("App listening on port!");
});

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "image",
  });
  return res;
}

const upload = Multer({
  storage,
});

app.post("/upload", upload.single("my_file"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json({
      public_id: cldRes.public_id,
      ...cldRes,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
});

app.post("/create-checkout-session", verify, async (request, response) => {
  const { products } = request.body;
  let line_items = [];
  await Promise.all(
    products.map(async (product) => {
      try {
        const productResult = await pool.query(
          "SELECT * FROM PRODUCTS WHERE NAME = $1",
          [product]
        );
        const userCartResult = await pool.query(
          "SELECT * FROM USERCART WHERE PRODUCT_ID = $1 AND USER_ID = $2",
          [productResult.rows[0].id, request.user.id]
        );
        line_items.push({
          price: productResult.rows[0].price_id,
          quantity: userCartResult.rows[0].quantity,
        });
      } catch (err) {
        throw err;
      }
    })
  );
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `http://localhost:3001/products/${request.user.id}?success=true`,
    cancel_url: `http://localhost:3001/products/${request.user.id}?cancelled=true`,
  });
  response.json({ url: session.url });
});

app.use("/ecom", userRoutes);
app.use("/ecom", productRoutes);
app.use("/ecom", cartRoutes);
app.use("/ecom", orderRoutes);
app.use("/ecom", ratingRoutes);
