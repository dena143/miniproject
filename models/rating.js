"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.rating.belongsTo(models.user, {
        foreignKey: "userId",
      });

      models.rating.belongsTo(models.event, {
        foreignKey: "eventId",
      });

      models.rating.belongsTo(models.category, {
        foreignKey: "categoryId",
      });
    }
  }
  rating.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "rating",
    }
  );
  return rating;
};
