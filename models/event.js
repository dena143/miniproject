"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.event.belongsTo(models.user, {
        foreignKey: "userId",
      });
      models.event.belongsTo(models.category, {
        foreignKey: "categoryId",
      });
      models.event.hasMany(models.comment, {
        foreignKey: "eventId",
      });
      models.event.hasMany(models.bookmark, {
        foreignKey: "eventId",
      });
      models.event.hasMany(models.rating, {
        foreignKey: "eventId",
      });
    }
  }
  event.init(
    {
      title: DataTypes.STRING,
      photoEvent: DataTypes.STRING,
      dateEvent: DataTypes.DATEONLY,
      eventTime: DataTypes.STRING,
      detail: DataTypes.STRING(600),
      linkMeet: DataTypes.STRING,
      speakerName: DataTypes.STRING,
      speakerJobTitle: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "event",
    }
  );
  return event;
};
