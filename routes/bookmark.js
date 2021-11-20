// Import express
const express = require("express");

// import controllers
const {
  getAllBookmarks,
  createBookmark,
  deleteBookmark,
} = require("../controllers/bookmark");

// Import Validator
const {
  createBookmarkValidator,
} = require("../middlewares/validators/bookmark");

// Make router express
const router = express.Router();

// it will find route that has / first, after that it will find is it GET or POST
router.get("/", getAllBookmarks);
router.post("/:id", createBookmarkValidator, createBookmark);

//   it will find route that has /:id first, after that it will find is it GET or DELETE
router.delete("/:id", deleteBookmark);

// export router
module.exports = router;
