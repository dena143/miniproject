"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.bookmark.belongsTo(models.user, {
        foreignKey: "userId",
      });

      models.bookmark.belongsTo(models.event, {
        foreignKey: "eventId",
      });

      models.bookmark.belongsTo(models.category, {
        foreignKey: "categoryId",
      });
    }
  }
  bookmark.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "bookmark",
    }
  );
  return bookmark;
};
