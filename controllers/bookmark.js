const { bookmark, user, category, event } = require("../models");
const { Op } = require("sequelize");

class Bookmark {
  static async getAllBookmarks(req, res, next) {
    try {
      // Make pagination
      const getPagination = (page, size) => {
        const limit = size ? +size : 8;
        const offset = (page - 1) * limit || 0;

        return { limit, offset };
      };

      // make paging data
      const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: events } = data;
        const currentPage = page ? +page : 1;
        const nextPage = page ? +page + 1 : 2;
        const prevPage = page ? +page - 1 : 1;
        const totalPages = Math.ceil(totalItems / limit);

        return {
          totalItems,
          events,
          totalPages,
          currentPage,
          prevPage,
          nextPage,
        };
      };

      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      const data = await bookmark.findAndCountAll({
        attributes: {
          exclude: ["eventId", "userId", "createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          { model: event, attributes: ["photoEvent", "dateEvent", "title"] },
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        where: {
          userId: req.loginUser.id,
        },
        limit,
        offset,
      });

      if (data.rows.length === 0) {
        return res.status(400).json({ errors: ["Bookmark not found!"] });
      }
      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  static async createBookmark(req, res, next) {
    try {
      const eventId = req.params.id;
      const userId = req.loginUser.id;
      const categoryId = req.body.categoryId;

      const newData = await bookmark.create({
        eventId,
        userId,
        categoryId,
      });

      return res.status(201).json({ message: ["Event has been saved!"] });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBookmark(req, res, next) {
    try {
      const deletedData = await bookmark.destroy({
        where: {
          id: req.params.id,
        },
      });

      if (!deletedData) {
        return res.status(400).json({ message: ["Bookmark not found!"] });
      }

      return res.status(200).json({ message: ["Success remove bookmark!"] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Bookmark;
