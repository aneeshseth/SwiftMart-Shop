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
  if (!token || token.length < 10) {
    return res.send("Please login first!");
  }
  const decodedData = jwt.verify(token, "ANEESH");
  next();
};

const authorizeRole = (req, res, next) => {
  const token = req.cookies.token;
  if (!token || token.length < 1) {
    return res.send("Please login first!");
  }
  const decodedData = jwt.verify(token, "ANEESH");
  let id = decodedData.id;
  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, response) => {
    if (err) {
      throw err;
    }
    if (response.rows[0].role == null || response.rows[0].role == "user") {
      return res.send("You don't have access to this resource!");
    } else {
      next();
    }
  });
};

module.exports = { verify, authorizeRole };
