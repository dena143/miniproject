"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.category.hasMany(models.event, {
        foreignKey: "categoryId",
      });
      models.category.hasMany(models.rating, {
        foreignKey: "categoryId",
      });
      models.category.hasMany(models.bookmark, {
        foreignKey: "categoryId",
      });
    }
  }
  category.init(
    {
      category: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "category",
    }
  );
  return category;
};
