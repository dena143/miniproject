// Import models
const { event, comment, user, category, rating } = require("../models");

// Import sequelize
const { Op } = require("sequelize");

// Import moment
const moment = require("moment-timezone");

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "drta3xh4e",
  api_key: "699989283326316",
  api_secret: "urll8J8oczRkKJlCxHkLv6yQv9g",
});

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

  return { totalItems, events, totalPages, currentPage, prevPage, nextPage };
};

class Events {
  static async getStartedEvent(req, res, next) {
    try {
      // Get started
      const dataStarted = await event.findAll({
        where: {
          dateEvent: {
            [Op.between]: [moment().startOf("day"), moment().add(7, "days")],
          },
        },
        attributes: ["photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit: 4,
        order: [["dateEvent", "ASC"]],
      });

      if (!dataStarted) {
        return res.status(404).json({ errors: ["Events not found"] });
      }
      // - Explore by category
      const dataCategory = await category.findAll({
        attributes: ["category"],
      });
      // - Design event
      const dataDesign = await event.findAll({
        where: { categoryId: 2 },
        attributes: ["photoEvent", "dateEvent", "eventTime", "title"],
        attributes: ["photoEvent", "dateEvent", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit: 4,
        order: [["dateEvent", "DESC"]],
      });
      return res.status(200).json({ dataStarted, dataCategory, dataDesign });
    } catch (error) {
      next(error);
    }
  }

  // Make getAllEvent function
  static async getAllEvents(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      let data = await event.findAndCountAll({
        attributes: ["id", "photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "DESC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }
      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Search Event
  static async searchEvent(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);
      const cari = req.body.cari;

      let data = await event.findAndCountAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.iLike]: `%${cari}%`,
              },
            },
            {
              speakerName: {
                [Op.iLike]: `%${cari}%`,
              },
            },
          ],
        },
        attributes: [
          "photoEvent",
          "dateEvent",
          "eventTime",
          "title",
          "speakerName",
        ],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "DESC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make getEventByCategory
  static async getEventByCategory(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      let data = await event.findAndCountAll({
        attributes: ["id", "photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        where: { categoryId: req.params.id },
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make getAllEventByToday filter by Today
  static async getAllEventsByToday(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      // today
      let data = await event.findAndCountAll({
        where: {
          dateEvent: {
            [Op.between]: [
              moment().startOf("day").local(),
              moment().endOf("day").local(),
            ],
          },
        },
        attributes: ["photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "ASC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make getAllEventByTomorrow filter by tomorrow
  static async getAllEventsByTomorrow(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      let a = new Date();
      let b = a.setDate(a.getDate() + 1);
      let c = new Date(b).setHours(0, 0, 0, 0);
      let d = new Date(b).setHours(23, 59, 0, 0);

      let data = await event.findAndCountAll({
        where: {
          dateEvent: {
            [Op.between]: [moment(c).local(), moment(d).local()],
          },
        },
        attributes: ["id", "photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "ASC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make getAllEventByWeek filter by week
  static async getAllEventsByWeek(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      // week
      const where = {
        dateEvent: {
          [Op.between]: [moment().startOf("day"), moment().add(7, "days")],
        },
      };

      let data = await event.findAndCountAll({
        where,
        attributes: ["id", "photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "ASC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make getAllEventByMonth filter by month
  static async getAllEventsByMonth(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      // Month
      let data = await event.findAndCountAll({
        where: {
          dateEvent: {
            [Op.between]: [moment().startOf("month"), moment().endOf("month")],
          },
        },
        attributes: ["id", "photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "ASC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make getAllEventByYear filter by year
  static async getAllEventsByYear(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      // Year
      let data = await event.findAndCountAll({
        where: {
          dateEvent: {
            [Op.between]: [moment().startOf("year"), moment().endOf("year")],
          },
        },
        attributes: ["id", "photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "ASC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make getDetailEvent function
  static async getDetailEvent(req, res, next) {
    try {
      const data = await event.findOne({
        where: { id: req.params.id },
      });

      if (!data) {
        res.status(401).json({ message: ["Event not found"] });
      }

      // To show all comments of this event
      const komen = await comment.findAll({
        attributes: ["id", "comment", "createdAt", "updatedAt"],
        include: [{ model: user, attributes: ["firstName", "image"] }],
        where: { eventId: data.id },
      });

      // To show all comments time
      comment.afterFind((instance) => {
        instance.forEach((el) => {
          let waktu = new Date(el.dataValues.updatedAt).toLocaleString(
            "en-US",
            {
              timeZone: "Asia/Jakarta",
            }
          );

          el.dataValues.waktuKomen = moment(
            waktu,
            "MM/DD/YYYY hh:mm:ss A"
          ).fromNow();
        });
      });

      /** count rating */
      const sumRate = await rating.sum("rating", {
        where: { eventId: req.params.id },
      });

      const countRate = await rating.count({
        where: { eventId: req.params.id },
      });

      const avg = sumRate / countRate;

      // send response
      return res.status(201).json({ data, komen, avg });
    } catch (error) {
      next(error);
    }
  }

  // Make getEventSortingByName function
  static async getEventsSortingByName(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      let data = await event.findAndCountAll({
        attributes: ["id", "photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["title", "ASC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make getEventSortingByDate function
  static async getEventsSortingByDate(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);

      let data = await event.findAndCountAll({
        attributes: ["id", "photoEvent", "dateEvent", "eventTime", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "ASC"]],
      });

      if (data.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(data, page, limit));
    } catch (error) {
      next(error);
    }
  }

  // Make create event function
  static async createEvent(req, res, next) {
    try {
      const {
        title,
        photoEvent,
        dateEvent,
        eventTime,
        detail,
        linkMeet,
        speakerName,
        speakerJobTitle,
        categoryId,
      } = req.body;
      const insertEvent = await event.create({
        title,
        photoEvent,
        dateEvent,
        eventTime,
        detail,
        linkMeet,
        speakerName,
        speakerJobTitle,
        userId: req.loginUser.id,
        categoryId,
      });

      // Upload image to cloudinary and updated photo event value and send data
      cloudinary.uploader.upload(
        `./public/images/events/${req.body.photoEvent}`,
        async function (result, error) {
          let a = result.secure_url;

          let b = insertEvent.dataValues.id;

          // update photo event value with image url
          const updateEvent = await event.update(
            {
              title,
              photoEvent: a,
              dateEvent,
              eventTime,
              detail,
              linkMeet,
              speakerName,
              speakerJobTitle,
              userId: req.loginUser.id,
              categoryId,
            },
            { where: { id: b } }
          );

          // Get inserted event
          const data = await event.findOne({
            where: { id: b },
          });

          // send response with inserted event
          return res
            .status(201)
            .json({ data, message: ["Event has been created!"] });
        }
      );
    } catch (error) {
      next(error);
    }
  }

  // Make update event function
  static async updateEvent(req, res, next) {
    try {
      const eventUser = await event.findOne({
        where: { id: req.params.id },
      });

      if (!eventUser) {
        return res.status(400).json({ message: ["Event not found!"] });
      }

      if (eventUser.userId !== req.loginUser.id) {
        return res.status(401).json({
          errors: ["You do not have permission to access this!"],
        });
      }

      const {
        title,
        photoEvent,
        dateEvent,
        eventTime,
        detail,
        linkMeet,
        speakerName,
        speakerJobTitle,
        categoryId,
      } = req.body;
      const updateEvent = await event.update(
        {
          title,
          photoEvent,
          dateEvent,
          eventTime,
          detail,
          linkMeet,
          speakerName,
          speakerJobTitle,
          userId: req.loginUser.id,
          categoryId,
        },
        { where: { id: req.params.id } }
      );

      // Upload image to cloudinary and updated photo event value and send data
      cloudinary.uploader.upload(
        `./public/images/events/${req.body.photoEvent}`,
        async function (result, error) {
          let a = result.secure_url;

          // update photo event value with image url
          const updateEvent2 = await event.update(
            {
              title,
              photoEvent: a,
              dateEvent,
              eventTime,
              detail,
              linkMeet,
              speakerName,
              speakerJobTitle,
              userId: req.loginUser.id,
              categoryId,
            },
            { where: { id: req.params.id } }
          );

          // Get inserted event
          const data = await event.findOne({
            where: { id: req.params.id },
          });

          // send response with inserted event
          return res
            .status(201)
            .json({ data, message: ["Event has been updated!"] });
        }
      );
    } catch (error) {
      next(error);
    }
  }

  // Make delete event function
  static async deleteEvent(req, res, next) {
    try {
      const eventUser = await event.findOne({
        where: { id: req.params.id },
      });

      if (!eventUser) {
        return res.status(400).json({ message: ["Event not found!"] });
      }

      if (eventUser.userId !== req.loginUser.id) {
        return res.status(401).json({
          errors: ["You do not have permission to access this!"],
        });
      }

      let data = await event.destroy({
        where: { id: req.params.id },
      });

      // If success
      return res.status(200).json({ message: "Event has been deleted!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Events;
