const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createUser = (request, response) => {
  const { firstname, lastname, emailid, password } = request.body;
  pool.query(
    "SELECT * FROM users WHERE emailid = $1",
    [emailid],
    (err, res) => {
      if (err) {
        throw err;
      }
      if (res.rows.length == 0) {
        pool.query(
          "INSERT INTO users (firstname, lastname, emailid, password) VALUES ($1, $2, $3, $4) RETURNING *",
          [firstname, lastname, emailid, bcrypt.hashSync(password)],
          (err, res) => {
            if (err) {
              throw err;
            }
            const token = jwt.sign({ id: res.rows[0].id }, "ANEESH", {
              expiresIn: "5d",
            });
            response
              .cookie("token", token, {
                httpOnly: true,
                expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
              })
              .status(201)
              .send(
                `User added with ID: ${res.rows[0].id} and token: ${token}`
              );
          }
        );
      } else {
        return response.status(400).send("User exists!");
      }
    }
  );
};

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users", (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows);
  });
};

const loginUser = (request, response) => {
  let token;
  const { emailid, password } = request.body;
  pool.query(
    "SELECT * FROM users WHERE emailid = $1",
    [emailid],
    (err, res) => {
      if (err) {
        throw err;
      }
      if (res.rows.length != 0) {
        const comparePass = bcrypt.compareSync(password, res.rows[0].password);
        if (comparePass) {
          token = jwt.sign({ id: res.rows[0].id }, "ANEESH", {
            expiresIn: "5d",
          });
          return response
            .cookie("token", token, {
              httpOnly: true,
              expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
            })
            .send(`User with ID ${res.rows[0].id} logged in!`);
        } else {
          return response.status(400).send("Invalid ID/Password!");
        }
      } else {
        response.status(400).send("User does not Exist!");
      }
    }
  );
};

const logoutUser = (request, response) => {
  response.cookie("token", null, {
    httpOnly: true,
    expiresIn: new Date(Date.now()),
  });
  return response.json("User logged out!");
};

const getUserDetails = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM USERS WHERE ID = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).send(res.rows[0]);
  });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { firstname, lastname, emailid } = request.body;
  pool.query(
    "UPDATE products SET firstname = $1, lastname = $2, emailid = $3 WHERE id = $4",
    [firstname, lastname, emailid, id],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).send(`User updated with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM users WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  loginUser,
  logoutUser,
  getUserDetails,
  deleteUser,
};
