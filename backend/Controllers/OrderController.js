const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const deleteOrder = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM users WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    res.status(200).send(`User with ID: ${id} deleted!`);
  });
};

module.exports = { deleteOrder };
