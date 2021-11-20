const validator = require("validator");

exports.createOrUpdateCommentValidator = async (req, res, next) => {
  try {
    const errors = [];

    // Check input of comment
    if (validator.isEmpty(req.body.comment, { ignore_whitespace: true })) {
      errors.push("Please input the comment!");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }

    next();
  } catch (error) {
    next(error);
  }
};
