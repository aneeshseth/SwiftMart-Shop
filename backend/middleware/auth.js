const jwt = require("jsonwebtoken");
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const verify = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token.length);
  if (token.length < 10) {
    return res.send("Please login first!");
  }
  const decodedData = jwt.verify(token, "ANEESH");
  next();
};

module.exports = { verify };
