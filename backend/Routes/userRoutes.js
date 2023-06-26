const userController = require("../Controllers/userController");
const express = require("express");
const router = express.Router();
const { verify, authorizeRole } = require("../middleware/auth");

router.post("/createUser", userController.createUser);
router.get("/users", verify, authorizeRole, userController.getUsers);
router.put("/updateUser/:id", verify, userController.updateUser);
router.post("/loginUser", userController.loginUser);
router.get("/logoutUser", verify, userController.logoutUser);
router.get("/user/:id", verify, userController.getUserDetails);
router.delete("/user/delete/:id", verify, userController.deleteUser);
router.put("/updatePass/:id", verify, userController.updatePassword);
router.get("/role/:id", verify, userController.getRole);
router.get("/address/:id", userController.getAddress);
router.put("/updateUserAdmin/:id", verify, userController.updateUserAdminSide);
router.get("/onlyUsers", userController.getOnlyUsers);
router.get("/onlyAdmin", userController.getOnlyAdmins);
router.get("/user", verify, userController.getLoggedInUser);

module.exports = router;
