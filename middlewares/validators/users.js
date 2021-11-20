const path = require("path");
const crypto = require("crypto");
const validator = require("validator");
const { promisify } = require("util");
const { user } = require("../../models");

// Make class of create or update users validator
exports.createOrUpadateUserValidator = async (req, res, next) => {
  try {
    const errors = [];

    //Check input of FirstName
    if (validator.isEmpty(req.body.firstName, { ignore_whitespace: true })) {
      errors.push("Please input the FirstName!");
    }

    //Check input of LastName
    if (validator.isEmpty(req.body.lastName, { ignore_whitespace: true })) {
      errors.push("Please input the LastName!");
    }

    if (!validator.isEmail(req.body.email)) {
      errors.push("Email is not valid");
    }

    if (req.body.password !== req.body.confirmPassword) {
      errors.push("password and confirm password didn't match!");
    }

    if (
      !validator.isStrongPassword(req.body.password, [
        {
          minLength: 10,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          maxLength: 20,
        },
      ])
    ) {
      errors.push(
        "password must include lowercase: min 1, uppercase: min 1, numbers: min 1, symbol: min 1, and length: min 10 characters & max 20 characters."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.UpadateUserValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (!(req.files && req.files.image)) {
      errors.push("Please upload the image");
    } else if (req.files.image) {
      // req.files.photoUser is come from key (file) in postman
      const file = req.files.image;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
      }

      // Check file size (max 1MB)
      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // Make file.mv to promise
      const move = promisify(file.mv);

      // Upload image to /public/images
      await move(`./public/images/users/${file.name}`);

      // assign req.body.image with file.name
      req.body.image = file.name;
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }

    next();
  } catch (error) {
    next(error);
  }
};
