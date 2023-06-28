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
const createUser = async (request, response) => {
  const {
    firstname,
    lastname,
    emailid,
    password,
    retypePass,
    imageUrl,
    country,
    state,
    street,
  } = request.body;
  pool.query(
    "SELECT * FROM users WHERE emailid = $1",
    [emailid],
    (err, res) => {
      if (err) {
        throw err;
      }
      if (res.rows.length == 0) {
        if (password != retypePass) {
          return response.status(400).send("Passwords dont match!");
        }
        pool.query(
          "INSERT INTO users (firstname, lastname, emailid, password, role, profilepic) VALUES ($1, $2, $3, $4, 'user', $5) RETURNING *",
          [
            firstname.toLowerCase(),
            lastname.toLowerCase(),
            emailid.toLowerCase(),
            bcrypt.hashSync(password),
            imageUrl,
          ],
          (err, res) => {
            if (err) {
              throw err;
            }
            pool.query(
              "INSERT INTO ADDRESS (USER_ID, STREET, STATE, COUNTRY) VALUES ($1, $2, $3, $4)",
              [res.rows[0].id, street, state, country]
            );
            const token = jwt.sign({ id: res.rows[0].id }, "ANEESH", {
              expiresIn: "3hr",
            });
            response
              .cookie("token", token, {
                httpOnly: true,
                expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
              })
              .status(201)
              .json({ id: `${res.rows[0].id}` });
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
  const { emailid, password } = request.body;
  pool.query(
    "SELECT * FROM users WHERE emailid = $1",
    [emailid.toLowerCase()],
    (err, res) => {
      if (err) {
        throw err;
      }
      if (res.rows.length != 0) {
        const comparePass = bcrypt.compareSync(password, res.rows[0].password);
        if (comparePass) {
          token = jwt.sign({ id: res.rows[0].id }, "ANEESH", {
            expiresIn: "3hr",
          });
          response.cookie("token", token, {
            httpOnly: true,
            expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
          });
          return response.json({
            id: `${res.rows[0].id}`,
            token: token,
          });
        } else {
          return response.status(400).send("Invalid ID/Password!");
        }
      } else {
        response.status(400).send("User does not Exist!");
      }
    }
  );
};

const getRole = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM USERS WHERE ID = $1", [id], (err, res) => {
    if (err) {
      console.log("error has happened");
      throw err;
    }
    return response.status(200).json(res.rows[0].role);
  });
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

const getLoggedInUser = (request, response) => {
  pool.query(
    "SELECT * FROM USERS WHERE ID = $1",
    [request.user.id],
    (err, res) => {
      if (err) {
        throw err;
      }
      return response.send(res.rows[0]);
    }
  );
};
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { firstname, lastname, emailid, imageUrl } = request.body;
  pool.query(
    "UPDATE users SET firstname = $1, lastname = $2, emailid = $3, profilepic = $4 WHERE id = $5",
    [firstname, lastname, emailid, imageUrl, id],
    (err, res) => {
      if (err) {
        throw err;
      }
      response.status(200).send(`User updated with ID: ${id}`);
    }
  );
};

const updateUserAdminSide = (request, response) => {
  const id = parseInt(request.params.id);
  const { firstname, lastname, emailid, role, street, country, state } =
    request.body;
  pool.query(
    "UPDATE users SET firstname = $1, lastname = $2, emailid = $3, role=$4 WHERE id = $5",
    [firstname, lastname, emailid, role, id],
    (err, res) => {
      if (err) {
        throw err;
      }
      pool.query(
        "UPDATE ADDRESS SET STREET = $1, COUNTRY = $2, STATE = $3 WHERE USER_ID = $4",
        [street, country, state, id],
        (err, res) => {
          if (err) {
            throw err;
          }
        }
      );
      response.status(200).send(`User updated with ID: ${id}`);
    }
  );
};

const getAddress = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM ADDRESS WHERE USER_ID = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    return response.send(res.rows);
  });
};

const getOnlyUsers = (request, response) => {
  pool.query("SELECT * FROM USERS WHERE ROLE = 'user'", (err, res) => {
    if (err) {
      throw err;
    }
    return response.send(res.rows);
  });
};

const getOnlyAdmins = (request, response) => {
  pool.query("SELECT * FROM USERS WHERE ROLE = 'admin' ", (err, res) => {
    if (err) {
      throw err;
    }
    return response.send(res.rows);
  });
};

const updatePassword = (request, response) => {
  const id = parseInt(request.params.id);
  const { oldPassword, newPassword, confirmNew } = request.body;
  pool.query("SELECT * FROM USERS WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    const compare = bcrypt.compareSync(oldPassword, res.rows[0].password);
    if (compare && newPassword == confirmNew) {
      pool.query("UPDATE USERS SET password = $1 WHERE ID = $2", [
        bcrypt.hashSync(newPassword),
        id,
      ]);
      return response.send(res.rows[0]);
    } else {
      return response.status(400).send("An Error Occured");
    }
  });
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
  updatePassword,
  getRole,
  getAddress,
  updateUserAdminSide,
  getOnlyAdmins,
  getLoggedInUser,
  getOnlyUsers,
};
