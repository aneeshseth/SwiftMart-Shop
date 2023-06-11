const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const productRoutes = require("./Routes/productRoutes");
const userRoutes = require("./Routes/userRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.listen(3600, () => {
  console.log("App listening on port!");
});

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/ecom", userRoutes);
app.use("/ecom", productRoutes);
