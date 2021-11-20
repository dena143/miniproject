"use strict";
const moment = require("moment");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("events", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      photoEvent: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dateEvent: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      eventTime: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      detail: {
        allowNull: false,
        type: Sequelize.STRING(600),
      },
      linkMeet: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      speakerName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      speakerJobTitle: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    // Make userId to be foreign key
    await queryInterface.addConstraint("events", {
      fields: ["userId"],
      type: "foreign key",
      name: "custom_fkey_userId",
      references: {
        //Required field
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // Make categoryId to be foreign key
    await queryInterface.addConstraint("events", {
      fields: ["categoryId"],
      type: "foreign key",
      name: "custom_fkey_categoryId",
      references: {
        //Required field
        table: "categories",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("events");
  },
};
