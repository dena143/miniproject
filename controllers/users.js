const { user, event, category } = require("../models");
const { generateToken, encodePin, compare } = require("../utils");
const validator = require("validator");
const faker = require("faker");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "drta3xh4e",
  api_key: "699989283326316",
  api_secret: "urll8J8oczRkKJlCxHkLv6yQv9g",
});

class Users {
  static async createUser(req, res, next) {
    try {
      const { firstName, lastName, email, password, image } = req.body;
      const hashPassword = encodePin(password);

      // Find unique email
      const findEmail = await user.findOne({
        where: { email },
      });

      if (findEmail) {
        return res.status(400).json({
          status: 400,
          message: "Email already registered!",
        });
      }

      const newUser = await user.create({
        firstName,
        lastName,
        email,
        password: hashPassword,
        image: faker.image.avatar(),
      });

      const data = await user.findOne({
        attributes: ["id", "firstName", "lastName", "email"],
        where: {
          id: newUser.id,
        },
      });
      return res.status(201).json({
        status: 201,
        data,
        message: ["Your account has been created"],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserDetail(req, res, next) {
    try {
      const id = req.loginUser.id;
      const userData = await user.findOne({
        attributes: ["id", "firstName", "lastName", "email", "image"],
        where: {
          id,
        },
      });

      res.status(200).json({
        status: 200,
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const dataUser = await user.findOne({
        where: {
          email,
        },
      });

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          status: 400,
          message: "Please input email correctly!",
        });
      }

      if (!dataUser) {
        return res.status(401).json({
          status: 401,
          message: "Please signup first!",
        });
      }

      const hashPass = dataUser.password;
      const compareResult = compare(password, hashPass);
      //compare password
      if (dataUser.email && !compareResult) {
        return res.status(400).json({
          status: 400,
          message: "Please input password correctly!",
        });
      }

      const payload = dataUser.dataValues;
      const token = generateToken(payload);
      return res.status(200).json({
        status: 200,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  //update user
  static async updateUser(req, res, next) {
    try {
      const { firstName, lastName, email, password, image } = req.body;
      const hashPassword = encodePin(password);
      await user.update(
        {
          firstName,
          lastName,
          email,
          password: hashPassword,
          image,
        },
        { where: { id: req.loginUser.id } }
      );

      // Upload image to cloudinary and updated photo event value and send data
      cloudinary.uploader.upload(
        `./public/images/users/${req.body.image}`,
        async function (result, error) {
          let a = result.secure_url;

          // update photo of user value with image url
          const updateEvent2 = await user.update(
            {
              firstName,
              lastName,
              email,
              password: hashPassword,
              image: a,
            },
            { where: { id: req.loginUser.id } }
          );

          // Get inserted user
          const data = await user.findOne({
            attributes: {
              exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
            },
            where: { id: req.loginUser.id },
          });

          // send response with inserted data of user
          return res
            .status(201)
            .json({ data, message: ["Your profil has been updated!"] });
        }
      );
    } catch (error) {
      next(error);
    }
  }

  //delete User
  static async deleteUser(req, res, next) {
    try {
      const id = req.loginUser.id;
      const deletedUser = await user.destroy({
        where: {
          id,
        },
        returning: true,
      });

      if (!deletedUser) {
        return res.status(404).json({
          status: 404,
          message: "The User Not Found",
        });
      }

      return res.status(200).json({
        status: 200,
        data: {
          message: "Your account has been deleted! ",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Make myEvents function
  static async myEvents(req, res, next) {
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

      let myevent = await event.findAndCountAll({
        where: {
          userId: req.loginUser.id,
        },
        attributes: ["id", "userId", "photoEvent", "dateEvent", "title"],
        include: [
          { model: user, attributes: ["firstName"] },
          { model: category, attributes: ["category"] },
        ],
        limit,
        offset,
        order: [["dateEvent", "DESC"]],
      });

      if (myevent.rows.length === 0) {
        return res.status(404).json({ errors: ["Events not found"] });
      }

      return res.status(200).json(getPagingData(myevent, page, limit));
    } catch (error) {
      next(error);
    }
  }
}

//export module
module.exports = Users;
