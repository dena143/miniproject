const validator = require("validator");
const { event, rating } = require("../../models");
const { Op } = require("sequelize");

exports.createRatingValidator = async (req, res, next) => {
  try {
    const errors = [];

    const eventID = await event.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (eventID.categoryId !== parseInt(req.body.categoryId)) {
      errors.push("Category event didn't match!");
    }

    // Check for user had or not input rating for one event
    const ratingUser = await rating.findOne({
      where: {
        [Op.and]: [
          {
            eventId: req.params.id,
          },
          {
            userId: req.loginUser.id,
          },
          {
            categoryId: req.body.categoryId,
          },
        ],
      },
    });

    if (ratingUser) {
      errors.push("You already added rating for this event!");
    }

    if (!validator.isInt(req.body.rating)) {
      errors.push("Please Input Number!");
    }

    if (req.body.rating > 5 || req.body.rating < 0) {
      errors.push("Rating must be in the range 0-5");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }

    next();
  } catch (error) {
    next(error);
  }
};
