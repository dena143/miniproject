const { rating } = require("../models");

class Rating {
  static async createRating(req, res, next) {
    try {
      // Create Rating
      const newData = await rating.create({
        rating: req.body.rating,
        eventId: req.params.id,
        userId: req.loginUser.id,
        categoryId: req.body.categoryId,
      });
      // Find Data Rating
      const data = await rating.findOne({
        where: {
          id: newData.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      res.status(201).json({ data, message: ["Success Add Rating"] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Rating;
