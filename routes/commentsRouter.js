const express = require("express");

const {
  createOrUpdateCommentValidator,
} = require("../middlewares/validators/commentsValidator");

const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");

const router = express.Router();

// router.get("/", getAllComment);
router.post("/:id", createOrUpdateCommentValidator, createComment);
router.put("/:id", createOrUpdateCommentValidator, updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
