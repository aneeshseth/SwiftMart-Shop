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
  try {
    const cookieString = req.headers.cookie;
    const cookies = cookieString.split("; ");
    let token = null;
    for (const cookie of cookies) {
      if (cookie.startsWith("token=")) {
        token = cookie.split("=")[1];
        break;
      }
    }
    if (!token) {
      return res.json({
        message: "No token",
      });
    }
    jwt.verify(token, "ANEESH", (err, res) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      req.user = res;
      next();
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
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

/*

login 
signup
products displayed, each product multiple images, reviews, ratings
navbar - web name, sort, filter, cart, profile (update profile, update password), about - (about this project), cart, myorders (orderid, status), myreturns
pagination
checkout -

/admin

display all products (add, delete, update, show stock)
orders (all orders from users, changing order statuses, stock - 1 when order completed)
users (all users and their details and ability to update each ones)

*/
