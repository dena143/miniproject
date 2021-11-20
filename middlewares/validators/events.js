const path = require("path");
const crypto = require("crypto");
const validator = require("validator");
const { promisify } = require("util");
const cloudinary = require("cloudinary").v2;

// Make class of create or update event validatro
exports.createOrUpadateEventValidator = async (req, res, next) => {
  try {
    const errors = [];

    //   Check input of title
    if (validator.isEmpty(req.body.title, { ignore_whitespace: false })) {
      errors.push("Please input the title!");
    }

    // Check for the image of event was upload or not

    if (!(req.files && req.files.photoEvent)) {
      errors.push("Please upload the image");
    } else if (req.files.photoEvent) {
      // If image was uploaded

      // req.files.photoEvent is come from key (file) in postman
      const file = req.files.photoEvent;

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
      await move(`./public/images/events/${file.name}`);

      // assign req.body.image with file.name
      req.body.photoEvent = file.name;
    }

    // Check input of date event
    if (!validator.isDate(req.body.dateEvent)) {
      errors.push("Please input the date correctly!");
    }

    // Check input of time for the event
    if (validator.isEmpty(req.body.eventTime, { ignore_whitespace: false })) {
      errors.push("Please input the time of event!");
    }

    // Check input of detail and min character 100
    if (
      !validator.isLength(req.body.detail, {
        min: 100,
        max: 600,
      })
    ) {
      errors.push("Detail of event min 100 and max 600 characters!");
    }

    // Check input of link meet
    if (!validator.isURL(req.body.linkMeet)) {
      errors.push("Link meet must be correctly!");
    }

    //   Check input of speaker name
    if (validator.isEmpty(req.body.speakerName, { ignore_whitespace: false })) {
      errors.push("Please input the name of speaker!");
    }

    //   Check input of jobtitle speaker
    if (
      validator.isEmpty(req.body.speakerJobTitle, { ignore_whitespace: false })
    ) {
      errors.push("Please input the jobtitle of speaker!");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }

    next();
  } catch (error) {
    next(error);
  }
};
