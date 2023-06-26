const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "ecom",
  password: "password",
  port: 5432,
});

const addReview = (request, response) => {
  const id = request.params.id;
  const { review, rating, name } = request.body;
  const newRating = parseInt(rating);
  pool.query("SELECT * FROM PRODUCTS WHERE NAME = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    pool.query(
      "SELECT * FROM REVIEWS WHERE USER_ID = $1 AND PRODUCT_ID = $2",
      [request.user.id, res.rows[0].id],
      (err, res) => {
        if (err) {
          throw err;
        }
        if (res.rowCount > 0) {
          pool.query(
            "UPDATE REVIEWS SET RATING = $1, REVIEW=$2, PUBLISH_DATE=$3, NAME = $4 WHERE USER_ID=$5",
            [rating, review, new Date(Date.now()), name, request.user.id],
            (err4, res4) => {
              if (err4) {
                throw err4;
              }
              return response.status(200).send(res4.rows);
            }
          );
        } else {
          pool.query(
            "SELECT * FROM PRODUCTS WHERE NAME = $1",
            [id],
            (err, res) => {
              if (err) {
                throw err;
              }
              pool.query(
                "INSERT INTO REVIEWS (USER_ID, PRODUCT_ID, RATING, REVIEW, NAME,PUBLISH_DATE) VALUES ($1, $2, $3, $4, $5, $6)",
                [
                  request.user.id,
                  res.rows[0].id,
                  newRating,
                  review,
                  name,
                  new Date(Date.now()),
                ],
                (err2, res2) => {
                  if (err2) {
                    throw err2;
                  }
                  return response.status(200).send(res2.rows);
                }
              );
            }
          );
        }
      }
    );
  });
};
const getReviews = (request, response) => {
  const id = request.params.id;
  pool.query("SELECT * FROM PRODUCTS WHERE NAME = $1", [id], (err2, res2) => {
    if (err2) {
      throw err2;
    }
    pool.query(
      "SELECT * FROM REVIEWS WHERE PRODUCT_ID = $1",
      [res2.rows[0].id],
      (err, res) => {
        if (err) {
          throw err;
        }
        return response.status(200).send(res.rows);
      }
    );
  });
};

const getAverageRating = (request, response) => {
  const id = request.params.id;
  pool.query("SELECT * FROM PRODUCTS WHERE NAME = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    pool.query(
      "SELECT * FROM REVIEWS WHERE PRODUCT_ID = $1",
      [res.rows[0].id],
      (err2, res2) => {
        if (err2) {
          throw err2;
        }
        let sum = 0;
        res2.rows.map((rating) => (sum = sum + rating.rating));
        let avgRating = sum / res2.rowCount;
        return response.status(200).send(avgRating.toString());
      }
    );
  });
};

module.exports = { addReview, getReviews, getAverageRating };
