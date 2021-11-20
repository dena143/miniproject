const express = require("express");

const {
  createRatingValidator,
} = require("../middlewares/validators/ratingsValidator");

const { createRating } = require("../controllers/ratingControllers");

const router = express.Router();

router.post("/:id", createRatingValidator, createRating);

module.exports = router;
