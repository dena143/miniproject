const express = require("express");

const {
  createOrUpadateUserValidator,
  UpadateUserValidator,
} = require("../middlewares/validators/users");

const {
  getUserDetail,
  updateUser,
  deleteUser,
  myEvents,
} = require("../controllers/users");

const router = express.Router();

router.get("/myevent", myEvents);
router.get("/myprofile", getUserDetail);
router.put(
  "/update",
  createOrUpadateUserValidator,
  UpadateUserValidator,
  updateUser
);
router.delete("/:id", deleteUser);

module.exports = router;
