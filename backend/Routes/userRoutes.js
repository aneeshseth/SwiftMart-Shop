const userController = require("../Controllers/userController");
const express = require("express");
const router = express.Router();
const features = require("../Features/pagination");

router.post("/createUser", userController.createUser);
router.get("/users", userController.getUsers);
router.put("/updateUser", userController.updateUser);
router.post("/loginUser", userController.loginUser);
router.get("/logoutUser", userController.logoutUser);
router.get("/user/:id", userController.getUserDetails);
router.delete("/user/delete/:id", userController.deleteUser);

module.exports = router;
