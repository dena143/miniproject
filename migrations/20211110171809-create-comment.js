"use strict";
const sequelize = require("sequelize");
const moment = require("moment");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      eventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createAt: {
        allowNull: false,
        defaultValue: sequelize.fn("now"),
        type: Sequelize.DATE,
      },
      updateAt: {
        allowNull: false,
        defaultValue: sequelize.fn("now"),
        type: Sequelize.DATEONLY,
      },
      createdAt: {
        type: Sequelize.DATE,
        //note here this is the guy that you are looking for
        get() {
          return moment(this.getDataValue("createdAt")).format(
            "DD/MM/YYYY h:mm:ss"
          );
        },
      },
      updatedAt: {
        type: Sequelize.DATE,
        get() {
          return moment(this.getDataValue("updatedAt")).format(
            "DD/MM/YYYY h:mm:ss"
          );
        },
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    // Make userId to be foreign key
    await queryInterface.addConstraint("comments", {
      fields: ["userId"],
      type: "foreign key",
      name: "custom_fkey_user_Id",
      references: {
        //Required field
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // Make eventId to be foreign key
    await queryInterface.addConstraint("comments", {
      fields: ["eventId"],
      type: "foreign key",
      name: "custom_fkey_event_Id",
      references: {
        //Required field
        table: "events",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("comments");
  },
};
