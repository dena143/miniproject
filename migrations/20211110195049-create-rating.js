"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ratings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      eventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      rating: {
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
    await queryInterface.addConstraint("ratings", {
      fields: ["userId"],
      type: "foreign key",
      name: "custom_ffkey_user_Id",
      references: {
        //Required field
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // Make eventId to be foreign key
    await queryInterface.addConstraint("ratings", {
      fields: ["eventId"],
      type: "foreign key",
      name: "custom_ffkey_event_Id",
      references: {
        //Required field
        table: "events",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // Make categoryId to be foreign key
    await queryInterface.addConstraint("ratings", {
      fields: ["categoryId"],
      type: "foreign key",
      name: "custom_fkey_category_Id",
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
    await queryInterface.dropTable("ratings");
  },
};
