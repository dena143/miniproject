"use strict";
const { Model } = require("sequelize");
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.comment.belongsTo(models.user, {
        foreignKey: "userId",
      });

      models.comment.belongsTo(models.event, {
        foreignKey: "eventId",
      });
    }
  }
  comment.init(
    {
      comment: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATEONLY,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "comment",
    }
  );

  return comment;
};
