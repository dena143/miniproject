"use strict";
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("comments", [
      {
        comment: faker.lorem.words(),
        userId: 1,
        eventId: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 2,
        eventId: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 2,
        eventId: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 1,
        eventId: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 2,
        eventId: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 1,
        eventId: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 2,
        eventId: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 3,
        eventId: 34,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 3,
        eventId: 34,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 3,
        eventId: 33,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 3,
        eventId: 36,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 3,
        eventId: 36,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 3,
        eventId: 36,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 3,
        eventId: 36,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: faker.lorem.words(),
        userId: 1,
        eventId: 34,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("comments", null, {});
  },
};
