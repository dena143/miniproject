const { event, bookmark } = require("../../models");
const { Op } = require("sequelize");

exports.createBookmarkValidator = async (req, res, next) => {
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
    const savedEvent = await bookmark.findOne({
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

    if (savedEvent) {
      errors.push("You already saved for this event!");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }

    next();
  } catch (error) {
    next(error);
  }
};
